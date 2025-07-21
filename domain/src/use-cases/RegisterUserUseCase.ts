import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { randomUUID } from 'crypto'

interface RegisterUserInput {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const isValidEmail = (email: string): boolean => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    if (!input.name || input.name.trim() === '') {
      throw new Error('El nombre no puede estar vacío')
    }

    if (!isValidEmail(input.email)) {
      throw new Error('Email inválido')
    }

    if (!input.password || input.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) {
      throw new Error('Email ya está en uso')
    }

    const user = new User(
      randomUUID(),
      input.name.trim(),
      input.email.trim().toLowerCase(),
      input.password,
      input.role ?? 'user'
    )

    await this.userRepository.save(user)

    return user
  }
}
