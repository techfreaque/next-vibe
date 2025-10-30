import type { Config } from "drizzle-kit";

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const DATABASE_URL = process?.env?.["DATABASE_URL"];

if (!DATABASE_URL) {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Configuration file needs to throw for missing environment variables
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
