import { describe, it, expect, vi } from "vitest";
import { Book } from "../../entities/Book";
import { ReturnLoanUseCase } from "../ReturnLoanUseCase";
import { BookRepository } from "../../repositories/BookRepository";

describe("ReturnLoanUseCase", () => {

  // Correcto funcionamiento ✅

  it("debería devolver una copia del libro correctamente", async () => {
    const book = new Book("1", "1984", "George Orwell", 3, 2);
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new ReturnLoanUseCase(mockRepo);
    await useCase.execute("1");
    expect(book.borrowedCopies).toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith(book);
  });

  it("luego de devolver 2 libros, debería quedar 1 prestado", async () => {
    const books = [
      new Book("1", "1984", "George Orwell", 3, 3),
      new Book("2", "El Principito", "Antoine de Saint-Exupéry", 5, 2),
    ];
    const mockRepo: BookRepository = {
      findById: vi.fn(async (id: string) => books.find(b => b.id === id) ?? null),
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn().mockResolvedValue(books),
    };
    const useCase = new ReturnLoanUseCase(mockRepo);
    await useCase.execute("1");
    await useCase.execute("1");
    await useCase.execute("2");
    await useCase.execute("2");
    expect(books[0].borrowedCopies).toBe(1);
    expect(books[1].borrowedCopies).toBe(0);
    expect(mockRepo.save).toHaveBeenCalledWith(books[0]);
    expect(mockRepo.save).toHaveBeenCalledWith(books[1]);
    expect(mockRepo.save).toHaveBeenCalledTimes(4);
  });

  // Errores esperados ❌

  it("debería lanzar error si el libro no existe", async () => {
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new ReturnLoanUseCase(mockRepo);
    await expect(useCase.execute("inexistente")).rejects.toThrow("Libro no encontrado.");
  });

  it("debería lanzar error si no hay copias prestadas", async () => {
    const book = new Book("1", "1984", "George Orwell", 3, 0);
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new ReturnLoanUseCase(mockRepo);
    await expect(useCase.execute("1")).rejects.toThrow("No hay copias para devolver.");
  });

});
