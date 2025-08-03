import { Router } from "express";
import { listLoansController } from "../controllers/listLoansController";

const router = Router();

router.post('/', listLoansController);

export default router;