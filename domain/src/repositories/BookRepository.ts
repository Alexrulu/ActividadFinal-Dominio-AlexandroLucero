import { Book } from "../entities/Book";

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  findByTitleAndAuthor(title: string, author: string): Promise<Book | null>;
  findAll(): Promise<Book[]>;
  save(book: Book): Promise<void>;
}