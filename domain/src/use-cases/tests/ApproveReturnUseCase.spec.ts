import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApproveReturnUseCase } from '../ApproveReturnUseCase';
import { Loan } from '../../entities/Loan';
import { Book } from '../../entities/Book';

describe('ApproveReturnUseCase', () => {
  let loanRepository: any;
  let bookRepository: any;
  let useCase: ApproveReturnUseCase;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      create: vi.fn(),
    };
    bookRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    useCase = new ApproveReturnUseCase(loanRepository, bookRepository);
  });

  // Correcto funcionamiento ✅

  it('marca el préstamo como devuelto y reduce borrowedCopies del libro', async () => {
    const loan = new Loan('loan-id', 'user-id', 'book-id', new Date(), new Date());
    const book = new Book('book-id', 'Title', 'Author', 3, 1);
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await useCase.execute({ loanId: 'loan-id' });
    expect(loan.returned).toBe(true);
    expect(book.borrowedCopies).toBe(0);
  });

  it("llama a los metodos de persistencia correctamente", async () => {
    const loan = new Loan('loan-id', 'user-id', 'book-id', new Date(), new Date());
    const book = new Book('book-id', 'Title', 'Author', 3, 1);
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await useCase.execute({ loanId: 'loan-id' });
    expect(loanRepository.create).toHaveBeenCalledWith(loan);
    expect(bookRepository.save).toHaveBeenCalledWith(book);
  });

  // Errores esperados ❌

  it('lanza error si el préstamo no existe', async () => {
    loanRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ loanId: 'non-existent' }))
      .rejects
      .toThrow('Préstamo no encontrado');
  });

  it('lanza error si el préstamo ya fue devuelto', async () => {
    const loan = new Loan('loan-id', 'user-id', 'book-id', new Date(), new Date(), true);
    loanRepository.findById.mockResolvedValue(loan);
    await expect(useCase.execute({ loanId: 'loan-id' }))
      .rejects
      .toThrow('El préstamo ya fue devuelto');
  });

  it('lanza error si el libro no existe', async () => {
    const loan = new Loan('loan-id', 'user-id', 'book-id', new Date(), new Date());
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ loanId: 'loan-id' }))
      .rejects
      .toThrow('Libro no encontrado');
  });

  it("lanza error si el libro no tiene copias para devolver", async () => {
    const loan = new Loan('loan-id', 'user-id', 'book-id', new Date(), new Date());
    const book = new Book('book-id', 'Title', 'Author', 3, 0);
    loanRepository.findById.mockResolvedValue(loan);
    bookRepository.findById.mockResolvedValue(book);
    await expect(useCase.execute({ loanId: 'loan-id' }))
      .rejects
      .toThrow('No hay copias para devolver.');
  });

});
