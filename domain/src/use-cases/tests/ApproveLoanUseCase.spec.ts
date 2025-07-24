import { ApproveLoanUseCase } from '../ApproveLoanUseCase';
import { LoanRepository } from '../../repositories/LoanRepository';
import { BookRepository } from '../../repositories/BookRepository';
import { Loan } from '../../entities/Loan';
import { Book } from '../../entities/Book';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ApproveLoanUseCase', () => {
  let loanRepository: LoanRepository;
  let bookRepository: BookRepository;
  let useCase: ApproveLoanUseCase;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as any;

    bookRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as any;

    useCase = new ApproveLoanUseCase(loanRepository, bookRepository);
  });

  // Correcto funcionamiento ✅

  it('debería aprobar un préstamo modificando el stock del libro', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = new Book(bookId, 'Libro de prueba', 'chincho poroto', 5, 0);
    const loan = new Loan(loanId, bookId, 'user123', new Date(), new Date(), false);
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    await useCase.execute({ loanId });
    expect(loan.approved).toBe(true);
    expect(book.borrowedCopies).toBe(1);
    expect(book.totalCopies - book.borrowedCopies).toBe(4);
    expect(book.hasAvailableCopies()).toBe(true);
    expect(loanRepository.save).toHaveBeenCalledWith(loan);
    expect(bookRepository.save).toHaveBeenCalledWith(book);
  });

  // Errores esperados ❌

  it('debería lanzar un error si el préstamo ya está aprobado', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = new Book(bookId, 'Libro de prueba', 'chincho poroto', 5, 0);
    const loan = new Loan(loanId, bookId, 'user123', new Date(), new Date(), false, true);
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    await expect(useCase.execute({ loanId })).rejects.toThrow('El préstamo ya fue aprobado');
  });

  it('debería lanzar un error si el libro no existe', async () => {
    const loanId = 'loan123';
    const loan = new Loan(loanId, 'book123', 'user123', new Date(), new Date(), false);
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(useCase.execute({ loanId })).rejects.toThrow('Libro no encontrado');
  });

  it('debería lanzar un error si no hay copias disponibles para aprobar el préstamo', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = new Book(bookId, 'Libro de prueba', 'chincho poroto', 0, 0);
    const loan = new Loan(loanId, bookId, 'user123', new Date(), new Date(), false);
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    await expect(useCase.execute({ loanId })).rejects.toThrow('No hay copias disponibles para aprobar el préstamo');
  });

  it('debería lanzar un error si el préstamo no existe', async () => {
    const loanId = 'loan123';
    loanRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(useCase.execute({ loanId })).rejects.toThrow('Préstamo no encontrado');
  });

  it('debería lanzar un error si el libro no existe al aprobar un préstamo', async () => {
    const loanId = 'loan123';
    const loan = new Loan(loanId, 'book123', 'user123', new Date(), new Date(), false);
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(useCase.execute({ loanId })).rejects.toThrow('Libro no encontrado');
  });

});
