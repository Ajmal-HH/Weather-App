import express from 'express'
import authenticate from '../middleware/authenticate.js'
import { addFavoriteCity, getFavoriteCity, removeFavCity } from '../Controller/weatherController.js'

const weather_router = express.Router()

weather_router.post('/addfavorites',authenticate,addFavoriteCity)
weather_router.get('/favorites',authenticate,getFavoriteCity)
weather_router.post('/removefavorites',authenticate,removeFavCity)




export default weather_router  