import { connectDB } from "./config/db.js";
import express from 'express'
import { PORT } from "./config/config.js";
import  userRoutes  from "./routes/user.routes.js";
import { validaCORS } from "./middlewares/middlewares.js";



const app = express()
app.use(validaCORS)
app.use(express.json()) // Para que pueda recibir datos en formato JSON
app.use(express.urlencoded({ extended: true }))   // Para que pueda recibir datos de formularios

connectDB(); 


app.use('/users', userRoutes)



app.listen(PORT, () => { console.log(`Server on port http://localhost:${PORT} `)})
