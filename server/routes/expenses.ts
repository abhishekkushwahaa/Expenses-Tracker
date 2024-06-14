import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";

import { db } from "../db";
import {
  expenses as expenseTable,
  insertUserSchema,
} from "../db/schema/expenses";
import { eq, desc, sum, and } from "drizzle-orm";

import { createExpenseSchema } from "../validation";

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(100);

    return c.json({ expenses: expenses });
  })
  .get("/total", getUser, async (c) => {
    const user = c.var.user;
    const result = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]?.total ?? 0);
    return c.json(result);
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    try {
      const expenses = await c.req.valid("json");
      const user = c.var.user;

      const validatedExpense = insertUserSchema.parse({
        ...expenses,
        userId: user.id,
      });

      const result = await db
        .insert(expenseTable)
        .values(validatedExpense)
        .returning();

      c.status(201);
      return c.json(result);
    } catch (error) {
      console.error("Error handling POST request:", error);
      c.status(500);
      return c.json({ error: "Internal server error" });
    }
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .orderBy(desc(expenseTable.createdAt))
      .then((res) => res[0]);

    if (!expenses) {
      return c.notFound();
    }
    return c.json({ expenses });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expenses = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!expenses) {
      return c.notFound();
    }
    return c.json({ expenses });
  });
