import { Loan } from "../entities/Loan";

export interface LoanRepository {
  findActiveByUserAndBook(userId: string, bookId: string): Promise<Loan | null>
  findById(id: string): Promise<Loan | null>;
  create(loan: Loan): Promise<void>;
  save(loan: Loan): Promise<void>;
}