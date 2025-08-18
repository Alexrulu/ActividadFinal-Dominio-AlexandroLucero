import { Request, Response } from 'express';
import { deleteLoanUseCase } from '@domain/use-cases/DeleteLoanUseCase';
import { loanRepo } from './repositories';

export async function deleteLoanController(req: Request, res: Response) {
  const { loanId } = req.body;

  if (!loanId) {
    return res.status(400).json({ error: "Falta el ID del préstamo" });
  }

  try {
    await deleteLoanUseCase({ loanId }, loanRepo);
    res.status(200).json({ message: "Préstamo eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
