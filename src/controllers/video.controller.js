import { Video } from '../model/Video.js';
import { User } from '../model/User.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';



export const createVideo = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer token 
        const decodedToken = jwt.verify(token, SECRET_KEY); // Decodificar token

        const userEmail = decodedToken.email; // Extraer email del token
        const userRole = decodedToken.role; // Extraer role del token
        const user = await User.findOne({ email: userEmail, role: userRole}); // Buscar usuario por email y role

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can upload videos' });
        }

        const { title, description } = req.body; // Extraer datos del body

        const newVideo = new Video({
            title,  // Crear nuevo video
            matricula: user.matricula,  // Asignar matricula del usuario al video
            description,    // Asignar descripción del video
            user: user._id  // Asignar id del usuario al video
        });

        await newVideo.save(); // Guardar video en la base de datos
        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los videos
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('user', 'name email matricula');
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un video por ID
export const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate('user', 'name email matricula');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un video
export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, description } = req.body;

        const video = await Video.findByIdAndUpdate(
            id,
            { title, url, description },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ message: 'Video updated successfully', video });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un video
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
