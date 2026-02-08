import ExpressApplication from "./app.js";
import { initSocket } from "./utils/socket.util.js";

const PORT = process.env.PORT || 3000;

const app = new ExpressApplication(PORT);
const server = app.start();
initSocket(server);
