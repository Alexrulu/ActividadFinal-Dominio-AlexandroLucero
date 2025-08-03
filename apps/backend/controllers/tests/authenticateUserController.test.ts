import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authenticateUserController } from '../authenticateUserController';
import { userRepo, hashService, tokenGenerator } from '../repositories';

vi.mock('../repositories', () => ({
  userRepo: {
    findByEmail: vi.fn(),
  },
  hashService: {
    compare: vi.fn(),
  },
  tokenGenerator: {
    generate: vi.fn(),
  }
}));

describe('authenticateUserController', () => {
  let app: express.Express;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/login', authenticateUserController);
    vi.clearAllMocks();
  });

  it('deberia autenticar usuario correctamente y devolver token', async () => {
    (userRepo.findByEmail as any).mockResolvedValue({
      id: 'user1',
      passwordHash: 'hashed_password'
    });
    (hashService.compare as any).mockResolvedValue(true);
    (tokenGenerator.generate as any).mockReturnValue('fake-jwt-token');
    const response = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: 'fake-jwt-token',
      userId: 'user1'
    });
    expect(userRepo.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(hashService.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(tokenGenerator.generate).toHaveBeenCalledWith({ userId: 'user1' });
  });

  it('deberia devolver error si usuario no existe', async () => {
    (userRepo.findByEmail as any).mockResolvedValue(null);
    const response = await request(app)
      .post('/login')
      .send({ email: 'unknown@example.com', password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Usuario no encontrado' });
  });

  it('deberia devolver error si la contraseña es incorrecta', async () => {
    (userRepo.findByEmail as any).mockResolvedValue({
      id: 'user1',
      passwordHash: 'hashed_password'
    });
    (hashService.compare as any).mockResolvedValue(false);
    const response = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Contraseña incorrecta' });
  });
});
