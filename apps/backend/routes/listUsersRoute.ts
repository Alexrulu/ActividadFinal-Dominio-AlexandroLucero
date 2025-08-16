import { Router } from "express";
import { listUsersController } from "../controllers/listUsersController";

const router = Router();

router.get('/', listUsersController);

export default router;