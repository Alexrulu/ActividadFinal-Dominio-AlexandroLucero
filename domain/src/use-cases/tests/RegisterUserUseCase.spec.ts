import { expect, describe, it } from 'vitest'
import { RegisterUserUseCase } from '../RegisterUserUseCase'
import { User } from '../../entities/User'

class InMemoryUserRepository {
  private users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null
  }

  async save(user: User): Promise<void> {
    this.users.push(user)
  }
}

describe('RegisterUserUseCase', () => {

  // Tests Exitosos ✅

  it('debería registrar el usuario si el email no está en uso', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    const user = await useCase.execute({
      name: 'Alex',
      email: 'alex@example.com',
      password: 'secure123'
    })
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('Alex')
    expect(user.email).toBe('alex@example.com')
    expect(user.id).toBeDefined()
  })

  it('debería manejar correctamente el registro de múltiples usuarios', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await useCase.execute({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password1'
    })
    await useCase.execute({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password2'
    })
    const user1 = await repository.findByEmail('user1@example.com')
    const user2 = await repository.findByEmail('user2@example.com')
    expect(user1).toBeInstanceOf(User)
    expect(user2).toBeInstanceOf(User)
  })

  it('inicia sesión si la contraseña es correcta', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    const user = await useCase.execute({
      name: 'Test User',
      email: 'BtM6X@example.com',
      password: 'password123'
    })
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('Test User')
    expect(user.email).toBe('btm6x@example.com')
    expect(user.password).toBe('password123')
    expect(user.id).toBeDefined()
  })

  it('debería asignar el rol por defecto si no se especifica', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    const user = await useCase.execute({
      name: 'Default Role User',
      email: 'FbMlN@example.com',
      password: 'password123'
    })
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('Default Role User')
    expect(user.email).toBe('fbmln@example.com')
    expect(user.password).toBe('password123')
    expect(user.id).toBeDefined()
    expect(user.role).toBe('user')
  })

  // Tests Fallidos ❌

  it('lanza un error si el email ya está en uso', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await useCase.execute({
      name: 'Alex',
      email: 'alex@example.com',
      password: 'secure123'
    })
    await expect(
      useCase.execute({
        name: 'Another',
        email: 'alex@example.com',
        password: 'diffpass'
      })
    ).rejects.toThrow('Email ya está en uso')
  })

  it('lanza un error si el email es inválido', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await expect(
      useCase.execute({
        name: 'Invalid Email',
        email: 'invalid-email',
        password: 'password123'
      })
    ).rejects.toThrow('Email inválido')
  })

  it('lanza un error si el nombre está vacío', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await expect(
      useCase.execute({
        name: '',
        email: 'KU8qM@example.com',
        password: 'password123'
      })
    ).rejects.toThrow('El nombre no puede estar vacío')
  })

  it('lanza un error si la contraseña es demasiado corta', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await expect(
      useCase.execute({
        name: 'Short Password',
        email: 'KU8qM@example.com',
        password: 'pass'
      })
    ).rejects.toThrow('La contraseña debe tener al menos 6 caracteres')
  })

  it('lanza un error si el nombre tiene solo espacios', async () => {
    const repository = new InMemoryUserRepository()
    const useCase = new RegisterUserUseCase(repository)
    await expect(
      useCase.execute({
        name: '   ',
        email: 'KU8qM@example.com',
        password: 'password123'
      })
    ).rejects.toThrow('El nombre no puede estar vacío')
  })
  
})
