import { useState } from 'react';
import { useLoan } from '@/contexts/LoanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Coins, Clock, Info } from 'lucide-react';

const currencies = [
  { symbol: 'USDT', name: 'Tether', maxLoan: 50000 },
  { symbol: 'BTC', name: 'Bitcoin', maxLoan: 2 },
  { symbol: 'ETH', name: 'Ethereum', maxLoan: 20 },
  { symbol: 'BNB', name: 'BNB', maxLoan: 100 },
  { symbol: 'SOL', name: 'Solana', maxLoan: 500 },
];

const LoanApplication = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const { applyLoan, loans } = useLoan();

  const selectedCurrency = currencies.find(c => c.symbol === currency);
  const activeLoans = loans.filter(l => l.status === 'active');

  const handleApply = () => {
    const loanAmount = parseFloat(amount);
    
    if (!loanAmount || loanAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedCurrency && loanAmount > selectedCurrency.maxLoan) {
      toast.error(`Maximum loan for ${currency} is ${selectedCurrency.maxLoan}`);
      return;
    }

    if (activeLoans.length >= 3) {
      toast.error('Maximum 3 active loans allowed');
      return;
    }

    const success = applyLoan(loanAmount, currency);
    if (success) {
      toast.success(`Successfully borrowed ${loanAmount} ${currency}`);
      setAmount('');
    } else {
      toast.error('Failed to process loan');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Apply for Loan</h3>
      </div>

      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="space-y-2">
          <Label>Select Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.symbol} value={c.symbol}>
                  <div className="flex items-center gap-2">
                    <span>{c.symbol}</span>
                    <span className="text-muted-foreground text-sm">- {c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label>Loan Amount</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {currency}
            </span>
          </div>
          {selectedCurrency && (
            <p className="text-xs text-muted-foreground">
              Max: {selectedCurrency.maxLoan.toLocaleString()} {currency}
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {selectedCurrency && [0.25, 0.5, 0.75, 1].map((ratio) => (
            <Button
              key={ratio}
              variant="outline"
              size="sm"
              onClick={() => setAmount((selectedCurrency.maxLoan * ratio).toString())}
            >
              {ratio * 100}%
            </Button>
          ))}
        </div>

        {/* Loan Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>Interest-free period: 7 days</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-yellow-500" />
            <span>After 7 days: 1% daily interest</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-red-500" />
            <span>After 15 days: 2% daily penalty</span>
          </div>
        </div>

        {/* Active Loans Warning */}
        {activeLoans.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              You have {activeLoans.length} active loan(s). Max 3 allowed.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          className="w-full btn-primary" 
          size="lg"
          onClick={handleApply}
          disabled={activeLoans.length >= 3}
        >
          Apply for Loan
        </Button>
      </div>
    </div>
  );
};

export default LoanApplication;
