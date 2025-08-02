import { Book } from "../entities/Book";

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  findByTitleAndAuthor(title: string, author: string): Promise<Book | null>;
  findAll(params: { page: number; limit: number }): Promise<Book[]>;
  save(book: Book): Promise<void>;
  delete(id: string): Promise<void>;
}

/* prototipo de implementación de paginación
    async findAll({ page, limit }): Promise<Book[]> {
      return await db.book.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
    } */