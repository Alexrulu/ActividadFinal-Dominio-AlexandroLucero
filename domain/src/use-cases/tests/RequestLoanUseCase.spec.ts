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
    findAll: vi.fn().mockResolvedValue([]),
  };
  
  let mockLoanRepo: LoanRepository = {
    findActiveByUserAndBook: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn(),
    findByUserId: vi.fn(),
  };
  beforeEach(() => {
    mockBookRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
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

  // Correcto funcionamiento ✅

  it("debería crear un préstamo sin modificar el stock", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 2);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    });
    expect(mockLoanRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usuario-1",
        bookId: "libro-1",
      })
    );
    expect(mockBookRepo.save).not.toHaveBeenCalled();
    expect(book.borrowedCopies).toBe(2); // Verifica que el stock no se haya modificado
  });

  it("debería crear una solicitud de préstamo con duración de 2 meses", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 2);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 2,
    });
    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = (mockLoanRepo.create as any).mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-1");
    expect(createdLoan.bookId).toBe("libro-1");
    const from = createdLoan.from;
    const to = createdLoan.to;
    const durationInMonthsFunction = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    expect(durationInMonthsFunction).toBe(2);
  });

  it("debería crear una solicitud de préstamo con duración de 1 mes", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 2);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    });
    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = (mockLoanRepo.create as any).mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-1");
    expect(createdLoan.bookId).toBe("libro-1");
    const from = createdLoan.from;
    const to = createdLoan.to;
    const durationInMonthsFunction = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    expect(durationInMonthsFunction).toBe(1);
  });

  // Errores esperados ❌

  it("debería lanzar un error si la duración del préstamo es mayor a 2 meses", async () => {
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 3,
    })).rejects.toThrow("La duración máxima para el préstamo es de 2 meses");
  });

  it("debería lanzar un error si el libro no existe", async () => {
    (mockBookRepo.findById as any).mockResolvedValue(null);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    })).rejects.toThrow("Libro no encontrado");
  });

  it("debería lanzar un error si el libro no tiene copias disponibles", async () => {
    const book = new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 1, 1);
    (mockBookRepo.findById as any).mockResolvedValue(book);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(useCase.execute({
      userId: "usuario-1",
      bookId: "libro-1",
      durationInMonths: 1,
    })).rejects.toThrow("No hay copias disponibles para prestar");
  });

  it("debería lanzar un error si ya existe un préstamo activo para el usuario y el libro", async () => {
    const mockLoan = new Loan("prestamo-1", "usuario-1", "libro-1", new Date(), new Date(), false, false);
    (mockBookRepo.findById as any).mockResolvedValue(
      new Book("libro-1", "El principito", "Antoine de Saint-Exupéry", 5, 2)
    );
    (mockLoanRepo.findActiveByUserAndBook as any).mockResolvedValue(mockLoan);
    const useCase = new RequestLoanUseCase(mockBookRepo, mockLoanRepo);
    await expect(
      useCase.execute({
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      })
    ).rejects.toThrow("El libro ya se te fue prestado");
  });


});

  
