import { describe, it, expect, vi, beforeEach } from "vitest";
import { requestLoanUseCase } from "../../../../domain/src/use-cases/RequestLoanUseCase";
import { Book } from "../../../../domain/src/entities/Book";
import { Loan } from "../../../../domain/src/entities/Loan";

function buildBook(overrides: Partial<Book> = {}): Book {
  return {
    id: "book-123",
    title: "Test Book",
    author: "Author",
    totalCopies: 3,
    borrowedCopies: 1,
    ...overrides,
  };
}

function buildLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: "loan-123",
    userId: "user-1",
    bookId: "book-123",
    from: new Date(),
    to: new Date(),
    returned: false,
    approved: false,
    returnRequested: false,
    ...overrides,
  };
}

describe("requestLoanUseCase", () => {
  let bookRepo: any;
  let loanRepo: any;
  beforeEach(() => {
    bookRepo = {
      findById: vi.fn(),
    };
    loanRepo = {
      findActiveByUserAndBook: vi.fn(),
      create: vi.fn(),
    };
  });

  it("deberia registrar un prestamo correctamente", async () => {
    const book = buildBook();
    bookRepo.findById.mockResolvedValue(book);
    loanRepo.findActiveByUserAndBook.mockResolvedValue(null);
    await requestLoanUseCase(
      { userId: "user-1", bookId: "book-123", durationInMonths: 1 },
      { bookRepo, loanRepo }
    );
    expect(loanRepo.create).toHaveBeenCalledOnce();
  });

  it("deberia lanzar error si duracion es inválida", async () => {
    await expect(() =>
      requestLoanUseCase(
        { userId: "user-1", bookId: "book-123", durationInMonths: 3 },
        { bookRepo, loanRepo }
      )
    ).rejects.toThrow("La duracion máxima para el prestamo es de 2 meses");
  });

  it("deberia lanzar error si el libro no existe", async () => {
    bookRepo.findById.mockResolvedValue(null);
    await expect(() =>
      requestLoanUseCase(
        { userId: "user-1", bookId: "book-404", durationInMonths: 1 },
        { bookRepo, loanRepo }
      )
    ).rejects.toThrow("Libro no encontrado");
  });

  it("deberia lanzar error si ya hay un prestamo activo sin devolucion", async () => {
    const book = buildBook();
    bookRepo.findById.mockResolvedValue(book);
    const activeLoan = buildLoan({ returned: false });
    loanRepo.findActiveByUserAndBook.mockResolvedValue(activeLoan);
    await expect(() =>
      requestLoanUseCase(
        { userId: "user-1", bookId: "book-123", durationInMonths: 1 },
        { bookRepo, loanRepo }
      )
    ).rejects.toThrow("El libro ya se te fue prestado");
  });

  it("deberia lanzar error si no hay copias disponibles", async () => {
    const book = buildBook({ totalCopies: 2, borrowedCopies: 2 });
    bookRepo.findById.mockResolvedValue(book);
    loanRepo.findActiveByUserAndBook.mockResolvedValue(null);
    await expect(() =>
      requestLoanUseCase(
        { userId: "user-1", bookId: "book-123", durationInMonths: 1 },
        { bookRepo, loanRepo }
      )
    ).rejects.toThrow("No hay copias disponibles para prestar");
  });
});
