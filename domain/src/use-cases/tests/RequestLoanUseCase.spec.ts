import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequestLoanUseCase } from "../RequestLoanUseCase";
import { Book } from "../../entities/Book";
import { Loan } from "../../entities/Loan";
import type { BookRepository } from "../../repositories/BookRepository";
import type { LoanRepository } from "../../repositories/LoanRepository";

describe("RequestLoanUseCase", () => {

  let mockBookRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
  };
  
  let mockLoanRepo: LoanRepository = {
    findActiveByUserAndBook: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
  };
  beforeEach(() => {
    mockBookRepo = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    mockLoanRepo = {
      findActiveByUserAndBook: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };
  });

  // Correcto funcionamiento ✅

  it("debería crear un prestamo si hay copias disponibles / prestamo de 1 mes", async () => {
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

  it("solicitar un prestamo con duración de 2 meses", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 0);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 2,
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

  it("dos usuarios pueden solicitar el mismo libro si hay copias suficientes", async () => {
    const book1 = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 0);
    const book2 = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 1);
    (mockBookRepo.findById as any)
      .mockResolvedValueOnce(book1)
      .mockResolvedValueOnce(book2);
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
    await useCase.execute({
      userId: "usuario-2",
      bookId: "libro-1",
      durationInMonths: 1,
    });
    expect(mockBookRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        borrowedCopies: 2,
      })
    );
    expect(mockLoanRepo.create).toHaveBeenCalledTimes(2);
  });

  it("un usuario pide la última copia de un libro, luego la devuelve, y otro usuario solicita el mismo libro", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 4);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    });
    expect(mockBookRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ borrowedCopies: 5 })
    );
    book.return();
    (mockBookRepo.findById as any).mockResolvedValue(book);
    await useCase.execute({
      userId: "usuario-2",
      bookId: "libro-1",
      durationInMonths: 1,
    });
    expect(mockBookRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ borrowedCopies: 5 })
    );
    expect(mockLoanRepo.create).toHaveBeenCalledTimes(2);
  });

  // Errores esperados ❌

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

  it("debería lanzar un error si no hay copias disponibles", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 0, 0);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(
      useCase.execute({
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      })
    ).rejects.toThrow("No hay copias disponibles para prestar");
  });

  it("debería lanzar un error si el prestamo solicitado por el usuario ya existe", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 0);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    (mockLoanRepo.findById as any).mockResolvedValue(new Loan("prestamo-1", "usuario-1", "libro-1", new Date(2025,6,14), new Date(2025,7,14), false));
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(
      useCase.execute({
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      })
    ).rejects.toThrow("El libro ya se te fue prestado");
  });

  it("debería lanzar un error si el libro se solicita por más de 2 meses o un número no permitido", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 0);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(
      useCase.execute({
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 3,
      })
    ).rejects.toThrow("La duración máxima para el préstamo es de 2 meses");
  });

});

  
