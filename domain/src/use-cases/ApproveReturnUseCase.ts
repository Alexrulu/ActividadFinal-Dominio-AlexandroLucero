import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";

interface ApproveReturnDTO {
  loanId: string;
}

export class ApproveReturnUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly bookRepository: BookRepository
  ) {}

  async execute({ loanId }: ApproveReturnDTO): Promise<void> {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new Error("Préstamo no encontrado");
    }

    if (loan.returned) {
      throw new Error("El préstamo ya fue devuelto");
    }

    loan.markAsReturned();

    const book = await this.bookRepository.findById(loan.bookId);
    if (!book) {
      throw new Error("Libro no encontrado");
    }

    book.return();

    // Persistencia
    await this.loanRepository.create(loan); // o update
    await this.bookRepository.save(book);   // o update
  }
}
