import authRoutes from "./domains/auth/auth.routes.js";
import productRoutes from "./domains/product/product.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  { path: "/product", route: productRoutes },
];

export default routes;
