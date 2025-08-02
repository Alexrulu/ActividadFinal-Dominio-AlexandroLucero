import { Request, Response } from "express";
import { approveReturnLoanUseCase } from "../../../domain/src/use-cases/ApproveReturnLoanUseCase";
import { loanRepo, bookRepo } from './repositories';

export async function approveReturnLoanController(req: Request, res: Response) {
  try {
    const { loanId } = req.body;
    if (!loanId) {
      return res.status(400).json({ error: "Falta el ID del préstamo" });
    }

    const loan = await loanRepo.findById(loanId);
    if (!loan) {
      return res.status(400).json({ error: "Préstamo no encontrado" });
    }

    if (!loan.returnRequested) {
      return res.status(400).json({ error: "No hay solicitud de devolución para este préstamo" });
    }

    await approveReturnLoanUseCase({ loanId }, loanRepo, bookRepo);

    return res.status(200).json({ message: "Préstamo marcado como devuelto correctamente", loan });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

