import { connectDB } from "./config/db.js";
import express from 'express'
import { PORT } from "./config/config.js";
import  userRoutes  from "./routes/user.routes.js";


const app = express()
app.use(express.json())
connectDB(); 


app.use('/users', userRoutes)



app.listen(PORT, () => { console.log(`Server on port http://localhost:${PORT} `)})
