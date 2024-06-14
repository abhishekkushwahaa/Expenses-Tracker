import { insertUserSchema } from "./db/schema/expenses";

export const createExpenseSchema = insertUserSchema.omit({
  userId: true,
  createdAt: true,
});
