import Joi from 'joi';


export const trainSchema = Joi.object({
    train_number: Joi.string()
        .required(),
    train_name: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
    source_departure_time: Joi.string().required(),
    journey_duration: Joi.string().required(),
    sleeper_ticket_fare: Joi.number().required(),
    ac_ticket_fare: Joi.number().required(),    
})


export const bookTicketInstanceSchema = Joi.object({
    ticket_fare: Joi.number()
        .required(),
    journey_date: Joi.date().required(),
    train_number: Joi.string().required(),
    transaction_number: Joi.string().required(),
    type: Joi.string().required(),
    passengers: Joi.array().required(),
    booking_type: Joi.number().required(),
})

export const coachesSchema = Joi.object({
    name: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
})

export const cancelTicketSchema = Joi.object({
    pnr_number: Joi.string().required(),
    seats: Joi.array().required(),
})




export const trainInstanceSchema = Joi.object({
    train_number: Joi.string().required(),
    journey_date: Joi.date().required(),
    booking_start_time: Date,
    booking_end_time: Joi.date().required(),
    number_of_ac_coaches: Joi.number().required(),
    number_of_sleeper_coaches: Joi.number().required(),
    ac_coach_id: Joi.any().required(),
    sleeper_coach_id: Joi.any().required(),

})
