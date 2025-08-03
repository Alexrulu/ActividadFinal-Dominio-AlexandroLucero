import { UserRepository } from '../repositories/UserRepository'

export async function changeUserRoleUseCase(
  params: {
    adminId: string
    targetUserId: string
    newRole: 'admin' | 'user'
  },
  userRepository: UserRepository
): Promise<void> {
  const { adminId, targetUserId, newRole } = params

  const admin = await userRepository.findById(adminId)
  if (!admin) throw new Error('Usuario administrador no encontrado')
  if (admin.role !== 'admin') throw new Error('Solo los administradores pueden cambiar roles')

  const targetUser = await userRepository.findById(targetUserId)
  if (!targetUser) throw new Error('Usuario no encontrado')
  targetUser.role = newRole

  await userRepository.save(targetUser)
}
