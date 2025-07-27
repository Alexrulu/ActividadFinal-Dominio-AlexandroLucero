import { LoanRepository } from "../repositories/LoanRepository";
import { markLoanAsReturned } from "../entities/Loan";
import { returnBook } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";

export async function approveReturnUseCase(
  input: { loanId: string },
  loanRepo: LoanRepository,
  bookRepo: BookRepository
): Promise<void> {
  const loan = await loanRepo.findById(input.loanId);
  if (!loan) throw new Error("Préstamo no encontrado");

  if (loan.returned) throw new Error("El préstamo ya fue devuelto");

  const book = await bookRepo.findById(loan.bookId);
  if (!book) throw new Error("Libro no encontrado");

  markLoanAsReturned(loan);
  const updatedBook = returnBook(book);

  await loanRepo.save(loan);
  await bookRepo.save(updatedBook);
}