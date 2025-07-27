import { describe, it, expect, vi, beforeEach } from 'vitest';
import { changeUserRoleUseCase } from '../ChangeUserRoleUseCase';
import { User } from '../../entities/User';
import { createUser } from '../../entities/User';

describe('ChangeUserRoleUseCase', () => {
  let userRepository: any;

  const adminUser = createUser('admin-1', 'Admin', 'admin@example.com', 'hashedpass', 'admin');
  const normalUser = createUser('user-1', 'User', 'user@example.com', 'hashedpass',);

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
  });

  // Correcto funcionamiento ✅

  it('debería cambiar el rol si el solicitante es admin', async () => {
    (userRepository.findById as any)
      .mockResolvedValueOnce(adminUser) // para adminId
      .mockResolvedValueOnce(normalUser); // para targetUserId
    await changeUserRoleUseCase({
      adminId: 'admin-1',
      targetUserId: 'user-1',
      newRole: 'admin',
    }, userRepository);
    expect(normalUser.role).toBe('admin');
    expect(userRepository.save).toHaveBeenCalledWith(normalUser);
  });

  // Errores esperados ❌

  it('debería lanzar error si el solicitante no existe', async () => {
    (userRepository.findById as any).mockResolvedValueOnce(null);
    await expect(() =>
      changeUserRoleUseCase({ adminId: 'user-1', targetUserId: 'user-2', newRole: 'admin' }, userRepository),
    ).rejects.toThrow('Usuario administrador no encontrado');
  });

  it('debería lanzar error si el solicitante no es admin', async () => {
    const notAdmin = createUser('user-2', 'User2', 'u2@example.com', 'hash');
    (userRepository.findById as any).mockResolvedValueOnce(notAdmin);
    await expect(() =>
      changeUserRoleUseCase({ adminId: 'user-1', targetUserId: 'user-2', newRole: 'admin' }, userRepository),
    ).rejects.toThrow('Solo los administradores pueden cambiar roles');
  });

  it('debería lanzar error si el usuario objetivo no existe', async () => {
    (userRepository.findById as any)
      .mockResolvedValueOnce(adminUser) // adminId
      .mockResolvedValueOnce(null); // targetUserId
    await expect(() =>
      changeUserRoleUseCase({ adminId: 'admin-1', targetUserId: 'user-2', newRole: 'admin' }, userRepository),
    ).rejects.toThrow('Usuario no encontrado');
  });
  
});
