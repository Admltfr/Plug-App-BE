import authRoutes from "./domains/auth/auth.routes.js";
import productRoutes from "./domains/product/product.routes.js";
import warehouseRoutes from "./domains/warehouse/warehouse.routes.js";
import storeRoutes from "./domains/store/store.routes.js";
import subscriptionRoutes from "./domains/subscription/subscription.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
  { path: "/warehouse", route: warehouseRoutes },
  { path: "/store", route: storeRoutes },
  { path: "/subscription", route: subscriptionRoutes },
];

export default routes;
