import Joi from 'joi';

export const messageSchema = Joi.object({
    meeting_id: Joi.string().uuid().required(),
    content: Joi.string().min(1).required(),
    message_type: Joi.string().valid('text', 'file', 'image').default('text')
});