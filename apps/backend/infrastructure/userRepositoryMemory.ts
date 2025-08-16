import { User } from "../../../domain/src/entities/User";
import { UserRepository } from "../../../domain/src/repositories/UserRepository";
import usersData from "../data/users.json";

export class UserRepositoryMemory implements UserRepository {
  private users: User[] = usersData as User[];

  // ADMIN
  // email: 'admin@example.com',
  // password: 'admin123'

  // USER
  // email: 'user@example.com',
  // password: 'user123'

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? { ...user } : null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index === -1) {
      this.users.push({ ...user });
    } else {
      this.users[index] = { ...user };
    }
  }

  clear() {
    this.users = [];
  }
}
