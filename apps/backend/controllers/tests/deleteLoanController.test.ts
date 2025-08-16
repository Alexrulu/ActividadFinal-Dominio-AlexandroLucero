import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { deleteLoanController } from '../deleteLoanController'
import { loanRepo } from '../repositories'
import { createLoan, approveLoan } from '../../../../domain/src/entities/Loan'

describe('deleteLoanController', () => {
  let app: express.Express

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    app.post('/loans/delete', (req, res) => deleteLoanController(req, res))
  
    loanRepo.clear()

    const loan = createLoan({
      id: 'loan1',
      userId: 'user1',
      bookId: 'book1',
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await loanRepo.create(loan)
  })

  // Casos exitosos ✅

  it('elimina préstamo con loanId válido', async () => {
    const res = await request(app)
      .post('/loans/delete')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Préstamo eliminado correctamente')
  })

  // Casos fallidos ❌

  it('retorna error si falta loanId', async () => {
    const res = await request(app)
      .post('/loans/delete')
      .send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Falta el ID del préstamo')
  })

  it('retorna error si el préstamo no existe', async () => {
    const res = await request(app)
      .post('/loans/delete')
      .send({ loanId: 'invalido' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Prestamo no encontrado')
  })

  it('retorna error si el préstamo ya fue aprobado', async () => {
    const loan = await loanRepo.findById('loan1')
    if (loan) approveLoan(loan)

    const res = await request(app)
      .post('/loans/delete')
      .send({ loanId: 'loan1' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('No se puede eliminar un prestamo aprobado')
  })
})
