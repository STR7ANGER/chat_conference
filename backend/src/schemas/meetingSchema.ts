import Joi from 'joi';

export const createMeetingSchema = Joi.object({
    topic: Joi.string().min(3).max(255).required(),
    scheduled_date: Joi.date().min('now').required(),
    participant_emails: Joi.array().items(Joi.string().email()).min(1).required()
});
