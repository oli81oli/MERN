const jwt = require('jsonwebtoken')


module.exports = function (req, res, next) {

    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no valido' })
    }

    try {
        const encoded = jwt.verify(token, process.env.SECRET)
        req.user = encoded.user
        next()

    } catch (error) {
        res.status(401).json({ msg: 'Token no valido' })
    }
}