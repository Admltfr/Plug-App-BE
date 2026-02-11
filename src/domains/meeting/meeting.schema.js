import Joi from "joi";

const proposeLocationSchema = Joi.object({
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  address: Joi.string().min(3).required(),
});

const locationDecisionSchema = Joi.object({
  decision: Joi.string().valid("ACCEPT", "REJECT").required(),
});

const qrGenerateSchema = Joi.object({});
const qrScanSchema = Joi.object({
  token: Joi.string().required(),
});

export {
  proposeLocationSchema,
  locationDecisionSchema,
  qrGenerateSchema,
  qrScanSchema,
};
