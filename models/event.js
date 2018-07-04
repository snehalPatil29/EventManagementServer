const mongoose = require('mongoose');
const Joi = require('joi');

const Events = mongoose.model('Events', new mongoose.Schema({
    eventName : {
        type : String,
        required : true
    },
    venue : String,
    description : String,
    startDate : Date,
    endDate : Date
}));

function validateEvent(event) {
    const schema = {
        eventName : Joi.string().required(),
        venue : Joi.string(),
        description : Joi.string(),
        startDate : Joi.date(), 
        endDate : Joi.date(), 
    };
    return Joi.validate(event, schema);
}
exports.Events = Events;
exports.validateEvent = validateEvent;
