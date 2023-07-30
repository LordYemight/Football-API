const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

module.exports = createUserSchema;