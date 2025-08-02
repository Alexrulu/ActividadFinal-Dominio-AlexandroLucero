import { it, expect, vi } from "vitest";
import { listBooksUseCase } from "../ListBooksUseCase";
import { createBook } from "../../entities/Book";
import { BookRepository } from "../../repositories/BookRepository";

const book1 = createBook("1", "1984", "George Orwell", 3);
book1.borrowedCopies = 1;
const book2 = createBook("2", "Fahrenheit 451", "Ray Bradbury", 2);
book2.borrowedCopies = 0;
const books = [book1, book2];

// Correcto funcionamiento ✅

it("debería retornar todos los libros del repositorio", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(books),
    delete: vi.fn(),
  };
  const result = await listBooksUseCase({ page: 1, limit: 10 }, mockRepo);
  expect(result).toHaveLength(2);
  expect(result).toEqual(books);
});

it("debería llamar al repositorio con los parámetros correctos", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue([{ id: "1", title: "Test", author: "A" }]),
    delete: vi.fn(),
  };
  await listBooksUseCase({ page: 1, limit: 10 }, mockRepo);
  expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
});

it("debería mostrar un solo libro si hay más de uno pero está limitado a 1", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockImplementation(async ({ page, limit }) => {  // Este test asegura que la paginación funcione correctamente en el repositorio.
      const start = (page - 1) * limit;                               // Actualmente está mockeado, falta implementar en BookRepository real.
      const end = start + limit;
      return books.slice(start, end);
    }),
    delete: vi.fn(),
  };
  const result = await listBooksUseCase({ page: 1, limit: 1 }, mockRepo);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(books[0]);
});

// Errores esperados ❌

it("debería lanzar un error si el repositorio falla", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockRejectedValue(new Error("Error en el repositorio")),
    delete: vi.fn(),
  };
  await expect(listBooksUseCase({ page: 1, limit: 10 }, mockRepo))
  .rejects.toThrow("Error en el repositorio");
});

it("debería lanzar un error si el repositorio retorna null", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(null),
    delete: vi.fn(),
  };
  await expect(listBooksUseCase({ page: 1, limit: 10 }, mockRepo))
  .rejects.toThrow("No se encontraron libros");
});

