import mongoose from "mongoose";
import { MONGO_URL} from './config.js'
export const connectDB = async () => {
try {
    await mongoose.connect(MONGO_URL); 
    console.log('Conectado!')
} catch (error) {
    console.log('Error en la conexion', error);
}
}