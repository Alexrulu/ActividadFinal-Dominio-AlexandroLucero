import { Book } from "../../../domain/src/entities/Book";
import { BookRepository } from "../../../domain/src/repositories/BookRepository";
import booksData from "../data/books.json";

export class BookRepositoryMemory implements BookRepository {
  private books: Book[] = booksData as Book[];

  async findById(id: string): Promise<Book | null> {
    const book = this.books.find(b => b.id === id);
    return book ? { ...book } : null;
  }

  async findByTitleAndAuthor(title: string, author: string): Promise<Book | null> {
    const book = this.books.find(
      b => 
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase()
    );
    return book ? { ...book } : null;
  }

  async findAll(): Promise<Book[]> {
    return [...this.books];
  }

  async save(book: Book): Promise<void> {
    const index = this.books.findIndex(b => b.id === book.id);
    if (index === -1) {
      this.books.push({ ...book });
    } else {
      this.books[index] = { ...book };
    }
  }
}
