import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../../domain/src/services/TokenGenerator';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret'; // mejor usar variable de entorno

export class TokenGeneratorJWT implements TokenGenerator {
  generate(payload: any): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  }
}
