import {Exam} from '../model/Exams.js';
import {User} from '../model/User.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js ';


export const createExam = async (req, res) => { // Crear un examen // solo el maestro puede crear un examen
    try {
        // const token = req.headers.authorization.split(' ')[1]; // Obtener token del header
        // const decodedToken = jwt.verify(token, SECRET_KEY); // Verificar token

        // const userEmail = decodedToken.email; // Obtener email del token
        // const userRole = decodedToken.role; // Obtener rol del token
        // const user = await User.findOne({ email: userEmail, role: userRole }); // Buscar usuario por email

        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // if (user.role !== 'teacher') {
        //     return res.status(403).json({ message: 'Only teachers can create exams' });
        // }
 
        const { title, description, nivel, questions,  duration } = req.body; // Obtener datos del cuerpo de la solicitud
        
        if (!title || !description || !nivel || !questions  || !duration || !Array.isArray(questions) || questions.length === 0) { // Validar campos
            return res.status(400).json({ message: 'All fields are required and questions must be a non-empty array' }); // Enviar respuesta de error
        }
        const newExam = new Exam({ // Crear un nuevo examen
            title,  // Asignar título
            description,    // Asignar descripción
            nivel,  // Asignar nivel
            questions, // Asignar preguntas
            createdBy: req.user ? req.user._id : null,
            duration, // Asignar dur
        });

        await newExam.save();
        res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('createdBy', 'name'); // Obtener todos los exámenes y mostrar solo el nombre del creador
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExamById = async (req, res) => { // Obtener un examen por ID    // el maestro no puede manejar esta pocion
    try {
        const exam = await Exam.findById(req.params.id).populate('createdBy', 'name'); // Buscar examen por ID y mostrar solo el nombre del creador
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateExam = async (req, res) => { // Actualizar un examen // solo el maestro puede actualizar un examen
    const { title, description, nivel, questions } = req.body; // Obtener datos del cuerpo de la solicitud

    try {
        const exam = await Exam.findById(req.params.id);    // Buscar examen por ID
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Validaciones adicionales
        if (nivel && !['Elementary', 'A1', 'A2', 'B1', 'B2'].includes(nivel)) { // Validar nivel
            return res.status(400).json({ message: 'Invalid nivel' });
        }

        if (questions) {
            if (!Array.isArray(questions) || questions.length === 0) { // Validar preguntas
                return res.status(400).json({ message: 'Questions must be a non-empty array' });
            }
            // Verificar que cada pregunta tiene la estructura correcta
            const isValid = questions.every(q =>  // Validar preguntas
                q.question && Array.isArray(q.options) && q.options.length > 0 && q.correctOption 
            );
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid question structure' });
            }
        }

        // Actualizar los campos si se proporcionan en la solicitud
        if (title) exam.title = title;  // Actualizar título
        if (description) exam.description = description; // Actualizar descripción
        if (nivel) exam.nivel = nivel; // Actualizar nivel
        if (questions) exam.questions = questions; // Actualizar preguntas

        // Guardar los cambios
        await exam.save();

        res.status(200).json({ message: 'Exam updated successfully', exam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExam = async (req, res) => { // Eliminar un examen // solo el maestro puede eliminar un examen
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id); // Buscar examen por ID y eliminarlo
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

