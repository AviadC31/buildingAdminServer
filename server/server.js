const tenantsApi = require('./routes/tenantsRouter')
const usersApi = require('./routes/usersRouter')
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

app.use('/tenants-api/', tenantsApi)
app.use('/users-api/', usersApi)

app.listen(port, () => console.log("server up and running on port " + port))