const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./database/db')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// security package
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

// routes and errormiddleware route
const auth = require('./routes/auth')
const branches = require('./routes/branche')
const manager = require('./routes/manager')
const customer = require('./routes/customer')
const complaint = require('./routes/complaint')
const errorHandler = require('./middleware/error')

// load env
dotenv.config({path: './config/config.env'})

// connect Database
connectDB()

const app = express()

app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 15 * 16 * 1000,
    max: 100
}))

// express body-parser
app.use(express.json())

// security
app.use(helmet())
app.use(cors())
app.use(xss())


// public folder
app.use(express.static(path.join(__dirname, 'public')))


// cookies
app.use(cookieParser())
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('NODE JS BACKEND ASSESSMENT')
})

// route
app.use('/api/v1/auth', auth)
app.use('/api/v1/branches', branches)
app.use('/api/v1/manager', manager)
app.use('/api/v1/customer', customer)
app.use('/api/v1/complaint', complaint)
app.use(errorHandler)

// middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// port
const PORT = process.env.PORT || 5000

// server
const server = app.listen(PORT, () => {
    console.log(`Server listening on port:${process.env.PORT}`.yellow);
})

// UnhandledPromiseRejectionWarning
process.on('unhandledRejection', (err, promise) => {
    console.error(err.message.red);
    server.close(() => process.exit(1))
})