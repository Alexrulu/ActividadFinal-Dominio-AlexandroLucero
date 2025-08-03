import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { returnLoanController } from '../returnLoanController'
import { loanRepo } from '../repositories'
import { createLoan, approveLoan } from '../../../../domain/src/entities/Loan'

describe('returnLoanController', () => {
  let app: express.Express

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    app.post('/loans/return', (req, res) => returnLoanController(req, res))
    loanRepo.clear()
    const loan = createLoan({
      id: 'loan1',
      userId: 'user1',
      bookId: 'book1',
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    approveLoan(loan)
    await loanRepo.create(loan)
  })

  it('solicita devolucion correctamente', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Devolucion solicitada correctamente')
    const loan = await loanRepo.findById('loan1')
    expect(loan?.returnRequested).toBe(true)
  })

  it('falla si no se pasa loanId', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Falta el ID del prestamo')
  })

  it('falla si prestamo no existe', async () => {
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'inexistente' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Prestamo no encontrado')
  })

  it('falla si ya fue devuelto', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) loan.returned = true
    await loanRepo.save(loan!)
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('El prestamo ya fue devuelto')
  })

  it('falla si ya se solicito la devolucion', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) loan.returnRequested = true
    await loanRepo.save(loan!)
    const res = await request(app)
      .post('/loans/return')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('La devolucion ya fue solicitada')
  })
})
