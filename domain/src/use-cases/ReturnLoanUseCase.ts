import { BookRepository } from "../repositories/BookRepository";

export class ReturnLoanUseCase {
  constructor(private readonly bookRepo: BookRepository) {}

  async execute(bookId: string): Promise<void> {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw new Error("Libro no encontrado.");

    book.return();

    await this.bookRepo.save(book);
  }
}
