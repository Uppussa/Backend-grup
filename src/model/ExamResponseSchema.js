import mongoose from "mongoose";
import { Schema, model } from "mongoose";



const ExamResponseSchema = new Schema({
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matricula:{
        type: String,
        required: false
    },
    answers: [{
        question: String,
        selectedOption: String
    }],
    score: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

export const ExamResponse = model('ExamResponse', ExamResponseSchema);