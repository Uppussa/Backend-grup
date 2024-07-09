import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const ExamSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        enum: ['Elementary', 'A1', 'A2', 'B1', 'B2'],
        required: true
    },
    questions: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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

    date: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        default: null
    },
    duration: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

export const Exam = model('Exam', ExamSchema);
