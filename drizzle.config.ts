import type { Config } from "drizzle-kit";

// Directly use process.env without validation for drizzle-kit
// This avoids circular dependencies with env validation
// eslint-disable-next-line node/no-process-env
const DATABASE_URL = process.env["DATABASE_URL"];

if (!DATABASE_URL) {
  // eslint-disable-next-line no-restricted-syntax
  throw new Error("DATABASE_URL environment variable is required");
}

export default {
  schema: ["./src/**/db.ts", "./src/**/*.db.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",

    table: "__drizzle_migrations__",
    schema: "drizzle",
  },

  breakpoints: true,
  strict: true,
  verbose: true,
} satisfies Config;
