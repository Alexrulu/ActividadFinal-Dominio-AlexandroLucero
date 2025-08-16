import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { BookRepositoryMemory } from '../../infrastructure/bookRepositoryMemory'

describe('listBooksController', () => {
  let app: express.Express
  let bookRepo: BookRepositoryMemory

  beforeEach(async () => {
    app = express()
    app.use(express.json())

    bookRepo = new BookRepositoryMemory()

    app.get('/books/list', async (req, res) => {
      try {
        const books = await bookRepo.findAll()
        if (books.length === 0) {
          return res.status(404).json({ error: 'No se encontraron libros' })
        }
        res.status(200).json({ message: 'Libros obtenidos correctamente', books })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })
  })

  // Casos exitosos ✅

  it('Devuelve los libros', async () => {
    const res = await request(app).get('/books/list')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Libros obtenidos correctamente')
    expect(res.body.books).toHaveLength(9)
    expect(res.body.books[0].title).toBe('Programming Languages')
  })

  it('Devuelve los titulos de los libros', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].title).toBe('Programming Languages')
  })

  it('Devuelve los autores de los libros', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].author).toBe('Kent D. Lee')
  })

  it('Devuelve el total de copias de un libro especifico', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].totalCopies).toBe(1)
  })

  it('Devuelve el total de copias prestadas de un libro especifico', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].borrowedCopies).toBe(0)
  })

  // Casos fallidos ❌
  
  it('Lanza error si no se encuentran libros', async () => {
    (bookRepo as any).books = [];  
    const res = await request(app).get('/books/list');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('No se encontraron libros');
  });

})