import Joi from 'joi';


export const trainSchema = Joi.object({
    train_number: Joi.number()
        .integer()
        .required(),
    train_name: Joi.string().min(1).required(),
    source: Joi.string().min(1).required(),
    destination: Joi.string().min(1).required(),
})


