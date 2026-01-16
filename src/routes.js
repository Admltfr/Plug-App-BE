import authRoutes from "./domains/auth/auth.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

export default routes;
