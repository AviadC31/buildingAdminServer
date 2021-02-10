const mongoose = require('mongoose')

const tenantsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true},
    address: { type: String, required: true },
    financialDebt: { type: Number, default: false}
})
const Tenant = mongoose.model("Tenant", tenantsSchema)

module.exports = Tenant