import Joi from "joi";

const subscriptionCreateSchema = Joi.object({
  product_id: Joi.string().uuid().required(),
  customer_id: Joi.string().uuid().required(),
  store_id: Joi.string().uuid().required(),
  warehouse_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  frequency_days: Joi.number().integer().min(1).max(31).required(),
});

export { subscriptionCreateSchema };
