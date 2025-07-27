import { expect, describe, it } from 'vitest'
import { registerUserUseCase } from '../RegisterUserUseCase'
import { User } from '../../entities/User'

class InMemoryUserRepository {
  private users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null
  }

  async save(user: User): Promise<void> {
    this.users.push(user)
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null
  }
}

describe('RegisterUserUseCase', () => {

  // Correcto funcionamiento ✅

  it('debería registrar el usuario si el email no está en uso', async () => {
    const repository = new InMemoryUserRepository()
    const user = await registerUserUseCase({
      name: 'Alex',
      email: 'alex@example.com',
      password: '123456'
    }, repository)
    expect(user.name).toBe('Alex')
    expect(user.email).toBe('alex@example.com')
    expect(user.id).toBeDefined()
  })

  it('debería manejar correctamente el registro de múltiples usuarios', async () => {
    const repository = new InMemoryUserRepository()
    await registerUserUseCase({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password1'
    }, repository)
    await registerUserUseCase({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password2'
    }, repository)
    const user1 = await repository.findByEmail('user1@example.com')
    const user2 = await repository.findByEmail('user2@example.com')
    expect(user1).toBeDefined()
    expect(user1?.name).toBe('User One')
    expect(user1?.email).toBe('user1@example.com')
    expect(user2).toBeDefined()
    expect(user2?.name).toBe('User Two')
    expect(user2?.email).toBe('user2@example.com')
  })

  it('debería asignar el rol por defecto si no se especifica', async () => {
    const repository = new InMemoryUserRepository()
    const user = await registerUserUseCase({
      name: 'Default Role User',
      email: 'fbmln@example.com',
      password: 'password123'
    }, repository)
    expect(user.name).toBe('Default Role User')
    expect(user.email).toBe('fbmln@example.com')
    expect(user.passwordHash).toBe('password123')
    expect(user.id).toBeDefined()
    expect(user.role).toBe('user')
  })

  // Errores esperados ❌

  it('lanza un error si el email ya está en uso', async () => {
    const repository = new InMemoryUserRepository()
    await registerUserUseCase({
      name: 'Alex',
      email: 'alex@example.com',
      password: '123456'
    }, repository)
    await expect(
      registerUserUseCase({
        name: 'Duplicate User',
        email: 'alex@example.com',
        password: 'password123'
      }, repository)
    ).rejects.toThrow('El email ya está en uso')
  })

  it('lanza un error si el email es inválido', async () => {
    const repository = new InMemoryUserRepository()
    await expect(registerUserUseCase({ name: 'Invalid Email', email: 'invalid-email', password: 'password123' }, repository))
    .rejects.toThrow('Email inválido')
  })

  it('lanza un error si el nombre está vacío', async () => {
    const repository = new InMemoryUserRepository()
    await expect(
      registerUserUseCase({
        name: '',
        email: 'KU8qM@example.com',
        password: 'password123'
      }, repository)
    ).rejects.toThrow('El nombre no puede estar vacío')
  })

  it('lanza un error si la contraseña es demasiado corta', async () => {
    const repository = new InMemoryUserRepository()
    await expect(
      registerUserUseCase({
        name: 'Short Password User',
        email: 'KU8qM@example.com',
        password: 'pass'
      }, repository)
    ).rejects.toThrow('La contraseña debe tener al menos 6 caracteres')
  })

  it('lanza un error si el nombre tiene solo espacios', async () => {
    const repository = new InMemoryUserRepository()
    await expect(
      registerUserUseCase({
        name: '   ',
        email: 'KU8qM@example.com',
        password: 'password123'
      }, repository)
    ).rejects.toThrow('El nombre no puede estar vacío')
  })
  
})
