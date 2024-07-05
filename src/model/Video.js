import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    matricula: {
        type: String,
        required: true,
        
    },
    videos: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Video = model('Video', VideoSchema);