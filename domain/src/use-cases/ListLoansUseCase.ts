import { Loan } from '../entities/Loan';
import { LoanRepository } from '../repositories/LoanRepository';

interface ListLoansRequest {
  requesterId: string;
  requesterRole: 'admin' | 'user';
}

interface ListLoansResponse {
  loans: Loan[];
}

export async function listLoansUseCase(
  request: ListLoansRequest,
  loanRepository: LoanRepository
): Promise<ListLoansResponse> {
  const { requesterId, requesterRole } = request;

  let loans: Loan[];

  if (requesterRole === 'admin') {
    loans = await loanRepository.findAll();
  } else {
    loans = await loanRepository.findByUserId(requesterId);
  }

  return { loans };
}
