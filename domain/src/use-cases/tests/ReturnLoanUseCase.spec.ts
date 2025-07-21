import { describe, it, expect, vi } from "vitest";
import { Book } from "../../entities/Book";
import { ReturnLoanUseCase } from "../ReturnLoanUseCase";
import { BookRepository } from "../../repositories/BookRepository";

describe("ReturnLoanUseCase", () => {
  it("debería devolver una copia del libro correctamente", async () => {
    const book = new Book("1", "1984", "George Orwell", 3, 2);

    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new ReturnLoanUseCase(mockRepo);
    await useCase.execute("1");

    expect(book.borrowedCopies).toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith(book);
  });

  it("debería lanzar error si el libro no existe", async () => {
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };

    const useCase = new ReturnLoanUseCase(mockRepo);
    await expect(useCase.execute("inexistente")).rejects.toThrow("Libro no encontrado.");
  });

  it("debería lanzar error si no hay copias prestadas", async () => {
    const book = new Book("1", "1984", "George Orwell", 3, 0);

    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn(),
    };

    const useCase = new ReturnLoanUseCase(mockRepo);
    await expect(useCase.execute("1")).rejects.toThrow("No hay copias para devolver.");
  });
});
