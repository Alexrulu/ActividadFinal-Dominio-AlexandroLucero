import { Request, Response } from "express";
import { requestLoanUseCase } from "@domain/use-cases/RequestLoanUseCase";
import { bookRepo, loanRepo } from "./repositories";
import jwt from 'jsonwebtoken';

export async function requestLoanController(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = 'default_secret';
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET no está definido en las variables de entorno' });
    }
    const decoded: any = jwt.verify(token, jwtSecret);

    const userId = decoded.userId;
    const { bookId, durationInMonths } = req.body;

    if (!bookId || !durationInMonths) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const duration = Number(durationInMonths);
    if (isNaN(duration)) {
      return res.status(400).json({ error: "La duración debe ser un número" });
    }

    const loan = await requestLoanUseCase(
      { userId, bookId, durationInMonths: duration },
      { bookRepo, loanRepo }
    );

    return res.status(201).json({
      message: "Préstamo solicitado correctamente"
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Error al procesar la solicitud" });
  }
}
