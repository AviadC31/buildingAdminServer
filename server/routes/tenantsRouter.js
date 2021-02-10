const express = require('express')
const Tenant = require('../models/Tenant')
const router = express.Router()
const auth = require("../middleware/authorization");
require('dotenv').config()

router.get('/tenants', [auth] ,(req, res) => {
    Tenant.find({})
            .then(tenants =>{
                tenants.length > 0 ?
                    res.status(200).send(tenants)
                    : res.status(404).send("Not Found")
            })
            .catch(err => res.status(404).end(err))
})

router.post('/tenant', (req, res) => {
    const tenant = new Tenant(req.body)
    console.log(tenant)
    tenant.save()
            .then(tenant => res.status(200).send(tenant))
            .catch(err => res.status(500).send(err))
})

router.put('/tenant/:id', (req, res) => {
    const { id } = req.params 
    const { field, value } = req.body
    Tenant.findByIdAndUpdate(id, {"$set": {[`${field}`]: value}})
        .then(tenant => res.status(200).send("Changed Successfully"))
        .catch(err => res.status(400).send(err))
})

router.delete('/tenant/:phone', function (req, res) {
    const { phone } = req.params 
    Tenant.findOneAndDelete({ phone })
            .then(tenant => res.status(200).send("tenant id "+tenant._id+", has removed successfully"))
            .catch(err => res.status(400).send(err))
})
module.exports = router