import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string().trim().min(2).required(),
  password: Joi.string().min(5).required(),
  userEmail: Joi.string().trim().email().required(),
});

export default userSchema;
