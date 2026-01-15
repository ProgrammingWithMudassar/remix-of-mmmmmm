import { useLoan } from '@/contexts/LoanContext';
import { History, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

const LoanHistory = () => {
  const { loans, calculateOwed } = useLoan();

  // Show all loans, not just repaid/rejected
  const allLoans = loans;

  if (allLoans.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Loan History</h3>
        </div>
        <div className="text-center py-12">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No loan history yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your loans will appear here
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-600">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-600">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-600">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        );
      case 'repaid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-600">
            <CheckCircle className="w-3 h-3" />
            Repaid
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-600">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Loan History</h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {allLoans.length} total
        </span>
      </div>

      <div className="space-y-3">
        {allLoans.map((loan) => {
          const borrowDate = new Date(loan.borrowDate);
          const repaidDate = loan.repaidDate ? new Date(loan.repaidDate) : null;
          const owed = calculateOwed(loan);

          return (
            <div 
              key={loan.id} 
              className="bg-muted/50 rounded-lg p-4 border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{loan.amount.toLocaleString()} {loan.currency}</span>
                  {getStatusBadge(loan.status)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {borrowDate.toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Application Date</span>
                  <span>{borrowDate.toLocaleDateString()}</span>
                </div>
                {loan.status === 'repaid' && repaidDate && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Repaid Date</span>
                    <span>{repaidDate.toLocaleDateString()}</span>
                  </div>
                )}
                {(loan.status === 'approved' || loan.status === 'overdue') && (
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span>Current Owed</span>
                    <span>{owed.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {loan.currency}</span>
                  </div>
                )}
                {loan.status === 'repaid' && (
                  <div className="flex justify-between font-medium pt-2 border-t border-border text-green-600">
                    <span>Status</span>
                    <span>Fully Paid</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanHistory;
