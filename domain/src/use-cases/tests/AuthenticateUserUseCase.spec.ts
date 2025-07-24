import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateUserUseCase } from '../AuthenticateUserUseCase';
import { User } from '../../entities/User';

describe('AuthenticateUserUseCase', () => {
  let userRepository: any;
  let hasher: any;
  let tokenGenerator: any;
  let useCase: AuthenticateUserUseCase;

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
    useCase = new AuthenticateUserUseCase(userRepository, hasher, tokenGenerator);
  });

  it('autentica y devuelve un token si las credenciales son correctas', async () => {
    const user = new User('user-id', 'John', 'john@example.com', 'hashed-password');
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokenGenerator.generate.mockReturnValue('token123');
    const result = await useCase.execute({ email: 'john@example.com', password: '123456' });
    expect(result).toEqual({ token: 'token123' , userId: 'user-id' });
  });

  it('lanza error si el usuario no existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'no@existe.com', password: '123456' }))
      .rejects
      .toThrow('Usuario no encontrado');
  });

  it('lanza error si la contraseña es incorrecta', async () => {
    const user = new User('user-id', 'John', 'john@example.com', 'hashed-password');
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(false);
    await expect(useCase.execute({ email: 'john@example.com', password: 'wrongpass' }))
      .rejects
      .toThrow('Contraseña incorrecta');
  });

  
});
