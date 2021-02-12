const express = require('express')
const User = require('../models/User')
const Event = require('../models/Event')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router()
const auth = require("../middleware/authorization");
require('dotenv').config()

router.post("/register", (req, res) => {

    const { username, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const user = new User({ username, password: hash })
    user.save()
    .then(user => res.status(200).send(user._id))
    .catch(err => res.status(400).send(err))
  })
  
router.post("/sign-in", (req, res) => {
const { username, password } = req.body
console.log(username)
console.log(password)
User.findOne({ username })
    .then((user) => {
    if (!user) res.status(404).send("User doesn't exist")
    bcrypt.compare(password, user.password, (err, result)=> {
        if (err) res.status(400).send(err)
        if (!result) res.status(401).send("Unknown password")
        else{
            const event = new Event({ event: "sign-in", user})
            event.save()
            const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET/**, {expiresIn: '1m'}**/)
            res.send({ accessToken })
         }
        })
    })
})

router.post('/sign-out',[auth], (req, res) => {
    const user  = req.user
    const event = new Event({ event: "sign-out", user})
    event.save()
            .then(user => res.status(200).end())
            .catch(err => res.status(500).send(err))
})

module.exports = router