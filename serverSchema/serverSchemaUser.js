import Joi from "joi";

const userSchema = Joi.object({
  userEmail: Joi.string().trim().email().required(),
  userPassword: Joi.string().min(5).required(),
  userName: Joi.string().trim().min(2).required(),
});

export default userSchema;
