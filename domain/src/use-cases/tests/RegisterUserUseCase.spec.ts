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
  async findAll(): Promise<User[]> {
    return this.users
  }
}

class FakeHashService {
  async hash(password: string): Promise<string> {
    return `hashed_${password}`
  }
  async compare(password: string, hashed: string): Promise<boolean> {
    return hashed === `hashed_${password}`
  }
}

describe('RegisterUserUseCase', () => {

  // Casos exitosos ✅

  it('deberia registrar el usuario si el email no está en uso', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    const user = await registerUserUseCase({
      name: 'Alex',
      email: 'alex@example.com',
      password: '123456'
    }, repository, hashService)
    expect(user.name).toBe('alex')
    expect(user.email).toBe('alex@example.com')
    expect(user.passwordHash).toBe('hashed_123456')
    expect(user.id).toBeDefined()
  })

  it('deberia manejar correctamente el registro de múltiples usuarios', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await registerUserUseCase({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password1'
    }, repository, hashService)
    await registerUserUseCase({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password2'
    }, repository, hashService)
    const user1 = await repository.findByEmail('user1@example.com')
    const user2 = await repository.findByEmail('user2@example.com')
    expect(user1).toBeDefined()
    expect(user1?.name).toBe('user one')
    expect(user1?.email).toBe('user1@example.com')
    expect(user1?.passwordHash).toBe('hashed_password1')
    expect(user2).toBeDefined()
    expect(user2?.name).toBe('user two')
    expect(user2?.email).toBe('user2@example.com')
  })

  it('deberia asignar el rol por defecto si no se especifica', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    const user = await registerUserUseCase({
      name: 'Default Role User',
      email: 'fbmln@example.com',
      password: 'password123'
    }, repository, hashService)
    expect(user.name).toBe('default role user')
    expect(user.email).toBe('fbmln@example.com')
    expect(user.passwordHash).toBe('hashed_password123')
    expect(user.id).toBeDefined()
    expect(user.role).toBe('user')
  })

  // Casos fallidos ❌

  it('lanza un error si el email ya está en uso', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await registerUserUseCase({
      name: 'Alex',
      email: 'alex@example.com',
      password: '123456'
    }, repository, hashService)
    await expect(
      registerUserUseCase({
        name: 'Duplicate User',
        email: 'alex@example.com',
        password: 'password123'
      }, repository, hashService)
    ).rejects.toThrow('El email ya está en uso')
  })

  it('lanza un error si el email es inválido', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await expect(registerUserUseCase({ name: 'Invalid Email', email: 'invalid-email', password: 'password123' }, repository, hashService))
    .rejects.toThrow('Email inválido')
  })

  it('lanza un error si el nombre está vacio', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await expect(
      registerUserUseCase({
        name: '',
        email: 'KU8qM@example.com',
        password: 'password123'
      }, repository, hashService)
    ).rejects.toThrow('El nombre no puede estar vacio')
  })

  it('lanza un error si la contraseña es demasiado corta', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await expect(
      registerUserUseCase({
        name: 'Short Password User',
        email: 'KU8qM@example.com',
        password: 'pass'
      }, repository, hashService)
    ).rejects.toThrow('La contraseña debe tener al menos 6 caracteres')
  })

  it('lanza un error si el nombre tiene solo espacios', async () => {
    const repository = new InMemoryUserRepository()
    const hashService = new FakeHashService()
    await expect(
      registerUserUseCase({
        name: '   ',
        email: 'KU8qM@example.com',
        password: 'password123'
      }, repository, hashService)
    ).rejects.toThrow('El nombre no puede estar vacio')
  })
  
})
