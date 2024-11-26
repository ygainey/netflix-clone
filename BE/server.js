import express from 'express'

import authroutes from './routes/auth.route.js'
import movieroutes from './routes/movie.route.js'

import { ENV_VARS } from './config/envVars.js'
import { connectDB } from './config/db.js'

const app = express()
const PORT = ENV_VARS.PORT

app.use(express.json())

app.use('/api/v1/auth', authroutes)
app.use('/api/v1/movie', movieroutes)

app.listen(PORT, ()=>{
    console.log('Server stated')
    connectDB();    
})
