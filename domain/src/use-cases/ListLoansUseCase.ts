import { Loan } from '../entities/Loan'
import { LoanRepository } from '../repositories/LoanRepository'

interface ListLoansRequest {
  requesterId: string
  requesterRole: 'admin' | 'user'
}

interface ListLoansResponse {
  loans: Loan[]
}

export class ListLoansUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(request: ListLoansRequest): Promise<ListLoansResponse> {
    const { requesterId, requesterRole } = request

    let loans: Loan[]

    if (requesterRole === 'admin') {
      loans = await this.loanRepository.findAll()
    } else {
      loans = await this.loanRepository.findByUserId(requesterId)
    }

    return { loans }
  }
}
