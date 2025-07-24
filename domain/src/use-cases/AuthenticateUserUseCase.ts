interface AuthenticateUserInput {
  email: string;
  password: string;
}

interface AuthenticateUserOutput {
  token: string;
  userId: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: any,
    private hasher: { compare: (plain: string, hash: string) => Promise<boolean> },
    private tokenGenerator: { generate: (payload: any) => string }
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new Error('Usuario no encontrado');

    const passwordMatch = await this.hasher.compare(input.password, user.passwordHash);
    if (!passwordMatch) throw new Error('Contraseña incorrecta');

    const token = this.tokenGenerator.generate({ userId: user.id });

    return {
      token,
      userId: user.id
    };
  }
}
