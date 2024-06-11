import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const fakeExpenses: Expense[] = [
  { id: 1, amount: 100, title: "Groceries" },
  { id: 2, amount: 200, title: "Rent" },
  { id: 3, amount: 50, title: "Utilities" },
  { id: 4, amount: 150, title: "Internet" },
  { id: 5, amount: 75, title: "Phone" },
];

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  amount: z.number().int().positive(),
  title: z.string().min(3).max(255),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .get("/total", async (c) => {
    const totalSpent = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expenses = await c.req.valid("json");
    fakeExpenses.push({ ...expenses, id: fakeExpenses.length + 1 });
    return c.json(expenses);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expenses = fakeExpenses.find((expense) => expense.id === id);
    if (!expenses) {
      return c.notFound();
    }
    return c.json({ expenses });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const deleteExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expenses: deleteExpense });
  });
