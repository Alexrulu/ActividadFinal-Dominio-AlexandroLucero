import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entities/User'
import { createUser } from '../entities/User'
import { randomUUID } from 'crypto'
import { HashService } from '../services/HashService'

interface RegisterUserInput {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export async function registerUserUseCase(
  input: RegisterUserInput,
  userRepository: UserRepository,
  hashService: HashService
): Promise<User> {
  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  if (!input.name || input.name.trim() === '') {
    throw new Error('El nombre no puede estar vacio')
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

  const passwordHash = await hashService.hash(input.password)

  const user = createUser(
    randomUUID(),
    input.name.trim(),
    input.email.trim().toLowerCase(),
    passwordHash,
    input.role ?? 'user'
  )
  
  await userRepository.save(user)
  return user
}
