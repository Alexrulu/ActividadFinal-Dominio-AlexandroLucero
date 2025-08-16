import { deleteLoanUseCase } from '../DeleteLoanUseCase';
import { createLoan } from '../../entities/Loan';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DeleteLoanUseCase', () => {
  let loanRepository: any;

  beforeEach(() => {
    loanRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    };
  });

  // Casos exitosos ✅
  it('deberia eliminar un prestamo no aprobado', async () => {
    const loanId = 'loan123';
    const loan = createLoan({
      id: loanId,
      userId: 'user123',
      bookId: 'book123',
      from: new Date(),
      to: new Date(),
    });

    loanRepository.findById.mockResolvedValue(loan);
    loanRepository.delete.mockResolvedValue(undefined);

    await deleteLoanUseCase({ loanId }, loanRepository);

    expect(loanRepository.delete).toHaveBeenCalledWith(loanId);
  });

  // Casos fallidos ❌
  it('deberia lanzar un error si el prestamo no existe', async () => {
    const loanId = 'loan123';
    loanRepository.findById.mockResolvedValue(null);

    await expect(deleteLoanUseCase({ loanId }, loanRepository))
      .rejects.toThrow('Prestamo no encontrado');
  });

  it('deberia lanzar un error si el prestamo ya fue aprobado', async () => {
    const loanId = 'loan123';
    const loan = createLoan({
      id: loanId,
      userId: 'user123',
      bookId: 'book123',
      from: new Date(),
      to: new Date(),
    });
    loan.approved = true;

    loanRepository.findById.mockResolvedValue(loan);

    await expect(deleteLoanUseCase({ loanId }, loanRepository))
      .rejects.toThrow('No se puede eliminar un prestamo aprobado');
  });
});
