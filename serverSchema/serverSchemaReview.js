import Joi from "joi";

const reviewSchema = Joi.object({
  listingComment: Joi.string(),
  listingRating: Joi.number().min(1).max(5),
  listingID: Joi.string().required(),
});

export default reviewSchema;
