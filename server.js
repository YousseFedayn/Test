const express       = require('express')
const mongoose      = require('mongoose')
const morgan        = require('morgan')
const bodyParser    = require('body-parser')

const dotenv        = require('dotenv')
dotenv.config()

const AuthRoute     = require('./routes/auth')
const UserRoute     = require('./routes/user')

mongoose.set("strictQuery", false)
mongoose.connect('mongodb://127.0.0.1:27017/usersdb', {useUnifiedTopology: true})
const db = mongoose.connection

db.once('open', () => {
    console.log('DB Connection Established!')
})

db.on('error', (err) => {
    console.log(err)
})

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use('/', AuthRoute)
app.use('/users', UserRoute)