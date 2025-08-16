import { Request, Response } from 'express';
import { listUsersUseCase } from '../../../domain/src/use-cases/ListUsersUseCase';
import { userRepo } from './repositories';
import jwt from 'jsonwebtoken';

export async function listUsersController(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const decoded = jwt.verify(token, 'default_secret') as {
      userId: string;
      role: 'admin' | 'user';
    };

    const users = await listUsersUseCase(
      {
        requesterId: decoded.userId,
        requesterRole: decoded.role,
      },
      userRepo
    );

    return res.json({ users });
  } catch (error: any) {
    console.error('Error en listUsersController:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
