import { describe, it, expect, vi, beforeEach } from 'vitest';
import { approveReturnLoanUseCase } from '../ApproveReturnLoanUseCase';
import { approveLoan, markLoanAsReturned } from '../../entities/Loan';
import { createLoan } from '../../entities/Loan';

describe('ApproveReturnLoanUseCase', () => {
  let loanRepository: any;
  let bookRepository: any;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    bookRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
  });

  it("marca el prestamo como devuelto y reduce borrowedCopies del libro", async () => {
    const book = { id: 'book-id', borrowedCopies: 1, totalCopies: 1 };
    const loan = { 
      id: 'loan-id', 
      bookId: 'book-id', 
      returned: false, 
      approved: true, 
      returnRequested: true
    };
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);

    await approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository);
    expect(loan.returned).toBe(true);
    const savedBook = bookRepository.save.mock.calls[0][0];
    expect(savedBook.borrowedCopies).toBe(0);
  });

  it("llama a los metodos de persistencia correctamente", async () => {
    const book = { id: 'book-id', title: 'Title', author: 'Author', totalCopies: 1, borrowedCopies: 1 };
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    approveLoan(loan);
    loan.returnRequested = true;

    await approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository);

    expect(loanRepository.delete).toHaveBeenCalledWith(loan.id);
    expect(bookRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'book-id',
      borrowedCopies: 0
    }));
  });

  it('lanza error si el prestamo no existe', async () => {
    loanRepository.findById.mockResolvedValue(null);

    await expect(
      approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository)
    ).rejects.toThrow('Prestamo no encontrado');
  });

  it('lanza error si el prestamo ya fue devuelto', async () => {
    const book = { id: 'book-id', borrowedCopies: 1, totalCopies: 3 };
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    approveLoan(loan);
    loan.returnRequested = true;
    markLoanAsReturned(loan);

    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);

    await expect(
      approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository)
    ).rejects.toThrow('La solicitud de devolucion ya fue aprobada');
  });

  it('lanza error si el libro no existe', async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    approveLoan(loan);
    loan.returnRequested = true;
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(null);

    await expect(
      approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository)
    ).rejects.toThrow('Libro no encontrado');
  });

  it("lanza error si el libro no tiene copias prestadas", async () => {
    const loan = createLoan({
      id: 'loan-id', 
      userId: 'user-id', 
      bookId: 'book-id', 
      from: new Date(), 
      to: new Date()
    });
    const book = { id: 'book-id', borrowedCopies: 0, totalCopies: 3 };
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);

    approveLoan(loan);

    await expect(
      approveReturnLoanUseCase({ loanId: 'loan-id' }, loanRepository, bookRepository)
    ).rejects.toThrow('No hay solicitud de devolución');
  });

});
