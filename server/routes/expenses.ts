import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUser } from "../kinde";

import { db } from "../db";
import { expenses as expenseTable } from "../db/schema/expenses";
import { eq, desc, sum, and } from "drizzle-orm";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  amount: z.string(),
  title: z.string().min(3).max(255),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

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
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    try {
      const expenses = await c.req.valid("json");
      const user = c.var.user;

      const result = await db
        .insert(expenseTable)
        .values({
          ...expenses,
          userId: user.id,
        })
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
