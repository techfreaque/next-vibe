import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { LoggerMetadata } from "next-vibe/logger/types";

import { DEMO_COMPANY_NAME } from "../../companies/demo-company";
import { catalogProducts, productCategories } from "../db";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("next-vibe/database", () => ({ db }));

const olderUser = "00000000-0000-4000-8000-000000000001";
const demoOwner = "00000000-0000-4000-8000-000000000002";
const demoCompany = "00000000-0000-4000-8000-000000000003";
const otherCompany = "00000000-0000-4000-8000-000000000004";

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (id uuid PRIMARY KEY, email text, created_at timestamp);
    CREATE TABLE companies (id uuid PRIMARY KEY, name text, owner_user_id uuid REFERENCES users(id), created_at timestamp);
    CREATE TABLE company_members (company_id uuid REFERENCES companies(id), user_id uuid REFERENCES users(id), is_active boolean);
    CREATE TABLE product_categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid REFERENCES companies(id),
      owner_user_id uuid REFERENCES users(id), name text, parent_id uuid, sort_order integer,
      is_active boolean, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE catalog_products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid REFERENCES companies(id),
      owner_user_id uuid REFERENCES users(id), category_id uuid REFERENCES product_categories(id),
      name text, type text, description text, sku text, unit text, base_price numeric,
      currency text, default_tax_rate numeric, is_active boolean, image_url text,
      is_subscription boolean, billing_interval text, created_at timestamp, updated_at timestamp
    );
    INSERT INTO users VALUES ('${olderUser}', 'older@example.com', '2020-01-01'), ('${demoOwner}', 'demo@example.com', '2021-01-01');
    INSERT INTO companies VALUES ('${otherCompany}', 'Other Company', '${demoOwner}', '2020-01-01');
    INSERT INTO product_categories (company_id, owner_user_id, name, is_active)
      VALUES ('${otherCompany}', '${demoOwner}', 'Services', true);
    INSERT INTO catalog_products (company_id, owner_user_id, name, is_active)
      VALUES ('${otherCompany}', '${demoOwner}', 'Consulting Hour', true);
  `);
});

afterAll(async () => {
  await pg.close();
});

test("catalog seed uses only the demo company and its owner on every run", async () => {
  const { dev } = await import("./seeds");
  const warn = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  const logger = { ...createEndpointLogger(false, defaultLocale), warn };

  await dev(logger, defaultLocale);
  expect(warn).toHaveBeenCalledWith(
    "Products catalog seed requires the demo company",
    { companyName: DEMO_COMPANY_NAME },
  );

  await pg.query("INSERT INTO companies VALUES ($1, $2, $3, '2021-01-01')", [
    demoCompany,
    DEMO_COMPANY_NAME,
    demoOwner,
  ]);
  warn.mockClear();
  await dev(logger, defaultLocale);
  await dev(logger, defaultLocale);

  const products = await db
    .select({
      ownerId: catalogProducts.ownerUserId,
      categoryId: productCategories.id,
    })
    .from(catalogProducts)
    .innerJoin(
      productCategories,
      and(
        eq(catalogProducts.categoryId, productCategories.id),
        eq(productCategories.companyId, demoCompany),
      ),
    )
    .where(eq(catalogProducts.companyId, demoCompany));
  expect(products).toHaveLength(3);
  expect(products.map((product) => product.ownerId)).toEqual([
    demoOwner,
    demoOwner,
    demoOwner,
  ]);
  expect(new Set(products.map((product) => product.categoryId)).size).toBe(3);
  expect(
    await db.select({ id: catalogProducts.id }).from(catalogProducts),
  ).toHaveLength(4);
  expect(
    await db.select({ id: productCategories.id }).from(productCategories),
  ).toHaveLength(4);
  expect(warn).not.toHaveBeenCalled();
});
