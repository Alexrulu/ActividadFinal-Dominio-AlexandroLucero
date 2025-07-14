import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequestLoanUseCase } from "../RequestLoanUseCase";
import { Book } from "../../entities/Book";
import { Loan } from "../../entities/Loan";
import type { BookRepository } from "../../repositories/BookRepository";
import type { LoanRepository } from "../../repositories/LoanRepository";

const mockBookRepo: BookRepository = {
  findById: vi.fn(),
  save: vi.fn(),
};

const mockLoanRepo: LoanRepository = {
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
};

describe("RequestLoanUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería crear un prestamo si hay copias disponibles", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 0);
    (mockBookRepo.findById as any).mockResolvedValue(book);

    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);

    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    });

    expect(mockBookRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        borrowedCopies: 1,
      })
    );

    expect(mockLoanRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usuario-1",
        bookId: "libro-1",
        returned: false,
      })
    );
  });
});

  it("debería lanzar un error si el libro no existe", async () => {
    (mockBookRepo.findById as any).mockResolvedValue(null);

    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);

    await expect(
      useCase.execute({
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      })
    ).rejects.toThrow("Libro no encontrado");
  });