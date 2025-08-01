import { HashService } from '../../../domain/src/services/HashService';
import bcrypt from 'bcrypt';

export class BcryptHashService implements HashService {
  async hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }
}
