import { Book } from "../../../domain/src/entities/Book";
import { BookRepository } from "../../../domain/src/repositories/BookRepository";

export class BookRepositoryMemory implements BookRepository {
  private books: Book[] = [
    {
      id: "book1",
      title: "Book 1",
      author: "Author 1",
      totalCopies: 10,
      borrowedCopies: 0,
    }
  ];

  async findById(id: string): Promise<Book | null> {
    const book = this.books.find((b) => b.id === id);
    return book ? { ...book } : null;
  }

  async findAll(params: { page: number; limit: number }): Promise<Book[]> {
    const { page, limit } = params;
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.books.slice(start, end).map((b) => ({ ...b }));
  }

  async save(book: Book): Promise<void> {
    const index = this.books.findIndex((b) => b.id === book.id);
    if (index === -1) {
      this.books.push({ ...book });
    } else {
      this.books[index] = { ...book };
    }
  }

  async delete(id: string): Promise<void> {
    this.books = this.books.filter((b) => b.id !== id);
  }

  clear() {
    this.books = [];
  }
}
