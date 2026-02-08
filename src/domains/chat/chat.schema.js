import Joi from "joi";

const ensureRoomSchema = Joi.object({
  otherId: Joi.string().uuid().required(),
  productId: Joi.string().uuid().required(),
});

const sendMessageSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  content: Joi.string().allow("").optional(),
  imageUrl: Joi.string().uri().allow("").optional(),
});

export { ensureRoomSchema, sendMessageSchema };
