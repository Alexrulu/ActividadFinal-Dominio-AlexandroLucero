import { Book } from "../entities/Book";

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<void>;
  findAll(params: { page: number; limit: number }): Promise<Book[]>;

  /* prototipo de implementación de paginación
    async findAll({ page, limit }): Promise<Book[]> {
      return await db.book.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
    } */
}