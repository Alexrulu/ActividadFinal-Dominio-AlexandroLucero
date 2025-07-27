import { approveLoanUseCase } from '../ApproveLoanUseCase';
import { approveLoan } from '../../entities/Loan';
import { createLoan } from '../../entities/Loan';
import { createBook } from '../../entities/Book';
import { hasAvailableCopies } from '../../entities/Book';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ApproveLoanUseCase', () => {
  let loanRepository: any;
  let bookRepository: any;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    }

    bookRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    }

  });

  // Correcto funcionamiento ✅

  it('debería aprobar un préstamo modificando el stock del libro', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = createBook(bookId, 'Libro de prueba', 'chincho poroto', 5);
    const loan = createLoan({ 
      id: loanId, 
      userId: 'user123',
      bookId: bookId, 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    bookRepository.save = vi.fn();
    loanRepository.save = vi.fn();
    await approveLoanUseCase({ loanId }, loanRepository, bookRepository);
    expect(loan.approved).toBe(true);
    const savedBook = bookRepository.save.mock.calls[0][0];
    expect(savedBook.borrowedCopies).toBe(1);
    expect(savedBook.totalCopies - savedBook.borrowedCopies).toBe(4);
    expect(hasAvailableCopies(savedBook)).toBe(true);
  });

  // Errores esperados ❌

  it('debería lanzar un error si el préstamo ya está aprobado', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = createBook(bookId, 'Libro de prueba', 'chincho poroto', 5);
    const loan = createLoan({
      id: loanId, 
      userId: 'user123', 
      bookId:  bookId,
      from: new Date(), 
      to: new Date()
    });
    approveLoan(loan)
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    await expect(approveLoanUseCase({ loanId }, loanRepository, bookRepository))
      .rejects.toThrow('El préstamo ya fue aprobado');
  });

  it('debería lanzar un error si el libro no existe', async () => {
    const loanId = 'loan123';
    const loan = createLoan({
      id: loanId, 
      userId: 'user123', 
      bookId: 'book123', 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(approveLoanUseCase({ loanId }, loanRepository, bookRepository))
      .rejects.toThrow('Libro no encontrado');
  });

  it('debería lanzar un error si no hay copias disponibles para aprobar el préstamo', async () => {
    const loanId = 'loan123';
    const bookId = 'book123';
    const book = createBook(bookId, 'Libro de prueba', 'chincho poroto', 0);
    const loan = createLoan({
      id: loanId, 
      userId: 'user123', 
      bookId: bookId, 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(book);
    await expect(approveLoanUseCase({ loanId }, loanRepository, bookRepository))
      .rejects.toThrow('No hay copias disponibles para aprobar el préstamo');
  });

  it('debería lanzar un error si el préstamo no existe', async () => {
    const loanId = 'loan123';
    loanRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(approveLoanUseCase({ loanId }, loanRepository, bookRepository))
      .rejects.toThrow('Préstamo no encontrado');
  });

  it('debería lanzar un error si el libro no existe al aprobar un préstamo', async () => {
    const loanId = 'loan123';
    const loan = createLoan({
      id: loanId,
      userId: 'user123',
      bookId: 'book123',
      from: new Date(),
      to: new Date()
    });
    loanRepository.findById = vi.fn().mockResolvedValue(loan);
    bookRepository.findById = vi.fn().mockResolvedValue(null);
    await expect(approveLoanUseCase({ loanId }, loanRepository, bookRepository))
      .rejects.toThrow('Libro no encontrado');
  });

});
