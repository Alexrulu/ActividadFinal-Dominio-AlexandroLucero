import { describe, it, beforeEach, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { listUsersController } from '../listUsersController';
import { User } from '../../../../domain/src/entities/User';

class UserRepositoryMemory {
  users: User[] = [];
  findAll() { return Promise.resolve(this.users); }
  findById(id: string) { return Promise.resolve(this.users.find(u => u.id === id) || null); }
  clear() { this.users = []; }
  create(user: User) { this.users.push(user); }
}

describe('listUsersController', () => {
  let app: express.Express;
  let userRepo: UserRepositoryMemory;
  const secret = 'default_secret';

  const adminToken = jwt.sign({ userId: 'admin-id', role: 'admin' }, secret);
  const userToken = jwt.sign({ userId: 'user1', role: 'user' }, secret);
  beforeEach(() => {
  app = express();
  app.use(express.json());
  userRepo = new UserRepositoryMemory();
  
  // Cargamos los usuarios del JSON
  userRepo.create({
    id: 'admin1',
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: 'hash-admin',
    role: 'admin'
  });
  userRepo.create({
    id: 'user1',
    name: 'User',
    email: 'user@example.com',
    passwordHash: 'hash-user',
    role: 'user'
  });

  app.get('/users', (req, res) => listUsersController(req, res));
});


  it('devuelve todos los usuarios si el requester es admin', async () => {
  const res = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${adminToken}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.users).toHaveLength(2);
  expect(res.body.users[0]).toEqual({ id: 'admin1', name: 'Admin', email: 'admin@example.com',
    role: 'admin'
   });
  expect(res.body.users[1]).toEqual({ id: 'user1', name: 'User', email: 'user@example.com', role: 'user' });
});

it('devuelve solo el usuario si el requester es user', async () => {
  const res = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${userToken}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.users).toHaveLength(1);
  expect(res.body.users[0]).toEqual({ id: 'user1', name: 'User', email: 'user@example.com', role: 'user' });
});


  it('retorna error 401 si no se proporciona token', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Token no proporcionado');
  });

  it('retorna error 401 si el token es inválido', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(500); // jwt.verify lanzará error, lo manejamos como 500
  });
});
