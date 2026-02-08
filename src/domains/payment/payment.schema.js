import Joi from "joi";

const topupSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const paySchema = Joi.object({
  loanId: Joi.string().uuid().required(),
});

export { topupSchema, paySchema };
