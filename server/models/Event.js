const mongoose = require('mongoose')

const eventsSchema = new mongoose.Schema({

    event: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Event = mongoose.model("Event", eventsSchema)

module.exports = Event