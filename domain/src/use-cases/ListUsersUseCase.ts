import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

interface ListUsersRequest {
  requesterId: string;
  requesterRole: 'admin' | 'user';
}

// Tipo de salida seguro, sin passwordHash
type SafeUser = Omit<User, 'passwordHash'>;

export async function listUsersUseCase(
  request: ListUsersRequest,
  userRepo: UserRepository
): Promise<SafeUser[]> {
  const { requesterId, requesterRole } = request;

  let users: User[];
  if (requesterRole === 'admin') {
    users = await userRepo.findAll();
  } else {
    const user = await userRepo.findById(requesterId);
    users = user ? [user] : [];
  }

  // Retornamos usuarios sin passwordHash
  return users.map(({ passwordHash, ...safeUser }) => safeUser);
}
