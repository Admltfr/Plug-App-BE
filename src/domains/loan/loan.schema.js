import Joi from "joi";

const createLoanSchema = Joi.object({
  productId: Joi.string().uuid().required(),
});

const confirmLoanSchema = Joi.object({
  decision: Joi.string().valid("ACCEPT", "REJECT").required(),
});

export { createLoanSchema, confirmLoanSchema };
