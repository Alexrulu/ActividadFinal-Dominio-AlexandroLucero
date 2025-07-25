import { Book } from "../entities/Book";
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

export class ManageBooksUseCase {
  constructor(private readonly bookRepo: BookRepository) {}

  async addBook(input: AddBookInput): Promise<void> {
    const existing = await this.bookRepo.findById(input.id);
    if (existing) throw new Error("El libro ya existe");

    const book = new Book(input.id, input.title, input.author, input.totalCopies);
    await this.bookRepo.save(book);
  }

  async updateBook(input: UpdateBookInput): Promise<void> {
    const book = await this.bookRepo.findById(input.id);
    if (!book) throw new Error("Libro no encontrado");

    if (input.title !== undefined) book.title = input.title;
    if (input.author !== undefined) book.author = input.author;
    if (input.totalCopies !== undefined) {
      if (input.totalCopies < book.borrowedCopies) {
        throw new Error("No se puede reducir totalCopies por debajo de copias prestadas");
      }
      book.totalCopies = input.totalCopies;
    }

    await this.bookRepo.save(book);
  }

  async deleteBook(input: DeleteBookInput): Promise<void> {
    const book = await this.bookRepo.findById(input.id);
    if (!book) throw new Error("Libro no encontrado");

    if (book.borrowedCopies > 0) {
      throw new Error("No se puede eliminar un libro con copias prestadas");
    }

    await this.bookRepo.delete(input.id);
  }
}
