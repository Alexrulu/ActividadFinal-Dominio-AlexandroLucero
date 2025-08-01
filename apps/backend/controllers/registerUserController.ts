import { Request, Response } from "express"
import { registerUserUseCase } from "../../../domain/src/use-cases/RegisterUserUseCase"
import { userRepo } from "./repositories";
import { hashService } from "./repositories";

export async function registerUserController(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body

    const user = await registerUserUseCase(
      { name, email, password, role },
      userRepo, hashService
    )

    // No se devuelve la passwordHash por seguridad
    const { passwordHash, ...userWithoutPassword } = user

    return res.status(201).json(userWithoutPassword)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}
