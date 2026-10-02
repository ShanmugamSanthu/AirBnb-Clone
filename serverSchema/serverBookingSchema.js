import Joi from "joi";

const bookingGetSchema = Joi.object({
  checkInDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required(),

  checkOutDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required(),
});

const bookingPostSchema = Joi.object({
  checkInDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required(),

  checkOutDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required(),
  numberOfGuests: Joi.number().integer().min(1).required(),
});

export { bookingGetSchema, bookingPostSchema };
