import { Exam } from '../model/Exams.js';
import { ExamResponse } from '../model/ExamResponseSchema.js';
import { User } from '../model/User.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';

export const submitExam = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET_KEY);
        const userEmail = decodedToken.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit exams' });
        }

        const { examId, answers } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        let correctAnswers = 0;
        const totalQuestions = exam.questions.length;

        exam.questions.forEach((question, index) => {
            if (question.correctOption === answers[index].selectedOption) {
                correctAnswers++;
            }
        });

        const score = (correctAnswers / totalQuestions) * 100;

        const examResponse = new ExamResponse({
            exam: examId,
            student: user._id,
            answers: answers,
            score: score,
            matricula: user.matricula
        });

        await examResponse.save();

        res.status(200).json({ 
            message: 'Exam submitted successfully', 
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            matricula: user.matricula,
            student: user._id,   
            name: user.name
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};