import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Loan } from '@domain/entities/Loan';

interface LoanResponse extends Loan {
  message: string;
  durationInMonths: number;
}

export function useRequestLoan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loanInfo, setLoanInfo] = useState<LoanResponse | null>(null);
  const navigate = useNavigate();

  const requestLoan = async (bookId: string, durationInMonths: number = 1, onLoanRequested?: () => void) => {
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/loans/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, durationInMonths })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al solicitar préstamo');
      }

      const data: LoanResponse = await res.json();
      setSuccess(data.message || 'Préstamo solicitado exitosamente');
      setLoanInfo(data);

      if (onLoanRequested) onLoanRequested();
    } catch (err: any) {
      setError(err.message || 'Error al solicitar préstamo');
    } finally {
      setLoading(false);
    }
  };

  return { requestLoan, loading, error, success, loanInfo };
}
