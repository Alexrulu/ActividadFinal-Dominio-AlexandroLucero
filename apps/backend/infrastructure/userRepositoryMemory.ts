import { User } from "../../../domain/src/entities/User";
import { UserRepository } from "../../../domain/src/repositories/UserRepository";

export class UserRepositoryMemory implements UserRepository {
  private users: User[] = [
    {
      id: "user1",
      name: "Admin",
      email: "admin@example.com",
      passwordHash: "hashed_password",
      role: "admin",
    }
  ];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? { ...user } : null;
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
