import Joi from 'joi';


export const trainSchema = Joi.object({
    train_number: Joi.number()
        .integer()
        .required(),
    train_name: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
})


export const bookTicketInstanceSchema = Joi.object({
    ticket_fare: Joi.number()
        .required(),
    journey_date: Joi.date().required(),
    train_number: Joi.string().required(),
    transaction_number: Joi.string().required(),
    type: Joi.string().required(),
    passengers: Joi.array().required(),
})

export const coachesSchema = Joi.object({
    name: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),

})


