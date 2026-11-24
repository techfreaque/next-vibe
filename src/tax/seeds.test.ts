import { once } from "node:events";
import { connect, createServer } from "node:net";

import { PGlite } from "@electric-sql/pglite";
import { expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/node-postgres";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { startPgliteServer } from "next-vibe/database/pglite-server";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { LoggerMetadata } from "next-vibe/logger/types";
import { Pool } from "pg";

test("dev tax seeding recovers when the committed insert loses its reply", async () => {
  const pg = new PGlite();
  const company = "00000000-0000-4000-8000-000000000001";
  await pg.exec(`
    CREATE TABLE companies (id uuid PRIMARY KEY, country text);
    CREATE TABLE tax_rates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id uuid REFERENCES companies(id), name text, code text, type text,
      rate numeric(5, 4), country text, region text, tax_payable_account_id uuid,
      tax_receivable_account_id uuid, is_default boolean, is_active boolean,
      is_compound boolean, created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now(), UNIQUE (company_id, code)
    );
    INSERT INTO companies VALUES ('${company}', 'DE');
    INSERT INTO tax_rates (company_id, name, code, is_active)
      VALUES ('${company}', 'Custom tax rate', 'DE_VAT_19', false);
  `);
  const wire = startPgliteServer(pg, { port: 0 });
  await once(wire, "listening");
  const wireAddress = wire.address();
  if (!wireAddress || typeof wireAddress === "string") {
    wire.close();
    await pg.close();
    return Promise.reject(new Error("Expected a TCP endpoint for PGlite"));
  }

  let droppedInsertReply: Buffer | undefined;
  const proxy = createServer((client) => {
    const upstream = connect(wireAddress.port, "127.0.0.1");
    let waitingOnInsert = false;
    client.on("data", (data: Buffer) => {
      if (!droppedInsertReply && data.includes('insert into "tax_rates"')) {
        waitingOnInsert = true;
      }
      upstream.write(data);
    });
    upstream.on("data", (data: Buffer) => {
      if (waitingOnInsert) {
        droppedInsertReply = data;
        client.destroy();
      } else {
        client.write(data);
      }
    });
    client.once("close", () => upstream.destroy());
    upstream.once("close", () => client.destroy());
    client.once("error", () => upstream.destroy());
    upstream.once("error", () => client.destroy());
  });
  proxy.listen(0, "127.0.0.1");
  await once(proxy, "listening");
  const address = proxy.address();
  const port = address && typeof address !== "string" ? address.port : 0;
  const pool = new Pool({
    host: "127.0.0.1",
    port,
    user: "postgres",
    connectionTimeoutMillis: 1_000,
    query_timeout: 1_000,
  });
  mock.module("next-vibe/database", () => ({
    db: drizzle(pool),
    isPglite: true,
  }));

  try {
    const { dev } = await import("./seeds");
    const error = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
    const logger = { ...createEndpointLogger(false, defaultLocale), error };

    await dev(logger, defaultLocale);
    await Promise.all([dev(logger, defaultLocale), dev(logger, defaultLocale)]);
    expect(droppedInsertReply?.toString()).toContain("INSERT 0 2");
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      "PGlite connection lost while seeding tax rates. Retrying once.",
      expect.objectContaining({ message: "Connection terminated unexpectedly" }),
    );
    const result = await pool.query<{
      code: string;
      name: string;
      is_active: boolean;
    }>("SELECT code, name, is_active FROM tax_rates ORDER BY code");
    expect(result.rows).toEqual([
      { code: "DE_VAT_0", name: "Steuerfrei", is_active: true },
      { code: "DE_VAT_19", name: "Custom tax rate", is_active: false },
      { code: "DE_VAT_7", name: "MwSt 7%", is_active: true },
    ]);
    await pool.query("DROP TABLE tax_rates");
    await expect(dev(logger, defaultLocale)).rejects.toMatchObject({
      cause: { code: "42P01" },
    });
    expect(error).toHaveBeenCalledTimes(1);
  } finally {
    await pool.end();
    proxy.close();
    wire.close();
    await pg.close();
  }
});
