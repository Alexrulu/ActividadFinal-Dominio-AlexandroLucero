import { BookRepository } from "../repositories/BookRepository";
import { returnBook } from "../entities/Book";

export interface ReturnLoan {
  (bookId: string): Promise<void>;
}

export function returnLoanUseCase(bookRepo: BookRepository): ReturnLoan {
  return async function returnLoan(bookId: string): Promise<void> {
    const book = await bookRepo.findById(bookId);
    if (!book) throw new Error("Libro no encontrado.");

    const updatedBook = returnBook(book);

    await bookRepo.save(updatedBook);
  };
}
