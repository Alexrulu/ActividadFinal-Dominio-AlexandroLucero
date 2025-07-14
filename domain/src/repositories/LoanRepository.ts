import { Loan } from "../entities/Loan";

export interface LoanRepository {
  findById(id: string): Promise<Loan | null>;
  create(loan: Loan): Promise<void>;
}