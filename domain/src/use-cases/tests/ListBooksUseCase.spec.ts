import { it, expect, vi } from "vitest";
import { listBooksUseCase } from "../ListBooksUseCase";
import { BookRepository } from "../../repositories/BookRepository";

const book1 = { 
  id: "1", 
  title: "1984", 
  author: "George Orwell", 
  totalCopies: 1,
  borrowedCopies: 0
};
const book2 = { 
  id: "2", 
  title: "Fahrenheit 451", 
  author: "Ray Bradbury", 
  totalCopies: 1,
  borrowedCopies: 0
};
const books = [book1, book2];

// Casos exitosos ✅

it("deberia retornar todos los libros del repositorio", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(books)
  };
  const result = await listBooksUseCase(mockRepo);
  expect(result).toHaveLength(2);
  expect(result).toEqual(books);
});

it("deberia llamar al repositorio con los parámetros correctos", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue([{ id: "1", title: "Test", author: "A" }])
  };
  await listBooksUseCase(mockRepo);
  expect(mockRepo.findAll).toHaveBeenCalledOnce();
});

// Casos fallidos ❌

it("deberia lanzar un error si el repositorio falla", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockRejectedValue(new Error("Error en el repositorio"))
  };
  await expect(listBooksUseCase(mockRepo))
  .rejects.toThrow("Error en el repositorio");
});

it("deberia lanzar un error si el repositorio retorna null", async () => {
  const mockRepo: BookRepository = {
    findById: vi.fn(),
    findByTitleAndAuthor: vi.fn(),
    save: vi.fn(),
    findAll: vi.fn().mockResolvedValue(null)
  };
  await expect(listBooksUseCase(mockRepo))
  .rejects.toThrow("No se encontraron libros");
});

