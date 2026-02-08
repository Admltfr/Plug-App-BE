import { Server } from "socket.io";
import Prisma from "../common/services/prisma.service.js";
import Roles from "../common/enums/user-roles.enum.js";
import { parseJWT } from "./auth.util.js";
import logger from "./logger.util.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use(async (socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    const token =
      socket.handshake.auth?.token ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
    const decoded = token ? parseJWT(token) : null;
    if (!decoded?.id || !decoded?.role) return next(new Error("Unauthorized"));
    socket.data.user = decoded;
    next();
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    socket.on("chat:join", async ({ roomId }) => {
      if (!roomId) return;
      const room = await Prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room) return;
      const isMember =
        (user.role === Roles.Customer && room.customer_id === user.id) ||
        (user.role === Roles.Seller && room.seller_id === user.id);
      if (!isMember) return;
      socket.join(`room:${roomId}`);
    });

    socket.on("chat:send", async ({ roomId, content, imageUrl }) => {
      try {
        const room = await Prisma.chatRoom.findUnique({
          where: { id: roomId },
        });
        if (!room) return;
        const isMember =
          (user.role === Roles.Customer && room.customer_id === user.id) ||
          (user.role === Roles.Seller && room.seller_id === user.id);
        if (!isMember) return;

        const sender = user.role === Roles.Customer ? "CUSTOMER" : "SELLER";
        const msg = await Prisma.chatMessage.create({
          data: {
            room_id: roomId,
            sender,
            content: content || null,
            image_url: imageUrl || null,
          },
        });

        io.to(`room:${roomId}`).emit("chat:new", { message: msg });
      } catch (e) {
        logger.error("Error sending chat message:", e.message);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
