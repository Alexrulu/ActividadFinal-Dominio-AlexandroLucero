import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../../domain/src/services/TokenGenerator';

const SECRET_KEY = 'default_secret';

export class TokenGeneratorJWT implements TokenGenerator {
  generate(payload: any): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
  }
}
