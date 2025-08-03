import { Book } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";

type PaginationParams = { 
  page: number; 
  limit: number 
};

export async function listBooksUseCase(
  params: PaginationParams,
  bookRepo: BookRepository
): Promise<Book[]> {
  const books = await bookRepo.findAll(params);

  if (!books || books.length === 0) {
    throw new Error("No se encontraron libros");
  }

  return books;
}
