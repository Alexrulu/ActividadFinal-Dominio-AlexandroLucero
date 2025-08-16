import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listUsersUseCase } from '../ListUsersUseCase';
import { User } from '../../entities/User';

const user1: User = { id: '1', name: 'Alice', email: 'alice@mail.com', passwordHash: 'hash1', role: 'user' };
const user2: User = { id: '2', name: 'Bob', email: 'bob@mail.com', passwordHash: 'hash2', role: 'user' };
const user3: User = { id: '3', name: 'Charlie', email: 'charlie@mail.com', passwordHash: 'hash3', role: 'user' };

describe('ListUsersUseCase', () => {
  let userRepositoryMock: any;

  beforeEach(() => {
    userRepositoryMock = {
      findAll: vi.fn(),
      findById: vi.fn(),
    };
  });

  // Casos exitosos ✅
  it('deberia retornar todos los usuarios si el requester es admin', async () => {
    userRepositoryMock.findAll.mockResolvedValue([user1, user2, user3]);

    const result = await listUsersUseCase(
      { requesterId: 'admin-id', requesterRole: 'admin' },
      userRepositoryMock
    );

    expect(result).toEqual([
      { id: '1', name: 'Alice', email: 'alice@mail.com', role: 'user' },
      { id: '2', name: 'Bob', email: 'bob@mail.com', role: 'user' },
      { id: '3', name: 'Charlie', email: 'charlie@mail.com', role: 'user' },
    ]);
    expect(userRepositoryMock.findAll).toHaveBeenCalledOnce();
    expect(userRepositoryMock.findById).not.toHaveBeenCalled();
  });

  it('deberia retornar solo el usuario si el requester es user', async () => {
    userRepositoryMock.findById.mockResolvedValue(user2);

    const result = await listUsersUseCase(
      { requesterId: '2', requesterRole: 'user' },
      userRepositoryMock
    );

    expect(result).toEqual([{ id: '2', name: 'Bob', email: 'bob@mail.com', role: 'user' }]);
    expect(userRepositoryMock.findById).toHaveBeenCalledWith('2');
    expect(userRepositoryMock.findAll).not.toHaveBeenCalled();
  });

  it('deberia retornar un array vacío si el usuario no existe', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    const result = await listUsersUseCase(
      { requesterId: 'non-existent-id', requesterRole: 'user' },
      userRepositoryMock
    );

    expect(result).toEqual([]);
  });
});
