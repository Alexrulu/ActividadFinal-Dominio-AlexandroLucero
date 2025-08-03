import { TokenGenerator } from '../services/TokenGenerator';
import { HashService } from '../services/HashService';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  token: string;
  userId: string;
}

export interface UserRepository {
  findByEmail: (email: string) => Promise<{ id: string; passwordHash: string } | null>;
}

export async function authenticateUserUseCase(
  input: AuthenticateUserInput,
  userRepository: UserRepository,
  hasher: HashService,
  tokenGenerator: TokenGenerator
): Promise<AuthenticateUserOutput> {
  const user = await userRepository.findByEmail(input.email);
  if (!user) throw new Error('Usuario no encontrado');

  const passwordMatch = await hasher.compare(input.password, user.passwordHash);
  if (!passwordMatch) throw new Error('Contraseña incorrecta');

  const token = tokenGenerator.generate({ userId: user.id });

  return { token, userId: user.id };
}
