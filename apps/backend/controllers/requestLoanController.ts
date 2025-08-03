import { Request, Response } from "express";
import { requestLoanUseCase } from "../../../domain/src/use-cases/RequestLoanUseCase";
import { bookRepo, loanRepo, userRepo } from "./repositories";

export async function requestLoanController(req: Request, res: Response) {
  try {
    const { userId, bookId, durationInMonths } = req.body;

    if (!userId || !bookId || !durationInMonths) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const duration = Number(durationInMonths);
    if (isNaN(duration)) {
      return res.status(400).json({ error: "La duracion debe ser un número" });
    }

    const loan = await requestLoanUseCase(
      { userId, bookId, durationInMonths: duration },
      { bookRepo, loanRepo }
    );

    const user = await userRepo.findById(userId);
    const book = await bookRepo.findById(bookId);

    if (!user || !book) {
      return res.status(400).json({ error: "Usuario o libro no encontrado" });
    }

    return res.status(201).json({ 
      message: "Prestamo solicitado correctamente", 
      loanId: loan.id, 
      userId, 
      bookId, 
      durationInMonths,
      userName: user.name, 
      userEmail: user.email, 
      bookTitle: book.title
    });

  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Error al procesar la solicitud" });
  }
}
