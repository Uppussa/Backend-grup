import { Router } from "express";
import { createVideo, getVideoById, getVideos, deleteVideo, updateVideo } from "../controllers/video.controller.js";
import {upload} from '../config/multer.js';

const router = Router();

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/new', upload.single('videos'), createVideo);
router.put('/update/:id', upload.single('videos'), updateVideo);
router.delete('/delete/:id', deleteVideo);

export default router;