import authRoutes from "./domains/auth/auth.routes.js";
import productRoutes from "./domains/product/product.routes.js";
import warehouseRoutes from "./domains/warehouse/warehouse.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  { path: "/product", route: productRoutes },
  { path: "/warehouse", route: warehouseRoutes },
];

export default routes;
