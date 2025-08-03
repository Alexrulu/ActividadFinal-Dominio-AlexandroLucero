import { describe, it, expect, vi, beforeEach } from 'vitest';
import { approveReturnLoanUseCase } from '../ApproveReturnLoanUseCase';
import { markLoanAsReturned } from '../../entities/Loan';
import { createLoan } from '../../entities/Loan';
import { createBook } from '../../entities/Book';

describe('ApproveReturnLoanUseCase', () => {
  let loanRepository: any;
  let bookRepository: any;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    bookRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
  });

  // Correcto funcionamiento ✅

  it("marca el prestamo como devuelto y reduce borrowedCopies del libro", async () => {
    const loan = { id: 'loan-id', bookId: 'book-id', returned: false };
    const book = { id: 'book-id', borrowedCopies: 1 };
    const loanRepo = {
      findActiveByUserAndBook: vi.fn(),
      findById: vi.fn().mockResolvedValue(loan),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };
    const bookRepo = {
      findById: vi.fn().mockResolvedValue(book),
      findByTitleAndAuthor: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    await approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepo, bookRepo);
    expect(loan.returned).toBe(true);
    const savedBook = bookRepo.save.mock.calls[0][0];
    expect(savedBook.borrowedCopies).toBe(0);
  });

  it("llama a los metodos de persistencia correctamente", async () => {
    const book = createBook('book-id', 'Title', 'Author', 3);
    book.borrowedCopies = 1;
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository);
    expect(loanRepository.save).toHaveBeenCalledWith(loan);
    expect(bookRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'book-id',
      borrowedCopies: 0
    }));
  });

  // Errores esperados ❌

  it('lanza error si el prestamo no existe', async () => {
    loanRepository.findById.mockResolvedValue(null);
    await expect(approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('Prestamo no encontrado');
  });

  it('lanza error si el prestamo ya fue devuelto', async () => {
    const book = createBook('book-id', 'Title', 'Author', 3);
    book.borrowedCopies = 1;
    bookRepository.findById.mockResolvedValue(book);
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById.mockResolvedValue(loan);
    markLoanAsReturned(loan); // Simulamos que ya fue devuelto
    await expect(approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('La solicitud de devolucion ya fue aprobada');
  });

  it('lanza error si el libro no existe', async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(null);
    await expect(approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('Libro no encontrado');
  });

  it("lanza error si el libro no tiene copias para devolver", async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    const book = createBook('book-id', 'Title', 'Author', 3);
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await expect(approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('No hay copias para devolver.');
  });

});
