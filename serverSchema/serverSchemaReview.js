import Joi from "joi";

const reviewSchema = Joi.object({
  listingComment: Joi.string().allow(""),
  listingRating: Joi.number().min(1).max(5).required(),
  listingID: Joi.string().required(),
});

export default reviewSchema;
