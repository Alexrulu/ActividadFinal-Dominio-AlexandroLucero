import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../entities/Book";

type PaginationParams = { page: number; limit: number };

export class ListBooksUseCase {
  constructor(private readonly bookRepo: BookRepository) {}

  async execute(params: PaginationParams): Promise<Book[]> {
    const books = await this.bookRepo.findAll(params);
    if (!books || books.length === 0) {
      throw new Error("No se encontraron libros");
    }
    return books;
  } // la responsabilidad de manejar error recae en quien llama a execute.
}
