import { connectDB } from "./config/db.js";
import express from 'express'
import { PORT } from "./config/config.js";
import  userRoutes  from "./routes/user.routes.js";
import  videosRoutes  from "./routes/videos.routes.js";
import  examsRoutes  from "./routes/exams.routes.js";
import { validaCORS } from "./middlewares/middlewares.js";



const app = express() // Crear una instancia de express
app.use(validaCORS)     // Middleware para validar CORS
app.use(express.json()) // Para que pueda recibir datos en formato JSON
app.use(express.urlencoded({ extended: true }))   // Para que pueda recibir datos de formularios

connectDB();  // Conectar a la base de datos


app.use('/users', userRoutes) // Rutas de usuarios
app.use('/videos', videosRoutes) // Rutas de videos
app.use('/exams', examsRoutes) // Rutas de exámenes


app.listen(PORT, () => { console.log(`Server on port http://localhost:${PORT} `)})
