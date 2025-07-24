import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";

interface ApproveLoanInput {
  loanId: string;
}

export class ApproveLoanUseCase {
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly bookRepo: BookRepository
  ) {}

  async execute(input: ApproveLoanInput): Promise<void> {
    const loan = await this.loanRepo.findById(input.loanId);
    if (!loan) throw new Error("Préstamo no encontrado");

    if (loan.approved) throw new Error("El préstamo ya fue aprobado");

    const book = await this.bookRepo.findById(loan.bookId);
    if (!book) throw new Error("Libro no encontrado");

    if (!book.hasAvailableCopies()) {
      throw new Error("No hay copias disponibles para aprobar el préstamo");
    }

    book.borrow(); // aumenta borrowedCopies
    loan.approve(); // método que deberías agregar en Loan

    await this.bookRepo.save(book);
    await this.loanRepo.save(loan);
  }
}
