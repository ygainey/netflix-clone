import jwt from 'jsonwebtoken'
import { ENV_VARS } from '../config/envVars.js'

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: '15d'})

    res.cookie('jwt-netflix', token, {
        httpOnly: true, // to prevent XSS attack, not accessible via JS
        maxAge: 15*24*60*60*1000, //in ms 15 days
        sameSite: 'strict', // to prevent CSRF attack
        //secure: ENV_VARS.NODE_ENV !== 'development' //    
    })

    return token
}
