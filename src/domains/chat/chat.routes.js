import ChatController from "./chat.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { ensureRoomSchema, sendMessageSchema } from "./chat.schema.js";
import upload from "../../utils/image.util.js";

class ChatRoutes extends BaseRoutes {
  constructor() {
    super(ChatController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.post(
      "/room",
      this.auth.authenticate,
      this.validate(ensureRoomSchema),
      this.errCatch(this.controller.ensureRoom.bind(this.controller)),
    );

    this.router.get(
      "/messages/:roomId",
      this.auth.authenticate,
      this.errCatch(this.controller.getMessages.bind(this.controller)),
    );

    this.router.post(
      "/upload",
      this.auth.authenticate,
      upload.single("image"),
      this.errCatch(this.controller.uploadImage.bind(this.controller)),
    );

    this.router.post(
      "/message",
      this.auth.authenticate,
      this.validate(sendMessageSchema),
      this.errCatch(this.controller.sendMessage.bind(this.controller)),
    );
  }
}

export default new ChatRoutes().router;
