import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangeUserRoleUseCase } from '../ChangeUserRoleUseCase';
import { User } from '../../entities/User';
import { UserRepository } from '../../repositories/UserRepository';

describe('ChangeUserRoleUseCase', () => {
  let userRepository: UserRepository;
  let useCase: ChangeUserRoleUseCase;

  const adminUser = new User('admin-1', 'Admin', 'admin@example.com', 'hashedpass', 'admin');
  const normalUser = new User('user-1', 'User', 'user@example.com', 'hashedpass', 'user');

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    useCase = new ChangeUserRoleUseCase(userRepository);
  });

  // Correcto funcionamiento ✅

  it('debería cambiar el rol si el solicitante es admin', async () => {
    (userRepository.findById as any)
      .mockResolvedValueOnce(adminUser) // para adminId
      .mockResolvedValueOnce(normalUser); // para targetUserId
    await useCase.execute({
      adminId: 'admin-1',
      targetUserId: 'user-1',
      newRole: 'admin',
    });
    expect(normalUser.role).toBe('admin');
    expect(userRepository.save).toHaveBeenCalledWith(normalUser);
  });

  // Errores esperados ❌

  it('debería lanzar error si el solicitante no existe', async () => {
    (userRepository.findById as any).mockResolvedValueOnce(null);
    await expect(() =>
      useCase.execute({
        adminId: 'admin-1',
        targetUserId: 'user-1',
        newRole: 'admin',
      }),
    ).rejects.toThrow('Usuario administrador no encontrado');
  });

  it('debería lanzar error si el solicitante no es admin', async () => {
    const notAdmin = new User('user-2', 'User2', 'u2@example.com', 'hash');
    (userRepository.findById as any).mockResolvedValueOnce(notAdmin);
    await expect(() =>
      useCase.execute({
        adminId: 'user-2',
        targetUserId: 'user-1',
        newRole: 'admin',
      }),
    ).rejects.toThrow('Solo los administradores pueden cambiar roles');
  });

  it('debería lanzar error si el usuario objetivo no existe', async () => {
    (userRepository.findById as any)
      .mockResolvedValueOnce(adminUser) // adminId
      .mockResolvedValueOnce(null); // targetUserId
    await expect(() =>
      useCase.execute({
        adminId: 'admin-1',
        targetUserId: 'user-1',
        newRole: 'admin',
      }),
    ).rejects.toThrow('Usuario no encontrado');
  });
  
});
