import { it, expect, vi } from "vitest";

import { ListBooksUseCase } from "../ListBooksUseCase";
import { Book } from "../../entities/Book";
import { BookRepository } from "../../repositories/BookRepository";

// Correcto funcionamiento ✅

it("debería retornar todos los libros del repositorio", async () => {
  const books = [
    new Book("1", "1984", "George Orwell", 3, 1),
    new Book("2", "Fahrenheit 451", "Ray Bradbury", 2, 0),
  ];
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(books),
  };
  const useCase = new ListBooksUseCase(mockRepo);
  const result = await useCase.execute({ page: 1, limit: 10 });
  expect(result).toHaveLength(2);
  expect(result).toEqual(books);
});

it("debería llamar al repositorio con los parámetros correctos", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue([{ id: "1", title: "Test", author: "A" }]),
  };
  const useCase = new ListBooksUseCase(mockRepo);
  await useCase.execute({ page: 1, limit: 10 });
  expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
});

it("debería mostrar un solo libro si hay más de uno pero está limitado a 1", async () => {
  const books = [
    new Book("1", "1984", "George Orwell", 3, 1),
    new Book("2", "Fahrenheit 451", "Ray Bradbury", 2, 0),
  ];
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockImplementation(async ({ page, limit }) => {  // Este test asegura que la paginación funcione correctamente en el repositorio.
      const start = (page - 1) * limit;                               // Actualmente está mockeado, falta implementar en BookRepository real.
      const end = start + limit;
      return books.slice(start, end);
    }),
  };
  const useCase = new ListBooksUseCase(mockRepo);
  const result = await useCase.execute({ page: 1, limit: 1 });
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(books[0]);
});

// Errores esperados ❌

it("debería lanzar un error si el repositorio falla", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockRejectedValue(new Error("Error en el repositorio")),
  };
  const useCase = new ListBooksUseCase(mockRepo);
  await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow("Error en el repositorio");
});

it("debería lanzar un error si el repositorio retorna null", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(null),
  };
  const useCase = new ListBooksUseCase(mockRepo);
  await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow("No se encontraron libros");
});

