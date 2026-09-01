import Joi from "joi";

const listingSchema = Joi.object({
  Title: Joi.string().required(),
  Description: Joi.string().required(),
  Price: Joi.number().min(1).required(),
  Location: Joi.string().required(),
  Country: Joi.string().required(),
  Image: Joi.string().uri().allow(""),
});

export default listingSchema;
