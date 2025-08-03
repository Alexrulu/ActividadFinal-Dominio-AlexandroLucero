import { Response, Request } from "express";
import { changeUserRoleUseCase } from "../../../domain/src/use-cases/ChangeUserRoleUseCase";
import { userRepo } from "./repositories";

export async function changeUserRoleController(req: Request, res: Response) {
  try {
    const { adminId, targetUserId, newRole } = req.body;
    await changeUserRoleUseCase({ adminId, targetUserId, newRole }, userRepo);

    if (!adminId) {
      return res.status(400).json({ error: "Falta el ID del administrador" });
    } else if (!targetUserId) {
      return res.status(400).json({ error: "Falta el ID del usuario objetivo" });
    } else if (!newRole) {
      return res.status(400).json({ error: "Falta indicar el nuevo rol" });
    }

    res.status(200).json({ message: "Rol cambiado correctamente", adminId, targetUserId, newRole });    
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}