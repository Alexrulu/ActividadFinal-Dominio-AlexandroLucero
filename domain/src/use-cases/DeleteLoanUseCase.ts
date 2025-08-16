import { LoanRepository } from "../repositories/LoanRepository";

export async function deleteLoanUseCase(
  input: { loanId: string },
  loanRepo: LoanRepository
): Promise<void> {
  const loan = await loanRepo.findById(input.loanId);
  if (!loan) throw new Error("Prestamo no encontrado");

  if (loan.approved) throw new Error("No se puede eliminar un prestamo aprobado");

  await loanRepo.delete(input.loanId);
}
