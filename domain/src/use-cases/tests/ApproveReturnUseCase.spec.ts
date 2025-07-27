import { describe, it, expect, vi, beforeEach } from 'vitest';
import { approveReturnUseCase } from '../ApproveReturnUseCase';
import { markLoanAsReturned } from '../../entities/Loan';
import { createLoan } from '../../entities/Loan';
import { createBook } from '../../entities/Book';

describe('ApproveReturnUseCase', () => {
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

  it('marca el préstamo como devuelto y reduce borrowedCopies del libro', async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), to: new Date()
    });
    const book = createBook('book-id', 'Title', 'Author', 3);
    book.borrowedCopies = 1;
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository);
    expect(loan.returned).toBe(true);
    expect(book.borrowedCopies).toBe(0);
  });

  it("llama a los metodos de persistencia correctamente", async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    const book = createBook('book-id', 'Title', 'Author', 3);
    book.borrowedCopies = 1;
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository);
    expect(loanRepository.save).toHaveBeenCalledWith(loan);
    expect(bookRepository.save).toHaveBeenCalledWith(book);
  });

  // Errores esperados ❌

  it('lanza error si el préstamo no existe', async () => {
    loanRepository.findById.mockResolvedValue(null);
    await expect(approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('Préstamo no encontrado');
  });

  it('lanza error si el préstamo ya fue devuelto', async () => {
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
    await expect(approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('El préstamo ya fue devuelto');
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
    await expect(approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
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
    await expect(approveReturnUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository))
      .rejects
      .toThrow('No hay copias para devolver.');
  });

});
