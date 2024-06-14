import type { Config } from "drizzle-kit";
export default {
  dialect: "postgresql",
  schema: "./server/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
    database: process.env.PGDATABASE,
  },
} as Config;
