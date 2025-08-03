import { describe, it, expect, vi, beforeEach } from "vitest";
import { requestLoanUseCase } from "../RequestLoanUseCase";
import { createLoan } from "../../entities/Loan";
import { createBook } from "../../entities/Book";
import type { BookRepository } from "../../repositories/BookRepository";
import type { LoanRepository } from "../../repositories/LoanRepository";

describe("RequestLoanUseCase", () => {

  let mockBookRepo: BookRepository;
  let mockLoanRepo: LoanRepository;
  beforeEach(() => {
    mockBookRepo = {
      findById: vi.fn(),
      findByTitleAndAuthor: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };
    mockLoanRepo = {
      findActiveByUserAndBook: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
    };
  });

  // Casos exitosos ✅

  it("deberia crear un prestamo sin modificar el stock", async () => {
    const book = createBook("libro-1", "El principito", "Antoine de Saint-Exupéry", 5);
    book.borrowedCopies = 2;
    (mockBookRepo.findById as any).mockResolvedValue(book);
    await requestLoanUseCase({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    }, { bookRepo: mockBookRepo, loanRepo: mockLoanRepo });
    expect(mockLoanRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usuario-1",
        bookId: "libro-1",
      })
    );
    expect(mockBookRepo.save).not.toHaveBeenCalled();
    expect(book.borrowedCopies).toBe(2);
  });

  it("deberia crear una solicitud de prestamo con duracion de 1 mes", async () => {
    const book = createBook("libro-1", "El principito", "Antoine de Saint-Exupéry", 5);
    book.borrowedCopies = 2;
    (mockBookRepo.findById as any).mockResolvedValue(book);
    await requestLoanUseCase({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    }, { bookRepo: mockBookRepo, loanRepo: mockLoanRepo });
    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = (mockLoanRepo.create as any).mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-1");
    expect(createdLoan.bookId).toBe("libro-1");
    const expectedTo = new Date(createdLoan.from)
    expectedTo.setDate(expectedTo.getDate() + 28); // 28 days = 1 month
    expect(createdLoan.to.toISOString()).toBe(expectedTo.toISOString());
  });

  it("deberia crear una solicitud de prestamo con duracion de 2 meses", async () => {
    const book = createBook("libro-1", "El principito", "Antoine de Saint-Exupéry", 5);
    book.borrowedCopies = 2;
    (mockBookRepo.findById as any).mockResolvedValue(book);
    await requestLoanUseCase({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 2,
    }, { bookRepo: mockBookRepo, loanRepo: mockLoanRepo });
    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = (mockLoanRepo.create as any).mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-1");
    expect(createdLoan.bookId).toBe("libro-1");
    const expectedTo = new Date(createdLoan.from)
    expectedTo.setDate(expectedTo.getDate() + 56); // 56 days = 2 months
    expect(createdLoan.to.toISOString()).toBe(expectedTo.toISOString());
  });

  // Casos fallidos ❌

  it("deberia lanzar un error si la duracion del prestamo es mayor a 2 meses", async () => {
    await expect(requestLoanUseCase({ userId: "usuario-1", bookId: "libro-1", durationInMonths: 3 }, 
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }))
      .rejects.toThrow("La duracion máxima para el prestamo es de 2 meses");
  });

  it("deberia lanzar un error si el libro no existe", async () => {
    (mockBookRepo.findById as any).mockResolvedValue(null);
    await expect(requestLoanUseCase({ userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 },
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }))
      .rejects.toThrow("Libro no encontrado");
  });

  it("deberia lanzar un error si el libro no tiene copias disponibles", async () => {
    const book = createBook("libro-1", "El principito", "Antoine de Saint-Exupéry", 1);
    book.borrowedCopies = 1; // No hay copias disponibles
    (mockBookRepo.findById as any).mockResolvedValue(book);
    await expect(requestLoanUseCase({ userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 }, 
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }))
      .rejects.toThrow("No hay copias disponibles para prestar");
  });

  it("deberia lanzar un error si ya existe un prestamo activo para el usuario con el libro", async () => {
    const book = createBook("libro-1", "El principito", "Antoine de Saint-Exupéry", 5);
    book.borrowedCopies = 2;
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const loan = createLoan({ 
      id: "1", 
      userId: "usuario-1", 
      bookId: "libro-1", 
      from: new Date(), 
      to: new Date()
    });
    (mockLoanRepo.findActiveByUserAndBook as any).mockResolvedValue(loan);
    await expect(requestLoanUseCase(
      { userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 }, 
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }))
      .rejects.toThrow("El libro ya se te fue prestado");
    expect(mockLoanRepo.findActiveByUserAndBook).toHaveBeenCalledWith("usuario-1", "libro-1");
  })
});

  
