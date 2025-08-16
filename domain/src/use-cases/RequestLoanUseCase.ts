import { BookRepository } from "../repositories/BookRepository";
import { LoanRepository } from "../repositories/LoanRepository";
import { hasAvailableCopies } from "../entities/Book";
import { createLoan } from "../entities/Loan";
import { randomUUID } from "crypto";
import { Loan } from "../entities/Loan";

export type RequestLoanInput = {
  userId: string;
  bookId: string;
  durationInMonths: number;
};

export type RequestLoanDeps = {
  bookRepo: BookRepository;
  loanRepo: LoanRepository;
};

export async function requestLoanUseCase(
  input: RequestLoanInput,
  deps: RequestLoanDeps
): Promise<Loan> {
  const { bookRepo, loanRepo } = deps;
  const { userId, bookId, durationInMonths } = input;

  if (durationInMonths !== 1 && durationInMonths !== 2) {
    throw new Error("La duracion máxima para el prestamo es de 2 meses");
  }

  const userActiveLoan = await loanRepo.findActiveByUser(userId);
  if (userActiveLoan) {
    throw new Error("Ya tienes un préstamo activo, no puedes solicitar otro");
  }

  const existingLoan = await loanRepo.findActiveByUserAndBook(userId, bookId);

  const book = await bookRepo.findById(bookId);
  if (!book) {
    throw new Error("Libro no encontrado");
  }

  if (existingLoan && !existingLoan.returned) {
    throw new Error("El libro ya se te fue prestado");
  }

  if (!hasAvailableCopies(book)) {
    throw new Error("No hay copias disponibles para prestar");
  }

  const now = new Date();
  const returnDate = new Date(now);
  returnDate.setDate(returnDate.getDate() + durationInMonths * 28);

  const loan = createLoan({
    id: randomUUID(),
    userId,
    bookId,
    from: now,
    to: returnDate
  });

  await loanRepo.create(loan);
  return loan;
}
