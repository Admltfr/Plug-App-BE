import ChatService from "./chat.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class ChatController extends BaseController {
  constructor() {
    super(ChatService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = ChatService
  }

  async ensureRoom(req, res) {
    const { otherId, productId } = req.body;
    const data = await this.service.ensureRoom(req.user, otherId, productId);
    return this.response.success(res, data, "Room ensured");
  }

  async getMessages(req, res) {
    const { roomId } = req.params;
    const { cursor, take = 20 } = req.query;
    const data = await this.service.getMessages(req.user, roomId, {
      cursor,
      take: Number(take),
    });
    return this.response.success(res, data, "Messages fetched");
  }

  async uploadImage(req, res) {
    if (!req.file) return this.response.badRequest(res, "No image uploaded");
    const url = `/images/${req.file.filename}`;
    return this.response.success(res, { imageUrl: url }, "Image uploaded");
  }

  async sendMessage(req, res) {
    const { roomId, content, imageUrl } = req.body;
    const msg = await this.service.sendMessage(req.user, roomId, {
      content,
      imageUrl,
    });
    return this.response.success(res, { message: msg }, "Message sent");
  }
}

export default new ChatController();
