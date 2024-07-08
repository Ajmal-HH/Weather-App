import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import user_router from './Router/userRouter.js'
import weather_router from './Router/weatherRouter.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true
}))
app.use(express.json())

const PORT = process.env.PORT || 5001
const JWT_SECRET = process.env.JWT_SECRET

//userRouter
app.use('/',user_router)
//weatherRouter
app.use('/weather',weather_router)

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))