import { LoanRepositoryMemory } from '../infrastructure/loanRepositoryMemory';
import { BookRepositoryMemory } from '../infrastructure/bookRepositoryMemory';
import { UserRepositoryMemory } from '../infrastructure/userRepositoryMemory';
import { BcryptHashService } from '../infrastructure/bcryptHashService';
import { TokenGeneratorJWT } from '../infrastructure/tokenGeneratorJWTService';

export const loanRepo = new LoanRepositoryMemory();
export const bookRepo = new BookRepositoryMemory();
export const userRepo = new UserRepositoryMemory();
export const hashService = new BcryptHashService();
export const tokenGenerator = new TokenGeneratorJWT();
