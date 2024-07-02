import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    date: {
        type: Date,
        default: Date.now
    },
    nivel: {
        type: String,
        enum: ['Elementary', 'A1', 'A2', 'B1', 'B2'],
        required: true
    },
    matricula: {
        type: Number,
        unique: true,
        sparse: true  // Permite valores nulos (o undefined) si no hay estudiantes con matrícula
    }
});

// Configuración de autoincremento solo para estudiantes
UserSchema.plugin(AutoIncrement, { inc_field: 'matricula', start_seq: 1000, disable_hooks: true });

export const User = model('User', UserSchema);
