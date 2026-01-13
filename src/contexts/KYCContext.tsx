import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface KYCData {
  fullName: string;
  idNumber: string;
  idType: 'passport' | 'driver_license' | 'national_id' | 'other';
  idImage: string | null;
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  submittedAt?: Date;
}

interface KYCContextType {
  kycData: KYCData;
  submitKYC: (data: Omit<KYCData, 'status' | 'submittedAt'>) => void;
  isVerified: boolean;
}

const defaultKYCData: KYCData = {
  fullName: '',
  idNumber: '',
  idType: 'passport',
  idImage: null,
  status: 'not_submitted',
};

const KYCContext = createContext<KYCContextType | undefined>(undefined);

export const KYCProvider = ({ children }: { children: ReactNode }) => {
  const [kycData, setKYCData] = useState<KYCData>(() => {
    const saved = localStorage.getItem('kycData');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        submittedAt: parsed.submittedAt ? new Date(parsed.submittedAt) : undefined,
      };
    }
    return defaultKYCData;
  });

  const submitKYC = (data: Omit<KYCData, 'status' | 'submittedAt'>) => {
    const newData: KYCData = {
      ...data,
      status: 'pending',
      submittedAt: new Date(),
    };
    setKYCData(newData);
    localStorage.setItem('kycData', JSON.stringify(newData));
  };

  const isVerified = kycData.status === 'approved';

  return (
    <KYCContext.Provider value={{ kycData, submitKYC, isVerified }}>
      {children}
    </KYCContext.Provider>
  );
};

export const useKYC = () => {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error('useKYC must be used within a KYCProvider');
  }
  return context;
};
