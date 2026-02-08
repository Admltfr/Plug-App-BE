import authRoutes from "./domains/auth/auth.routes.js";
import productRoutes from "./domains/product/product.routes.js";
import paymentRoutes from "./domains/payment/payment.routes.js";
import chatRoutes from "./domains/chat/chat.routes.js";

const routes = [
  { path: "/auth", route: authRoutes },
  { path: "/product", route: productRoutes },
  { path: "/payment", route: paymentRoutes },
  { path: "/chat", route: chatRoutes },
];

export default routes;
