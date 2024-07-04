import { Router } from "express";
import { createExam, getAllExams, getExamById, updateExam, deleteExam} from "../controllers/exams.controller.js";
import { submitExam } from "../controllers/ExamResponse.controller.js";

const router = Router();

router.post('/new', createExam);
router.get('/', getAllExams);   
router.get('/:id', getExamById); // Obtener examen por ID
router.post('/submit', submitExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;