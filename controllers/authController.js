const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body


    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' })
        }

        const passCorrect = await bcryptjs.compare(password, user.password)
        if (!passCorrect) {
            return res.status(400).json({ msg: 'El password es incorrecto' })
        }


        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error

            res.json({ token })
        })

    } catch (error) {
        console.log(error)
    }

}


exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json('Hubo un error')
    }
}