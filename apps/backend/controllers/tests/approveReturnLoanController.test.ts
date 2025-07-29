import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { approveReturnLoanController } from '../approveReturnLoanController'
import { loanRepo, bookRepo } from '../repositories'
import { createBook, borrowBook } from '../../../../domain/src/entities/Book'
import { createLoan, approveLoan } from '../../../../domain/src/entities/Loan'

describe('approveReturnLoanController', () => {
  let app: express.Express

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    app.post('/loans/return', (req, res) => approveReturnLoanController(req, res))
    loanRepo.clear()
    bookRepo.clear()
    const book = createBook('book1', '1984', 'Orwell', 3)
    const borrowed = borrowBook(book)
    await bookRepo.save(borrowed)
    const loan = createLoan({
      id: 'loan1',
      userId: 'user1',
      bookId: 'book1',
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
    approveLoan(loan)
    loan.returnRequested = true
    await loanRepo.create(loan)
  })

  it('marca préstamo como devuelto correctamente', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Préstamo marcado como devuelto correctamente')
    const updatedLoan = await loanRepo.findById('loan1')
    expect(updatedLoan?.returned).toBe(true)
    const updatedBook = await bookRepo.findById('book1')
    expect(updatedBook?.borrowedCopies).toBe(0)
  })

  it('lanza error si el préstamo no existe', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'invalido' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Préstamo no encontrado')
  })

  it('lanza error si la solicitud de devolución ya fue aprobada', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) loan.returned = true
    await loanRepo.save(loan!)
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('La solicitud de devolución ya fue aprobada')
  })

  it('lanza error si no se pasa loanId', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Falta el ID del préstamo')
  })
})
