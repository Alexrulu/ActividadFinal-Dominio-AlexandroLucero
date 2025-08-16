import { Loan } from '../../../domain/src/entities/Loan'
import { LoanRepository } from '../../../domain/src/repositories/LoanRepository'
import loansData from '../data/loans.json'

const db: Loan[] = loansData as Loan[]

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

  // Nuevo método para buscar cualquier préstamo activo del usuario
  async findActiveByUser(userId: string): Promise<Loan | null> {
    return this.db.find(loan => loan.userId === userId && !loan.returned) || null
  }

  async create(loan: Loan): Promise<void> {
    const exists = this.db.some(l => l.id === loan.id)
    if (exists) throw new Error('El prestamo ya existe')
    this.db.push(loan)
  }

  async delete(id: string): Promise<void> {
    this.db = this.db.filter(loan => loan.id !== id);
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
