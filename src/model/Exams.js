import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const ExamSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctOption: { type: String, required: true }
        }
    ],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false // Asegúrate de que no sea requerido
    },
    assignedTo: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    grades: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            grade: { type: Number }
        }
    ]
}, { 
    timestamps: true 
});

export const Exam = model('Exam', ExamSchema);
