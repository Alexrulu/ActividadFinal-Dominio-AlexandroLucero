import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { createUser } from '../entities/User'
import { randomUUID } from 'crypto'

interface RegisterUserInput {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export async function registerUserUseCase(
  input: RegisterUserInput,
  userRepository: UserRepository
): Promise<User> {
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

  const existing = await userRepository.findByEmail(input.email)
  if (existing) {
    throw new Error('El email ya está en uso')
  }

  const user = createUser(
    randomUUID(),
    input.name.trim(),
    input.email.trim().toLowerCase(),
    input.password,
    input.role ?? 'user'
  )

  await userRepository.save(user)

  return user
}
