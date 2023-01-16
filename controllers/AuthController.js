const User      = require('../models/User')
const bcrypt      = require('bcryptjs')
const jwt      = require('jsonwebtoken')

// Register function
const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if(err){
            res.json({
                error: err
            })
        }

        let user = new User ({
            email: req.body.email,
            password: hashedPass
        })
        user.save()
        .then(user => {
            res.json({
                message: 'User Added Successfully!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occured!'
            })
        })
    })
}

// Login function
const login = (req, res, next) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({$or: [{email:email}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME})
                    let refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME})
                    res.json({
                        message: 'Login Successfully!',
                        token,
                        refreshToken
                    })
                }else{
                    res.json({
                        message: 'Password does not matched!'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user found!'
            })
        }
    })
}

// Refresh the token after expiry
const refreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, 'refreshTokenSecretValue', function(err, decode) {
        if (err) {
            res.status(400).json({
                err
            })
        } else {
            let token = jwt.sign({email: decode.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME})
            let refreshToken = req.body.refreshToken
            res.status(200).json({
                message: "Token refreshed successfully!",
                token,
                refreshToken
            })
        }
    })
}

module.exports = {
    register, login, refreshToken
}