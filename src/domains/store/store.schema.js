import Joi from "joi";

const storeSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  contact_name: Joi.string().required(),
  contact_phone_number: Joi.string().required(),
  address: Joi.string().required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export { storeSchema };
