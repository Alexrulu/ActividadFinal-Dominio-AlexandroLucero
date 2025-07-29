import { LoanRepository } from "../repositories/LoanRepository";

export async function returnLoanUseCase(
  loanId: string,
  loanRepo: LoanRepository
): Promise<void> {
  const loan = await loanRepo.findById(loanId);
  if (!loan) throw new Error("Préstamo no encontrado");

  if (loan.returned) throw new Error("El préstamo ya fue devuelto");
  if (loan.returnRequested) throw new Error("La devolución ya fue solicitada");
  
  loan.returnRequested = true;

  await loanRepo.save(loan);
}

