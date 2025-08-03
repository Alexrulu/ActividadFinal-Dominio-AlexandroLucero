import { Request, Response } from "express";
import { listLoansUseCase } from "../../../domain/src/use-cases/ListLoansUseCase";
import { loanRepo } from "./repositories";

export async function listLoansController(req: Request, res: Response) {
  try {
    const { requesterId, requesterRole } = req.body;

    if (!requesterId) {
      return res.status(400).json({ error: "Falta el ID del usuario" });
    } else if (!requesterRole) {
      return res.status(400).json({ error: "Falta el rol del usuario" });
    }

    const loans = await listLoansUseCase(req.body, loanRepo);
    if (!loans || loans.length === 0) {
      return res.status(400).json({ error: "No se encontraron prestamos" });
    }

    res.status(200).json({ message: "Prestamos obtenidos correctamente", loans });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
