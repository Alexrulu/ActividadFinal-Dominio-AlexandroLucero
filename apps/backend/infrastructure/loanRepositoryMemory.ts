import { Loan } from '../../../domain/src/entities/Loan'
import { LoanRepository } from '../../../domain/src/repositories/LoanRepository'

const db: Loan[] = [
  {
    id: "123",
    userId: "user1",
    bookId: "book1",
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
    returned: false,
    approved: false,
    returnRequested: false
  }
]

export class LoanRepositoryMemory implements LoanRepository {
  private db: Loan[] = db

  async findById(id: string): Promise<Loan | null> {
    return this.db.find(loan => loan.id === id) || null
  }

  async findAll(): Promise<Loan[]> {
    return [...this.db]
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    return this.db.filter(loan => loan.userId === userId)
  }

  async findActiveByUserAndBook(userId: string, bookId: string): Promise<Loan | null> {
    return (
      this.db.find(
        loan =>
          loan.userId === userId &&
          loan.bookId === bookId &&
          !loan.returned
      ) || null
    )
  }

  async create(loan: Loan): Promise<void> {
    const exists = this.db.some(l => l.id === loan.id)
    if (exists) throw new Error('El préstamo ya existe')
    this.db.push(loan)
  }

  async save(loan: Loan): Promise<void> {
    const index = this.db.findIndex(l => l.id === loan.id)
    if (index !== -1) {
      this.db[index] = loan
    } else {
      this.db.push(loan)
    }
  }

  clear() {
    this.db = []
  }
}
