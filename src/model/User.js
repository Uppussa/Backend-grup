import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose); // Crear instancia de AutoIncrement

const UserSchema = new Schema({
    name: {
        type: String,   // Tipo cadena de texto (String)
        required: true   // Campo requerido
    },
    email: {
        type: String,   // Tipo cadena de texto (String)
        required: true,     // Campo requerido
        unique: true    // Campo único
    },
    password: {
        type: String,  // Tipo cadena de texto (String)
        required: true // Campo requerido
    },
    role: {
        type: String,   // Tipo cadena de texto (String)
        enum: ['teacher', 'student'],   // Enumeración
        required: true // Campo requerido
    },
    profileImage: {
        type: String,   // Tipo cadena de texto (String)
        default: ""
    },
    videos: [{
        type: Schema.Types.ObjectId, // Tipo de dato ObjectID de MongoDB
        ref: 'Video' // Referencia al modelo Video        
    }],
    date: {
        type: Date,  // Tipo fecha
        default: Date.now   // Fecha actual por defecto al crear    
    },
    nivel: {
        type: String,   // Tipo cadena de texto (String)
        enum: ['Elementary', 'A1', 'A2', 'B1', 'B2'],   // Enumeración
        required: true  // Campo requerido
    },
    matricula: {
        type: Number,   // Tipo número
        unique: true,   // No se pueden repetir matrículas
        sparse: true  // Permite valores nulos (o undefined) si no hay estudiantes con matrícula
        
    }
});

// Configuración de autoincremento solo para estudiantes
UserSchema.plugin(AutoIncrement, { inc_field: 'matricula', start_seq: 1000 }); // Iniciar en 1000

export const User = model('User', UserSchema); // Crear modelo User con el esquema UserSchema
