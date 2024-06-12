import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
  return c.json({ message: "Hello from Hono Test!" });
});

const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoute)
  .route("/", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
