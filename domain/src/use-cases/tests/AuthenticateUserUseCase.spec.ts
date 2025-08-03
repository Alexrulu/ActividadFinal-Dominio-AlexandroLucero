import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateUserUseCase } from '../AuthenticateUserUseCase';
import { createUser } from '../../entities/User';

describe('AuthenticateUserUseCase', () => {
  let userRepository: any;
  let hasher: any;
  let tokenGenerator: any;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
    };
    hasher = {
      compare: vi.fn(),
    };
    tokenGenerator = {
      generate: vi.fn(),
    };
  });

  const credentials = { email: 'john@example.com', password: '123456' };

  // Casos exitosos ✅

  it('autentica y devuelve un token si las credenciales son correctas', async () => {
    const user = createUser('user-id', 'John', 'john@example.com', 'hashed-password');
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokenGenerator.generate.mockReturnValue('token123');
    const result = await authenticateUserUseCase(credentials, userRepository, hasher, tokenGenerator);
    expect(result).toEqual({ token: 'token123' , userId: 'user-id' });
  });

  // Casos fallidos ❌

  it('lanza error si el usuario no existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(authenticateUserUseCase(credentials, userRepository, hasher, tokenGenerator))
      .rejects
      .toThrow('Usuario no encontrado');
  });

  it('lanza error si la contraseña es incorrecta', async () => {
    const user = createUser('user-id', 'John', 'john@example.com', 'hashed-password');
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(false);
    await expect(authenticateUserUseCase(credentials, userRepository, hasher, tokenGenerator))
      .rejects
      .toThrow('Contraseña incorrecta');
  });

});
