import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";
import { hasAvailableCopies, borrowBook } from "../entities/Book";
import { approveLoan } from "../entities/Loan";

export async function approveLoanUseCase(
  input: { loanId: string },
  loanRepo: LoanRepository,
  bookRepo: BookRepository
): Promise<void> {
  const loan = await loanRepo.findById(input.loanId);
  if (!loan) throw new Error("Préstamo no encontrado");

  if (loan.approved) throw new Error("El préstamo ya fue aprobado");

  const book = await bookRepo.findById(loan.bookId);
  if (!book) throw new Error("Libro no encontrado");

  if (!hasAvailableCopies(book)) {
    throw new Error("No hay copias disponibles para aprobar el préstamo");
  }

  const updatedBook = borrowBook(book);
  approveLoan(loan);

  await bookRepo.save(updatedBook);
  await loanRepo.save(loan);
}
