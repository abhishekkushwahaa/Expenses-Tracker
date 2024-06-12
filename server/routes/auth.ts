import { Hono } from "hono";
import { kindeClient, sessionManager, getUser } from "../kinde";
const { URL } = require("url");

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    try {
      const fullUrl = `${c.req.url}`;
      const url = new URL(fullUrl);
      await kindeClient.handleRedirectToApp(sessionManager(c), url);
      return c.redirect("/");
    } catch (error) {
      return c.json({ error: (error as Error).message });
    }
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user;
    return c.json({ user });
  });
