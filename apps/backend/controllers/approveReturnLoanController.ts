import { Request, Response } from "express";
import { approveReturnLoanUseCase } from "@domain/use-cases/ApproveReturnLoanUseCase";
import { loanRepo, bookRepo } from './repositories';

export async function approveReturnLoanController(req: Request, res: Response) {
  try {
    const { loanId } = req.body;
    if (!loanId) {
      return res.status(400).json({ error: "Falta el ID del prestamo" });
    }

    const loan = await loanRepo.findById(loanId);
    if (!loan) {
      return res.status(400).json({ error: "Prestamo no encontrado" });
    }

    if (!loan.returnRequested) {
      return res.status(400).json({ error: "No hay solicitud de devolucion para este prestamo" });
    }

    await approveReturnLoanUseCase({ loanId }, loanRepo, bookRepo);

    return res.status(200).json({ message: "Prestamo marcado como devuelto correctamente", loan });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

