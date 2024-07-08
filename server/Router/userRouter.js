import express from 'express'
import { logoutUser, userLogin, userSignUp } from '../Controller/userController.js'


const user_router = express.Router()

user_router.post('/register',userSignUp)
user_router.post('/login',userLogin)
user_router.get('/logout',logoutUser)



export default user_router