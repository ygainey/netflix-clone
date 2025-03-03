import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authroutes from './routes/auth.route.js'
import movieroutes from './routes/movie.route.js'
import tvroutes from './routes/tv.route.js'
import searchroutes from './routes/search.route.js'
import { protectRoute } from './middleware/protectRoute.js'

import { ENV_VARS } from './config/envVars.js'
import { connectDB } from './config/db.js'

const app = express()
const PORT = ENV_VARS.PORT

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:5173/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authroutes)
app.use('/api/v1/movie', protectRoute, movieroutes)
app.use('/api/v1/tv', protectRoute, tvroutes)
app.use('/api/v1/search', protectRoute, searchroutes)

app.listen(PORT, ()=>{
    console.log('Server stated on port ' + PORT)
    connectDB();    
})
