import { UserRepository } from '../repositories/UserRepository';

export class ChangeUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: {
    adminId: string;
    targetUserId: string;
    newRole: 'admin' | 'user';
  }): Promise<void> {
    const { adminId, targetUserId, newRole } = params;

    const admin = await this.userRepository.findById(adminId);
    if (!admin) throw new Error('Usuario administrador no encontrado');
    if (admin.role !== 'admin') throw new Error('Solo los administradores pueden cambiar roles');

    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) throw new Error('Usuario no encontrado');

    targetUser.role = newRole;
    await this.userRepository.save(targetUser);
  }
}
