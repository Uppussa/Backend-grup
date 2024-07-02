import {Router} from 'express';
import { getAll, create, login } from "../controllers/user.controller.js";
import  {verifyToken} from '../middlewares/jwt.middlewares.js';

const router = Router();

router.get('/', verifyToken, getAll)
router.post('/new', create)
router.post('/login', login)

export default router;