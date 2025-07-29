import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { approveLoanController } from '../approveLoanController'
import { loanRepo, bookRepo } from '../repositories'
import { approveLoan, createLoan } from '../../../../domain/src/entities/Loan'
import { createBook } from '../../../../domain/src/entities/Book'

describe('approveLoanController', () => {
  let app: express.Express

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    app.post('/loans/approve', (req, res) => approveLoanController(req, res))

    // Limpiamos el estado compartido
    loanRepo.clear()
    bookRepo.clear()

    await bookRepo.save(createBook('book1', 'El Quijote', 'Cervantes', 5))

    const loan = createLoan({
      id: 'loan1',
      userId: 'user1',
      bookId: 'book1',
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await loanRepo.create(loan)
  })

  it('aprueba préstamo con loanId válido', async () => {
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Préstamo aprobado correctamente')
  })

  it('retorna error para loanId no encontrado', async () => {
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'invalido' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Préstamo no encontrado')
  })

  it('retorna error si el préstamo ya fue aprobado', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) approveLoan(loan)
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('El préstamo ya fue aprobado')
  })

})
