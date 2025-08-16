import { Book } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";

export async function listBooksUseCase(
  bookRepo: BookRepository
): Promise<Book[]> {
  const books = await bookRepo.findAll();
  if (!books || books.length === 0) {
    throw new Error("No se encontraron libros");
  }

  return books;
}
