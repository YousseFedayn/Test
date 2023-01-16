const express   = require('express')
const router    = express.Router()

const UserController    = require('../controllers/UserController')
const authenticate                = require('../middleware/authenticate')

router.get('/', authenticate, UserController.displayAllUsers)

module.exports = router