import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { createBook } from '../../../../domain/src/entities/Book'
import { BookRepositoryMemory } from '../../infrastructure/bookRepositoryMemory'

describe('listBooksController', () => {
  let app: express.Express
  let bookRepo: BookRepositoryMemory

  beforeEach(async () => {
    app = express()
    app.use(express.json())

    bookRepo = new BookRepositoryMemory()

    app.post('/books/manage', async (req, res) => {
      try {
        const { title, author, totalCopies } = req.body
        const id = await bookRepo.save(createBook(crypto.randomUUID(), title, author, totalCopies))
        res.status(201).json({ message: 'Libro creado correctamente', id, title, author, totalCopies })
      } catch (error: any) {
        res.status(400).json({ error: error.message })
      }
    })

    app.get('/books/list', async (req, res) => {
      try {
        const books = await bookRepo.findAll({ page: 1, limit: 10 })
        if (books.length === 0) {
          return res.status(404).json({ error: 'No se encontraron libros' })
        }
        res.status(200).json({ message: 'Libros obtenidos correctamente', books })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    await request(app)
    .post('/books/manage')
    .send({ title: 'Book 1', author: 'Author 1', totalCopies: 10 })
  })

  it('should list books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Libros obtenidos correctamente')
    expect(res.body.books).toHaveLength(1)
    expect(res.body.books[0].title).toBe('book 1')
  })

  it('should return the name of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].title).toBe('book 1')
  })

  it('should return the author of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].author).toBe('author 1')
  })

  it('should return the total copies of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].totalCopies).toBe(10)
  })

  it('should return the amount of borrowed copies of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].borrowedCopies).toBe(0)
  })

  it('should return error message if there are no books', async () => {
    bookRepo.clear()
    const res = await request(app).get('/books/list')
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('No se encontraron libros')
  })
})