import Joi from "joi";

const reviewSchema = Joi.object({
  listingComment: Joi.string(),
  listingRating: Joi.number().min(1).max(20),
});

export default reviewSchema;
