import jwt from 'jsonwebtoken'
import { ENV_VARS } from '../config/envVars.js'

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: '15d'})

    res.cookie('jwt-netflix', token, {
        httpOnly: true,  // Prevents the cookie from being accessed via JavaScript (important for security)
        maxAge: 15 * 24 * 60 * 60 * 1000,  // Cookie expiration in milliseconds (15 days)
        sameSite: 'strict',  // Prevents CSRF attacks by ensuring cookies are not sent cross-origin
        // secure: process.env.NODE_ENV === 'production',  // Uncomment this in production for HTTPS
    })

    return token
}
