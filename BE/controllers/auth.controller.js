import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateToken.js'

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            })
        }

        const existingUserByEmail = await User.findOne({ email: email })

        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            })
        }

        const existingUserByUsername = await User.findOne({ username: username })

        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this username'
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hasedPassword = await bcryptjs.hash(password, salt)

        const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png']

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

        const newUser = new User({
            email: email,
            password: hasedPassword,
            username: username,
            image: image
        })

        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save()
        
        //remove password from response
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: ''
            }
        })

    } catch (error) {
        console.log('signup error:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            })
        }

        const user = await User.findOne({ email: email })
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(404).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: ''
            }
        })
    } catch (error) {
        console.log('login error:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
        
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('jwt-netflix')
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log('logout error:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export async function authCheck(req, res) {
	try {
		console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}