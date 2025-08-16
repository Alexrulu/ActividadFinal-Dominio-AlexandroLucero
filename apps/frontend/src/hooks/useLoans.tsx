import { useState, useEffect, useCallback } from 'react';
import type { Loan } from '../../../../domain/src/entities/Loan';

export function useLoans(userId: string | null) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLoan = useCallback(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`http://localhost:3000/loans/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        requesterId: userId,
        requesterRole: 'user',
      }),
    })
      .then(res => res.json())
      .then(data => {
        setLoan(data.loans && data.loans.length > 0 ? data.loans[0] : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  const refreshLoan = () => fetchLoan();

  return { loan, loading, refreshLoan };
}
