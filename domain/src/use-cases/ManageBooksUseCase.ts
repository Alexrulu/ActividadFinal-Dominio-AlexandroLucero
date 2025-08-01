import { Book } from "../entities/Book";
import { createBook } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";

interface AddBookInput {
  id: string;
  title: string;
  author: string;
  totalCopies: number;
}

interface UpdateBookInput {
  id: string;
  title?: string;
  author?: string;
  totalCopies?: number;
}

interface DeleteBookInput {
  id: string;
}

export async function addBookUseCase(
  input: AddBookInput,
  bookRepo: BookRepository
): Promise<void> {
  const existing = await bookRepo.findById(input.id);
  if (existing) throw new Error("El libro ya existe");

  const book = createBook(input.id, input.title, input.author, input.totalCopies);
  await bookRepo.save(book);
}

export async function updateBookUseCase(
  input: UpdateBookInput,
  bookRepo: BookRepository
): Promise<void> {
  const book = await bookRepo.findById(input.id);
  if (!book) throw new Error("Libro no encontrado");

  if (input.title !== undefined) book.title = input.title;
  if (input.author !== undefined) book.author = input.author;
  if (input.totalCopies !== undefined) {
    if (input.totalCopies < book.borrowedCopies) {
      throw new Error("No se puede reducir totalCopies por debajo de copias prestadas");
    }
    book.totalCopies = input.totalCopies;
  }

  await bookRepo.save(book);
}

export async function deleteBookUseCase(
  input: DeleteBookInput,
  bookRepo: BookRepository
): Promise<void> {
  const book = await bookRepo.findById(input.id);
  if (!book) throw new Error("Libro no encontrado");

  if (book.borrowedCopies > 0) {
    throw new Error("No se puede eliminar un libro con copias prestadas");
  }

  await bookRepo.delete(input.id);
}
