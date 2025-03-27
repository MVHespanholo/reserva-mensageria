const Joi = require('joi');

module.exports = {
  getReservations: Joi.object({
    uuid: Joi.string().optional(),
    customer_id: Joi.number().integer().optional(),
    room_id: Joi.number().integer().optional()
  })
};