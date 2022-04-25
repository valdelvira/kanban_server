const expres = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const router = expres.Router()
const saltRounds = 10
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password || name === '' || email === '' || password === '') {
            return res.status(400).json({ msg: 'Please enter all fields' })
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Provide a valid email address.' })
            return
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hash
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req, res, next) => {
    try {
        console.log(req.body)
        const { email, password } = req.body

        if (!email || !password || email === '' || password === '') {
            return res.status(400).json({ msg: 'Please enter all fields' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' })
        } else {

            const token = jwt.sign(
                {
                    id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    algorithm: process.env.JWT_ALGORITHM
                }
            )
            const { _id, name, email } = user
            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email
                }
            })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/verify', isAuthenticated, async (req, res, next) => {
    res.status(200).json(req.payload)
})



module.exports = router