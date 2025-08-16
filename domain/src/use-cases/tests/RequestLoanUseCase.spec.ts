import { describe, it, expect, vi, beforeEach } from "vitest";
import { requestLoanUseCase } from "../RequestLoanUseCase";
import { createLoan } from "../../entities/Loan";

describe("RequestLoanUseCase", () => {
  let mockBookRepo: any;
  let mockLoanRepo: any;

  beforeEach(() => {
    mockBookRepo = {
      findById: vi.fn(),
      findByTitleAndAuthor: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      save: vi.fn(),
      delete: vi.fn(),
    };

    mockLoanRepo = {
      findActiveByUserAndBook: vi.fn().mockResolvedValue(null),
      findActiveByUser: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
    };
  });

  const libro1 = {
    id: "libro-1",
    title: "El principito",
    author: "Antoine de Saint-Exupéry",
    totalCopies: 5,
    borrowedCopies: 2,
  };

  const libro2 = {
    id: "libro-2",
    title: "1984",
    author: "George Orwell",
    totalCopies: 3,
    borrowedCopies: 1,
  };

  it("deberia crear un prestamo sin modificar el stock", async () => {
    mockBookRepo.findById.mockResolvedValue(libro1);

    await requestLoanUseCase(
      {
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      },
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
    );

    expect(mockLoanRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usuario-1",
        bookId: "libro-1",
      })
    );
    expect(mockBookRepo.save).not.toHaveBeenCalled();
    expect(libro1.borrowedCopies).toBe(2);
  });

  it("deberia crear una solicitud de prestamo con duracion de 1 mes", async () => {
    mockBookRepo.findById.mockResolvedValue(libro1);

    await requestLoanUseCase(
      {
        userId: "usuario-1",
        bookId: "libro-1",
        durationInMonths: 1,
      },
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
    );

    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = mockLoanRepo.create.mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-1");
    expect(createdLoan.bookId).toBe("libro-1");
    const expectedTo = new Date(createdLoan.from);
    expectedTo.setDate(expectedTo.getDate() + 28);
    expect(createdLoan.to.toISOString()).toBe(expectedTo.toISOString());
  });

  it("deberia crear una solicitud de prestamo con duracion de 2 meses", async () => {
    mockBookRepo.findById.mockResolvedValue(libro2);

    await requestLoanUseCase(
      {
        userId: "usuario-2",
        bookId: "libro-2",
        durationInMonths: 2,
      },
      { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
    );

    expect(mockLoanRepo.create).toHaveBeenCalled();
    const createdLoan = mockLoanRepo.create.mock.calls[0][0];
    expect(createdLoan.userId).toBe("usuario-2");
    expect(createdLoan.bookId).toBe("libro-2");
    const expectedTo = new Date(createdLoan.from);
    expectedTo.setDate(expectedTo.getDate() + 56);
    expect(createdLoan.to.toISOString()).toBe(expectedTo.toISOString());
  });

  it("deberia lanzar un error si la duracion del prestamo es mayor a 2 meses", async () => {
    await expect(
      requestLoanUseCase(
        { userId: "usuario-1", bookId: "libro-1", durationInMonths: 3 },
        { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
      )
    ).rejects.toThrow("La duracion máxima para el prestamo es de 2 meses");
  });

  it("deberia lanzar un error si el libro no existe", async () => {
    mockBookRepo.findById.mockResolvedValue(null);
    await expect(
      requestLoanUseCase(
        { userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 },
        { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
      )
    ).rejects.toThrow("Libro no encontrado");
  });

  it("deberia lanzar un error si el libro no tiene copias disponibles", async () => {
    const libroSinCopias = {
      id: "libro-3",
      title: "Sin copias",
      author: "Autor Desconocido",
      totalCopies: 1,
      borrowedCopies: 1,
    };
    mockBookRepo.findById.mockResolvedValue(libroSinCopias);

    await expect(
      requestLoanUseCase(
        { userId: "usuario-1", bookId: "libro-3", durationInMonths: 1 },
        { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
      )
    ).rejects.toThrow("No hay copias disponibles para prestar");
  });

  it("deberia lanzar un error si ya existe un prestamo activo para el usuario", async () => {
    mockBookRepo.findById.mockResolvedValue(libro1);

    const loan = createLoan({
      id: "1",
      userId: "usuario-1",
      bookId: "libro-1",
      from: new Date(),
      to: new Date(),
    });
    mockLoanRepo.findActiveByUserAndBook.mockResolvedValue(loan);

    await expect(
      requestLoanUseCase(
        { userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 },
        { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
      )
    ).rejects.toThrow("El libro ya se te fue prestado");

    expect(mockLoanRepo.findActiveByUserAndBook).toHaveBeenCalledWith("usuario-1", "libro-1");
  });

  it("deberia lanzar un error si el usuario ya tiene un prestamo activo", async () => {
    mockBookRepo.findById.mockResolvedValue(libro1);

    const loan = createLoan({
      id: "1",
      userId: "usuario-1",
      bookId: "libro-1",
      from: new Date(),
      to: new Date(),
    });
    mockLoanRepo.findActiveByUser.mockResolvedValue(loan);

    await expect(
      requestLoanUseCase(
        { userId: "usuario-1", bookId: "libro-1", durationInMonths: 1 },
        { bookRepo: mockBookRepo, loanRepo: mockLoanRepo }
      )
    ).rejects.toThrow("Ya tienes un préstamo activo, no puedes solicitar otro");
  });
});
