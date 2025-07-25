import { describe, it, expect, beforeEach, vi } from "vitest";
import { ManageBooksUseCase } from "../ManageBooksUseCase";
import { Book } from "../../entities/Book";

describe("ManageBooksUseCase", () => {
  let bookRepositoryMock: any;
  let useCase: ManageBooksUseCase;

  beforeEach(() => {
    bookRepositoryMock = {
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new ManageBooksUseCase(bookRepositoryMock);
  });

  describe("addBook", () => {
    it("debería crear un libro nuevo si no existe", async () => {
      bookRepositoryMock.findById.mockResolvedValue(null);
      await useCase.addBook({
        id: "book1",
        title: "Título 1",
        author: "Autor 1",
        totalCopies: 5,
      });
      expect(bookRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "book1",
          title: "Título 1",
          author: "Autor 1",
          totalCopies: 5,
          borrowedCopies: 0,
        })
      );
    });

    it("debería lanzar error si el libro ya existe", async () => {
      bookRepositoryMock.findById.mockResolvedValue(new Book("book1", "Existente", "Autor", 3));
      await expect(
        useCase.addBook({
          id: "book1",
          title: "Título 1",
          author: "Autor 1",
          totalCopies: 5,
        })
      ).rejects.toThrow("El libro ya existe");
    });
  });

  describe("updateBook", () => {
    it("debería actualizar los campos del libro", async () => {
      const book = new Book("book1", "Antiguo", "Autor Antiguo", 5, 2);
      bookRepositoryMock.findById.mockResolvedValue(book);
      await useCase.updateBook({
        id: "book1",
        title: "Nuevo título",
        totalCopies: 6,
      });
      expect(book.title).toBe("Nuevo título");
      expect(book.totalCopies).toBe(6);
      expect(bookRepositoryMock.save).toHaveBeenCalledWith(book);
    });

    it("debería lanzar error si no encuentra el libro", async () => {
      bookRepositoryMock.findById.mockResolvedValue(null);
      await expect(
        useCase.updateBook({
          id: "book1",
          title: "Nuevo título",
        })
      ).rejects.toThrow("Libro no encontrado");
    });

    it("debería lanzar error si totalCopies es menor a borrowedCopies", async () => {
      const book = new Book("book1", "Libro", "Autor", 5, 3);
      bookRepositoryMock.findById.mockResolvedValue(book);
      await expect(
        useCase.updateBook({
          id: "book1",
          totalCopies: 2,
        })
      ).rejects.toThrow("No se puede reducir totalCopies por debajo de copias prestadas");
    });
  });

  describe("deleteBook", () => {
    it("debería eliminar el libro si no hay copias prestadas", async () => {
      const book = new Book("book1", "Libro", "Autor", 5, 0);
      bookRepositoryMock.findById.mockResolvedValue(book);
      await useCase.deleteBook({ id: "book1" });
      expect(bookRepositoryMock.delete).toHaveBeenCalledWith("book1");
    });

    it("debería lanzar error si no encuentra el libro", async () => {
      bookRepositoryMock.findById.mockResolvedValue(null);
      await expect(useCase.deleteBook({ id: "book1" })).rejects.toThrow("Libro no encontrado");
    });

    it("debería lanzar error si hay copias prestadas", async () => {
      const book = new Book("book1", "Libro", "Autor", 5, 2);
      bookRepositoryMock.findById.mockResolvedValue(book);
      await expect(useCase.deleteBook({ id: "book1" })).rejects.toThrow(
        "No se puede eliminar un libro con copias prestadas"
      );
    });
  });
});
