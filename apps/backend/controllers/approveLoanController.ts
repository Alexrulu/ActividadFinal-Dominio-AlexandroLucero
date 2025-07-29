import { Request, Response } from 'express'
import { approveLoanUseCase } from '../../../domain/src/use-cases/ApproveLoanUseCase'
import { loanRepo, bookRepo } from './repositories';

export async function approveLoanController(req: Request, res: Response) {
  const { loanId } = req.body

  try {
    await approveLoanUseCase({ loanId }, loanRepo, bookRepo)
    res.status(200).json({ message: 'Préstamo aprobado correctamente' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
