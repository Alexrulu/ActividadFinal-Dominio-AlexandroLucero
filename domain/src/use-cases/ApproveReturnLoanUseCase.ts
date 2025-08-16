import { LoanRepository } from "../repositories/LoanRepository";
import { returnBook } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";
import { markLoanAsReturned } from "../entities/Loan";

export async function approveReturnLoanUseCase(
  input: { loanId: string },
  loanRepo: LoanRepository,
  bookRepo: BookRepository
): Promise<void> {
  const loan = await loanRepo.findById(input.loanId);
  if (!loan) throw new Error("Prestamo no encontrado");
  if (!loan.approved) throw new Error("El prestamo no fue aprobado");
  if (!loan.returnRequested) throw new Error("No hay solicitud de devolución");
  if (loan.returned) throw new Error("La solicitud de devolucion ya fue aprobada");

  const book = await bookRepo.findById(loan.bookId);
  if (!book) throw new Error("Libro no encontrado");

  markLoanAsReturned(loan);

  const updatedBook = returnBook(book);
  await bookRepo.save(updatedBook);

  await loanRepo.delete(loan.id);
}