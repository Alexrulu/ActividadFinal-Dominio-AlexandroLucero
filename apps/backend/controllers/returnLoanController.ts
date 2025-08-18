import { Request, Response } from "express";
import { returnLoanUseCase } from "@domain/use-cases/ReturnLoanUseCase";
import { loanRepo } from './repositories';

export async function returnLoanController(req: Request, res: Response) {
  try {
    const { loanId } = req.body;
    if (!loanId) {
      return res.status(400).json({ error: "Falta el ID del prestamo" });
    }

    await returnLoanUseCase(loanId, loanRepo);

    return res.status(200).json({ message: "Devolucion solicitada correctamente" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
