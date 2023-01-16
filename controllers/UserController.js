const { response } = require('express')
const User = require('../models/User')

// Show the list of Users
const displayAllUsers = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

module.exports = {
    displayAllUsers
}