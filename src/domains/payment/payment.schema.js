import Joi from "joi";

const topupSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const paySchema = Joi.object({
  lenderId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  loanId: Joi.string().uuid().optional(),
});

export { topupSchema, paySchema };
