import { Request, Response } from 'express';
import { authenticateUserUseCase } from '@domain/use-cases/AuthenticateUserUseCase';
import { userRepo, hashService, tokenGenerator } from './repositories';

export async function authenticateUserController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const output = await authenticateUserUseCase(
      { email, password },
      userRepo,
      hashService,
      tokenGenerator
    );

    return res.status(200).json(output);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
