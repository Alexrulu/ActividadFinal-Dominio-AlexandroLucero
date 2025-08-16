import { Request, Response } from "express";
import { listBooksUseCase } from "../../../domain/src/use-cases/ListBooksUseCase";
import { bookRepo } from "./repositories";

export async function listBooksController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const books = await listBooksUseCase(bookRepo);

    if (!books || books.length === 0) {
      throw new Error("No se encontraron libros");
    }

    res.status(200).json({
      message: 'Libros obtenidos correctamente', 
      books,
      page,
      limit
    })

  } catch (error: any) {
    res.status(400).json({ error: error.message })

  }
}