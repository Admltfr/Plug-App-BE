import BaseService from "../../common/base_classes/base-service.js";
import Roles from "../../common/enums/user-roles.enum.js";

class ChatService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async ensureRoom(user, otherId, productId) {
    if (!otherId) throw this.error.badRequest("otherId is required");
    if (!productId) throw this.error.badRequest("productId is required");

    let customerId, sellerId;
    if (user.role === Roles.Customer) {
      customerId = user.id;
      sellerId = otherId;
    } else if (user.role === Roles.Seller) {
      customerId = otherId;
      sellerId = user.id;
    } else {
      throw this.error.forbidden("Invalid role");
    }

    let room = await this.db.chatRoom.findFirst({
      where: {
        customer_id: customerId,
        seller_id: sellerId,
        product_id: productId,
      },
    });
    if (!room) {
      room = await this.db.chatRoom.create({
        data: {
          customer_id: customerId,
          seller_id: sellerId,
          product_id: productId,
        },
      });
    }
    return room;
  }

  async assertMembership(user, roomId) {
    const room = await this.db.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw this.error.notFound("Room not found");
    const isMember =
      (user.role === Roles.Customer && room.customer_id === user.id) ||
      (user.role === Roles.Seller && room.seller_id === user.id);
    if (!isMember) throw this.error.forbidden("Not a room participant");
    return room;
  }

  async getMessages(user, roomId, { cursor, take = 20 }) {
    await this.assertMembership(user, roomId);
    const messages = await this.db.chatMessage.findMany({
      where: { room_id: roomId },
      orderBy: { created_at: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    return { messages };
  }

  async sendMessage(user, roomId, { content, imageUrl }) {
    const room = await this.assertMembership(user, roomId);
    if (!content && !imageUrl) {
      throw this.error.badRequest("content or imageUrl is required");
    }

    const loan = await this.db.loan.findFirst({
      where: {
        product_id: room.product_id,
        borrower_id: room.customer_id,
        lender_id: room.seller_id,
      },
      orderBy: { created_at: "desc" },
    });
    if (loan && loan.status === "COMPLETED") {
      throw this.error.badRequest("Chat is disabled for completed loan");
    }

    const sender = user.role === Roles.Customer ? "CUSTOMER" : "SELLER";
    const msg = await this.db.chatMessage.create({
      data: {
        room_id: room.id,
        sender,
        content: content || null,
        image_url: imageUrl || null,
      },
    });
    return msg;
  }
}

export default new ChatService();
