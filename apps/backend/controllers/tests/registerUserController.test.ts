import { describe, it, expect, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'
import { registerUserController } from '../registerUserController'
import { userRepo } from '../repositories'

describe('registerUserController', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.post('/register', (req, res) => registerUserController(req, res))
    userRepo.clear() // Limpiar usuarios antes de cada test
  })

  it('registra un usuario correctamente', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Alex',
        email: 'Alex@example.com',
        password: '123456',
        role: 'user'
      })
    expect(res.status).toBe(201)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'alex',
        email: 'alex@example.com',
        role: 'user'
      })
    )
    expect(res.body).not.toHaveProperty('passwordHash')
  })

  it('retorna error si el email ya está en uso', async () => {
    await request(app).post('/register').send({
      name: 'Alex',
      email: 'alex@example.com',
      password: '123456'
    })
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Alex',
        email: 'alex@example.com',
        password: '123456'
      })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'El email ya está en uso' })
  })

  it('retorna error si el email es inválido', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Alex',
        email: 'correo-invalido',
        password: '123456'
      })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Email inválido' })
  })

  it('retorna error si el nombre está vacio', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: '',
        email: 'alex@example.com',
        password: '123456'
      })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'El nombre no puede estar vacio' })
  })

  it('retorna error si la contraseña es muy corta', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Alex',
        email: 'alex@example.com',
        password: '123'
      })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'La contraseña debe tener al menos 6 caracteres' })
  })
})
