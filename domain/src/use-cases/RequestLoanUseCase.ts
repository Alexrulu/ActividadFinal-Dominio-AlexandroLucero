import { BookRepository } from "../repositories/BookRepository";
import { LoanRepository } from "../repositories/LoanRepository";
import { Loan } from "../entities/Loan";

interface RequestLoanInput {
  userId: string;
  bookId: string;
  durationInMonths: 1 | 2
}

export class RequestLoanUseCase {
  constructor(
    private readonly bookRepo: BookRepository,
    private readonly loanRepo: LoanRepository
  ) {}

  async execute(input: RequestLoanInput): Promise<void> {
    const book = await this.bookRepo.findById(input.bookId);

    if (!book) {
      throw new Error("Libro no encontrado");
    }

    if (!book.hasAvailableCopies()) {
      throw new Error("No hay copias disponibles para prestar");
    }

    book.borrow();

    const now = new Date();
    const returnDate = new Date(
      now.getFullYear(),
      now.getMonth() + input.durationInMonths,
      now.getDate()
    );

    const loan = new Loan(
      crypto.randomUUID(),
      input.userId,
      input.bookId,
      now,
      returnDate,
      false
    );

    await this.loanRepo.create(loan);
    await this.bookRepo.save(book);
  }
}