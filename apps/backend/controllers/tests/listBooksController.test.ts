import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { listBooksController } from '../listBooksController'
import { bookRepo } from '../repositories'

describe('listBooksController', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.get('/books/list', listBooksController)
  })

  it('should get list books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Libros obtenidos correctamente')
  })

  it('should return the name of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].title).toBe('Book 1')
  })

  it('should return the author of books', async () => {
    const res = await request(app).get('/books/list')
    expect(res.body.books[0].author).toBe('Author 1')
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
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('No se encontraron libros')
  })
})