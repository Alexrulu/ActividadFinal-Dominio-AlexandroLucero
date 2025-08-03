import { Loan } from '../entities/Loan';
import { LoanRepository } from '../repositories/LoanRepository';

interface ListLoansRequest {
  requesterId: string;
  requesterRole: 'admin' | 'user';
}

export async function listLoansUseCase(
  request: ListLoansRequest,
  loanRepo: LoanRepository
): Promise<Loan[]> {
  const { requesterId, requesterRole } = request;

  let loans

  if (requesterRole === 'admin') {
    loans = await loanRepo.findAll();
  } else {
    loans = await loanRepo.findByUserId(requesterId);
  }

  return loans;
}
