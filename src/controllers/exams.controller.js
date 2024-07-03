import {Exam} from '../model/Exams.js';
import {User} from '../model/User.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js ';


export const createExam = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Obtener token del header
        const decodedToken = jwt.verify(token, SECRET_KEY); // Verificar token

        const userEmail = decodedToken.email; // Obtener email del token
        const userRole = decodedToken.role; // Obtener rol del token
        const user = await User.findOne({ email: userEmail, role: userRole }); // Buscar usuario por email

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can create exams' });
        }

        const { title, description, level, questions } = req.body;

        const newExam = new Exam({
            title,
            description,
            level,
            questions,
            createdBy: user._id, // Asociar el ID del creador del examen
        });

        await newExam.save();
        res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// // Otros controladores

// export const getAllExams = async (req, res) => {
//     try {
//         const exams = await Exam.find().populate('createdBy', 'name');
//         res.status(200).json(exams);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getExamById = async (req, res) => {
//     try {
//         const exam = await Exam.findById(req.params.id).populate('createdBy', 'name');
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found' });
//         }
//         res.status(200).json(exam);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateExam = async (req, res) => {
//     const { questions } = req.body;

//     try {
//         const exam = await Exam.findById(req.params.id);
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found' });
//         }

//         exam.questions = questions;
//         await exam.save();
//         res.status(200).json({ message: 'Exam updated successfully', exam });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const submitExam = async (req, res) => {
//     const { answers } = req.body;
//     const studentId = req.user.id;

//     try {
//         const exam = await Exam.findById(req.params.id);
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found' });
//         }

//         // Calculate grade
//         let grade = 0;
//         answers.forEach((answer, index) => {
//             if (answer === exam.questions[index].correctOption) {
//                 grade += 1;
//             }
//         });

//         const gradeEntry = {
//             student: studentId,
//             grade
//         };

//         exam.grades.push(gradeEntry);
//         await exam.save();

//         res.status(200).json({ message: 'Exam submitted successfully', grade });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// export const deleteExam = async (req, res) => {
//     try {
//         const exam = await Exam.findByIdAndDelete(req.params.id);
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found' });
//         }
//         res.status(200).json({ message: 'Exam deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// {
//     //     "title": "Examen de Matemáticas",
//     //     "description": "Este es un examen de prueba",
//     //     "level": "intermedio",
//     //     "questions": [
//     //       {
//     //         "question": "¿Cuánto es 2 + 2?",
//     //         "options": ["3", "4", "5"],
//     //         "correctOption": 4
//     //       }
//     //     ]
//     //   }