import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { addBookController, updateBookController, deleteBookController } from "../manageBooksController";
import { bookRepo } from "../repositories";
import { createBook } from "../../../../domain/src/entities/Book";

describe("manageBooksController", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/books/manage/add", (req, res) => addBookController(req, res));
    app.put("/books/manage/update", (req, res) => updateBookController(req, res));
    app.delete("/books/manage/delete", (req, res) => deleteBookController(req, res));
    bookRepo.clear();
  });

  // Casos exitosos ✅

  it("Deberia crear un libro", async () => {
    const res = await request(app)
      .post("/books/manage/add")
      .send({ title: "el quijote", author: "cervantes", totalCopies: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Libro creado correctamente");
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("el quijote");
    expect(res.body.author).toBe("cervantes");
    expect(res.body.totalCopies).toBe(5);
  });

  it("Deberia actualizar un libro", async () => {
    const book = createBook("book1", "el quijote", "cervantes", 5);
    await bookRepo.save(book);
    const res = await request(app)
      .put("/books/manage/update")
      .send({ id: "book1", title: "don quijote de la mancha", author: "miguel de cervantes", totalCopies: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Libro actualizado correctamente");
    expect(res.body.id).toBe("book1");
    expect(res.body.title).toBe("don quijote de la mancha");
    expect(res.body.author).toBe("miguel de cervantes");
    expect(res.body.totalCopies).toBe(10);
  });

  it("Elimina un libro", async () => {
    const book = createBook("book1", "el quijote", "cervantes", 5);
    await bookRepo.save(book);
    const res = await request(app)
      .delete("/books/manage/delete")
      .send({ id: "book1" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Libro eliminado correctamente");
  });

  // Casos fallidos ❌

  it("Devuelve error si el libro ya existe", async () => {
    const book = createBook("book1", "el quijote", "cervantes", 5);
    await bookRepo.save(book);
    const res = await request(app)
      .post("/books/manage/add")
      .send({ title: "el quijote", author: "cervantes", totalCopies: 5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("El libro ya existe");
  });
});