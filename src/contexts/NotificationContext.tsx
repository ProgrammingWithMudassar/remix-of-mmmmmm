import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLoan, Loan } from './LoanContext';

export interface Notification {
  id: string;
  type: 'loan_reminder' | 'system' | 'info';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  loanId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [checkedLoans, setCheckedLoans] = useState<Set<string>>(new Set());
  const { loans } = useLoan();

  const checkLoanReminders = useCallback(() => {
    const now = new Date();
    const activeLoans = loans.filter(l => l.status === 'active');
    
    activeLoans.forEach(loan => {
      const borrowDate = new Date(loan.borrowDate);
      const daysElapsed = Math.floor((now.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // 免息期7天，所以到期日是借款后第7天
      const daysUntilDue = 7 - daysElapsed;
      
      // 到期前3天提醒 (第4-5天)
      const threeDayKey = `${loan.id}_3day`;
      if (daysUntilDue <= 3 && daysUntilDue > 1 && !checkedLoans.has(threeDayKey)) {
        const notification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'loan_reminder',
          title: '贷款即将到期提醒',
          message: `您有一笔 ${loan.amount.toLocaleString()} ${loan.currency} 的贷款将在 ${daysUntilDue} 天后进入计息期。请及时还款以避免产生利息。`,
          createdAt: new Date(),
          read: false,
          loanId: loan.id
        };
        setNotifications(prev => [notification, ...prev]);
        setCheckedLoans(prev => new Set(prev).add(threeDayKey));
      }
      
      // 到期前1天提醒 (第6天)
      const oneDayKey = `${loan.id}_1day`;
      if (daysUntilDue === 1 && !checkedLoans.has(oneDayKey)) {
        const notification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'loan_reminder',
          title: '⚠️ 贷款明天到期',
          message: `您有一笔 ${loan.amount.toLocaleString()} ${loan.currency} 的贷款将于明天进入计息期。请尽快还款！`,
          createdAt: new Date(),
          read: false,
          loanId: loan.id
        };
        setNotifications(prev => [notification, ...prev]);
        setCheckedLoans(prev => new Set(prev).add(oneDayKey));
      }
      
      // 已逾期提醒
      const overdueKey = `${loan.id}_overdue`;
      if (daysUntilDue < 0 && !checkedLoans.has(overdueKey)) {
        const notification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'loan_reminder',
          title: '🚨 贷款已逾期',
          message: `您有一笔 ${loan.amount.toLocaleString()} ${loan.currency} 的贷款已逾期 ${Math.abs(daysUntilDue)} 天，正在产生利息。请立即还款！`,
          createdAt: new Date(),
          read: false,
          loanId: loan.id
        };
        setNotifications(prev => [notification, ...prev]);
        setCheckedLoans(prev => new Set(prev).add(overdueKey));
      }
    });
  }, [loans, checkedLoans]);

  useEffect(() => {
    checkLoanReminders();
    // 每小时检查一次
    const interval = setInterval(checkLoanReminders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkLoanReminders]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
