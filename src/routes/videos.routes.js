import { Router } from "express";
import { createVideo, getVideoById, getVideos, deleteVideo, updateVideo } from "../controllers/video.controller.js";

const router = Router();

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/new', createVideo);
router.put('/update/:id', updateVideo);
router.delete('/delete/:id', deleteVideo);

export default router;