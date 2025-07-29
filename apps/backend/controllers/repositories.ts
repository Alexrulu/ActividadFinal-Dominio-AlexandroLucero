import { LoanRepositoryMemory } from '../infrastructure/loanRepositoryMemory';
import { BookRepositoryMemory } from '../infrastructure/bookRepositoryMemory';

export const loanRepo = new LoanRepositoryMemory();
export const bookRepo = new BookRepositoryMemory();
