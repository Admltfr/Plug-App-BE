import ExpressApplication from "./app.js";

const PORT = process.env.PORT || 3000;

const app = new ExpressApplication(PORT);

app.start();
