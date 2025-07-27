export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  from: Date;
  to: Date;
  returned: boolean;
  approved: boolean;
}

export function createLoan(params: {
  id: string;
  userId: string;
  bookId: string;
  from: Date;
  to: Date;
}): Loan {
  return {
    ...params,
    returned: false,
    approved: false,
  };
}

export function approveLoan(loan: Loan): void {
  if (loan.approved) throw new Error('El préstamo ya fue aprobado');
  loan.approved = true;
}

export function markLoanAsReturned(loan: Loan): void {
  loan.returned = true;
}


export function isLoanOverdue(loan: Loan, now: Date): boolean {
  return now > loan.to && !loan.returned;
}
