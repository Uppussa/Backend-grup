import { Router } from "express";
import { createExam} from "../controllers/exams.controller.js";

const router = Router();

router.post('/new', createExam);

export default router;