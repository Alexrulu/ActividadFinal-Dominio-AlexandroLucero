import { Loan } from "../entities/Loan";

export interface LoanRepository {
  findActiveByUserAndBook(userId: string, bookId: string): Promise<Loan | null>
  findById(id: string): Promise<Loan | null>;
  findAll(): Promise<Loan[]>;
  findByUserId(userId: string): Promise<Loan[]>;
  create(loan: Loan): Promise<void>;
  save(loan: Loan): Promise<void>;
}