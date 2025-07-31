import { Request, Response } from "express";
import { requestLoanUseCase } from "../../../domain/src/use-cases/RequestLoanUseCase";
import { bookRepo, loanRepo } from "./repositories";

export async function requestLoanController(req: Request, res: Response) {
  try {
    const { userId, bookId, durationInMonths } = req.body;

    if (!userId || !bookId || !durationInMonths) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const duration = Number(durationInMonths);
    if (isNaN(duration)) {
      return res.status(400).json({ error: "La duración debe ser un número" });
    }

    await requestLoanUseCase(
      { userId, bookId, durationInMonths: duration },
      { bookRepo, loanRepo }
    );

    return res.status(201).json({ message: "Préstamo registrado correctamente" });

  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Error al procesar la solicitud" });
  }
}
