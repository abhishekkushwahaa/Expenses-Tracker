import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, serial, numeric, text, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index("name_idx").on(expenses.userId),
    };
  }
);

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(expenses, {
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a positive number with up to 2 decimal places",
  }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
});

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(expenses);
