import { describe, it, expect, beforeEach, vi } from "vitest";
import { createBook } from "../../entities/Book";

import { addBookUseCase, updateBookUseCase, deleteBookUseCase } from "../ManageBooksUseCase";

describe("ManageBooksUseCase", () => {
  let bookRepositoryMock: any;

  beforeEach(() => {
    bookRepositoryMock = {
      findById: vi.fn(),
      findByTitleAndAuthor: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe("addBook", () => {
    it("debería crear un libro nuevo si no existe", async () => {
      bookRepositoryMock.findByTitleAndAuthor.mockResolvedValue(null);
      await addBookUseCase(
        {
          title: "título 1",
          author: "autor 1",
          totalCopies: 5,
        },
        bookRepositoryMock
      );
      expect(bookRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: "título 1",
          author: "autor 1",
          totalCopies: 5,
          borrowedCopies: 0,
        })
      );
    });

    it("debería lanzar error si el libro ya existe", async () => {
      bookRepositoryMock.findByTitleAndAuthor.mockResolvedValue(createBook("book1", "existente", "autor", 5));
      await expect(
        addBookUseCase(
          {
            title: "existente",
            author: "autor",
            totalCopies: 5,
          },
          bookRepositoryMock
        )
      ).rejects.toThrow("El libro ya existe");
    });
  });

  describe("updateBook", () => {
    it("debería actualizar los campos del libro", async () => {
      const book = createBook("book1", "antiguo", "autor antiguo", 5);
      book.borrowedCopies = 2;
      bookRepositoryMock.findById.mockResolvedValue(book);
      await updateBookUseCase(
        {
          id: "book1",
          title: "nuevo título",
          totalCopies: 6,
        },
        bookRepositoryMock
      );
      expect(book.title).toBe("nuevo título");
      expect(book.totalCopies).toBe(6);
      expect(bookRepositoryMock.save).toHaveBeenCalledWith(book);
    });

    it("debería lanzar error si no encuentra el libro", async () => {
      bookRepositoryMock.findById.mockResolvedValue(null);
      await expect(
        updateBookUseCase(
          {
            id: "book1",
            title: "Nuevo título",
          },
          bookRepositoryMock
        )
      ).rejects.toThrow("Libro no encontrado");
    });

    it("debería lanzar error si totalCopies es menor a borrowedCopies", async () => {
      const book = createBook("book1", "Libro", "Autor", 5);
      book.borrowedCopies = 3;
      bookRepositoryMock.findById.mockResolvedValue(book);
      await expect(
        updateBookUseCase(
          {
            id: "book1",
            totalCopies: 2,
          },
          bookRepositoryMock
        )
      ).rejects.toThrow("No se puede reducir totalCopies por debajo de copias prestadas");
    });
  });

  describe("deleteBook", () => {
    it("debería eliminar el libro si no hay copias prestadas", async () => {
      const book = createBook("book1", "Libro", "Autor", 5);
      book.borrowedCopies = 0;
      bookRepositoryMock.findById.mockResolvedValue(book);
      await deleteBookUseCase({ id: "book1" }, bookRepositoryMock);
      expect(bookRepositoryMock.delete).toHaveBeenCalledWith("book1");
    });

    it("debería lanzar error si no encuentra el libro", async () => {
      bookRepositoryMock.findById.mockResolvedValue(null);
      await expect(deleteBookUseCase({ id: "book1" }, bookRepositoryMock)).rejects.toThrow(
        "Libro no encontrado"
      );
    });

    it("debería lanzar error si hay copias prestadas", async () => {
      const book = createBook("book1", "Libro", "Autor", 5);
      book.borrowedCopies = 1;
      bookRepositoryMock.findById.mockResolvedValue(book);
      await expect(deleteBookUseCase({ id: "book1" }, bookRepositoryMock)).rejects.toThrow(
        "No se puede eliminar un libro con copias prestadas"
      );
    });
  });
});
