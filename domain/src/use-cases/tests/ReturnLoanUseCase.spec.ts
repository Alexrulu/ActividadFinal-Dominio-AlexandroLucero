import { describe, it, expect, vi } from "vitest";
import { Book, createBook } from "../../entities/Book";
import { returnLoanUseCase } from "../ReturnLoanUseCase";
import { BookRepository } from "../../repositories/BookRepository";
import { create } from "domain";

describe("ReturnLoanUseCase", () => {

  // Correcto funcionamiento ✅

  it("debería devolver una copia del libro correctamente", async () => {
    const book = createBook("1", "1984", "George Orwell", 3);
    book.borrowedCopies = 2; // Simulamos que hay 2 copias prestadas
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };
    await returnLoanUseCase(mockRepo)("1");
    expect(book.borrowedCopies).toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith(book);
  });

  it("luego de devolver 2 libros, debería quedar 1 prestado", async () => {
    const book1 = createBook("1", "1984", "George Orwell", 3);
    book1.borrowedCopies = 3; // Simulamos que hay 3 copias prestadas
    const book2 = createBook("2", "El Principito", "Antoine de Saint-Exupéry", 5);
    book2.borrowedCopies = 2; // Simulamos que hay 2 cop
    const books = [book1, book2];
    const mockRepo: BookRepository = {
      findById: vi.fn(async (id: string) => books.find(b => b.id === id) ?? null),
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn().mockResolvedValue(books),
      delete: vi.fn(),
    };
    await returnLoanUseCase(mockRepo)("1");
    await returnLoanUseCase(mockRepo)("1");
    await returnLoanUseCase(mockRepo)("2");
    await returnLoanUseCase(mockRepo)("2");
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
      delete: vi.fn(),
    };
    await expect(returnLoanUseCase(mockRepo)("1"))
    .rejects.toThrow("Libro no encontrado.");
  });

  it("debería lanzar error si no hay copias prestadas", async () => {
    const book = createBook("1", "1984", "George Orwell", 3);
    book.borrowedCopies = 0; // Simulamos que no hay copias prestadas
    const mockRepo: BookRepository = {
      findById: vi.fn().mockResolvedValue(book),
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };
    await expect(returnLoanUseCase(mockRepo)("1"))
    .rejects.toThrow("No hay copias para devolver.");
  });

});
