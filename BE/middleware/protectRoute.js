import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ENV_VARS } from '../config/envVars.js'

export async function protectRoute(req, res, next) {
    try {
        const token = req.cookies['jwt-netflix']

        if (!token) {
            return res.status(401).json({ sucess: false, message: 'unauthorized - no token provided' })
        }

        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ sucess: false, message: 'unauthorized - invalid token' })
        }

        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({ sucess: false, message: 'unauthorized - user not found' })
        }

        req.user = user

        next()
    } catch (error) {
        console.log('error in middleware', error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}