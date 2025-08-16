import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { approveLoanController } from '../approveLoanController'
import { loanRepo, bookRepo } from '../repositories'
import { approveLoan, createLoan } from '../../../../domain/src/entities/Loan'

describe('approveLoanController', () => {
  let app: express.Express

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    app.post('/loans/approve', (req, res) => approveLoanController(req, res))
  
    loanRepo.clear()

    const loan = createLoan({
      id: 'loan1',
      userId: 'user1',
      bookId: 'OuW5dC2O99AC',
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await loanRepo.create(loan)
  })


  // Casos exitosos ✅

  it('aprueba prestamo con loanId válido', async () => {
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Prestamo aprobado correctamente')
  })

  // Casos fallidos ❌

  it('retorna error para loanId no encontrado', async () => {
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'invalido' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Prestamo no encontrado')
  })

  it('retorna error si el prestamo ya fue aprobado', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) approveLoan(loan)
    const res = await request(app)
      .post('/loans/approve')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('El prestamo ya fue aprobado')
  })

})
