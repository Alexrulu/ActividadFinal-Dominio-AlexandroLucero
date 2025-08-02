import { Request, Response } from "express";
import { listBooksUseCase } from "../../../domain/src/use-cases/ListBooksUseCase";
import { bookRepo } from "./repositories";

export async function listBooksController(req: Request, res: Response) {
  try {
    const books = await listBooksUseCase({ page: 1, limit: 10 }, bookRepo);

    if (!books || books.length === 0) {
      throw new Error("No se encontraron libros");
    }

    res.status(200).json({message: 'Libros obtenidos correctamente', books})

  } catch (error: any) {
    res.status(400).json({ error: error.message })

  }
}