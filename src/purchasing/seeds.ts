/**
 * Purchasing seeds
 * Creates demo vendors for the demo company
 */

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  demoRecordId,
  findDemoCompany,
} from "@/companies/demo-company.repository";
import { warehouses } from "@/inventory/db";
import { DEMO_MAIN_WAREHOUSE_CODE } from "@/inventory/demo-warehouse";
import { DEMO_STOCK_SKU } from "@/products/catalog/demo-products";
import { catalogProducts } from "@/products/db";

import { purchaseOrderLines, purchaseOrders, purchasingVendors } from "./db";
import { OrderReceiveRepository } from "./order/[poId]/receive/repository";

interface DemoVendor {
  name: string;
  code: string;
  email: string;
  defaultCurrency: string;
  defaultPaymentTermsDays: number;
  vatNumber?: string;
  phone?: string;
  city?: string;
  country?: string;
}

const DEMO_VENDORS: DemoVendor[] = [
  {
    name: "Acme Supplies",
    code: "ACME",
    email: "orders@acme.example",
    defaultCurrency: "EUR",
    defaultPaymentTermsDays: 30,
    vatNumber: "DE123456789",
    phone: "+49 30 12345678",
    city: "Berlin",
    country: "DE",
  },
  {
    name: "Tech Components GmbH",
    code: "TECH-DE",
    email: "procurement@techcomp.example",
    defaultCurrency: "EUR",
    defaultPaymentTermsDays: 14,
    vatNumber: "DE987654321",
    phone: "+49 89 98765432",
    city: "Munich",
    country: "DE",
  },
  {
    name: "Global Office Supplies",
    code: "GOS-INT",
    email: "orders@globaloffice.example",
    defaultCurrency: "USD",
    defaultPaymentTermsDays: 45,
    phone: "+1 212 555 0100",
    city: "New York",
    country: "US",
  },
];

/**
 * Development seed — creates demo vendors for the demo company
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  const company = await findDemoCompany();
  if (!company) {
    logger.warn("Purchasing demo requires the demo company");
    return;
  }

  for (const vendor of DEMO_VENDORS) {
    // Check if vendor with this code already exists for the company
    const existing = await db
      .select({ id: purchasingVendors.id })
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.companyId, company.id),
          eq(purchasingVendors.code, vendor.code),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      logger.debug(
        `Vendor ${vendor.code} already exists for company ${company.name}`,
      );
      continue;
    }

    await db.insert(purchasingVendors).values({
      companyId: company.id,
      name: vendor.name,
      code: vendor.code,
      email: vendor.email,
      phone: vendor.phone ?? null,
      defaultCurrency: vendor.defaultCurrency,
      defaultPaymentTermsDays: vendor.defaultPaymentTermsDays,
      vatNumber: vendor.vatNumber ?? null,
      city: vendor.city ?? null,
      country: vendor.country ?? null,
      isActive: true,
    });

    logger.debug(`Created vendor: ${vendor.name} (${vendor.code})`);
  }

  const companyId = company.id;
  const [vendor] = await db
    .select({ id: purchasingVendors.id })
    .from(purchasingVendors)
    .where(
      and(
        eq(purchasingVendors.companyId, companyId),
        eq(purchasingVendors.code, "ACME"),
      ),
    )
    .limit(1);
  const [warehouse] = await db
    .select({ id: warehouses.id })
    .from(warehouses)
    .where(
      and(
        eq(warehouses.companyId, companyId),
        eq(warehouses.code, DEMO_MAIN_WAREHOUSE_CODE),
      ),
    )
    .limit(1);
  const [product] = await db
    .select({ id: catalogProducts.id })
    .from(catalogProducts)
    .where(
      and(
        eq(catalogProducts.companyId, companyId),
        eq(catalogProducts.sku, DEMO_STOCK_SKU),
      ),
    )
    .limit(1);
  if (!vendor || !warehouse || !product) {
    return;
  }

  const id = demoRecordId(companyId, "purchase:stands");
  const lineId = demoRecordId(id, "line");
  const receiptId = demoRecordId(id, "receipt");
  const now = new Date();
  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(purchaseOrders)
      .values({
        id,
        companyId,
        vendorId: vendor.id,
        poNumber: "DEMO-PO-001",
        currency: "EUR",
        status: "CONFIRMED",
        confirmedAt: now,
        expectedDeliveryDate: now,
        deliveryWarehouseId: warehouse.id,
        createdByUserId: company.adminId,
        subtotal: 288,
        taxAmount: 54.72,
        total: 342.72,
      })
      .onConflictDoNothing()
      .returning({ id: purchaseOrders.id });
    if (order) {
      await tx.insert(purchaseOrderLines).values({
        id: lineId,
        poId: id,
        productId: product.id,
        description: "Laptop stand, reorder batch",
        quantity: 12,
        unitPrice: 24,
        taxRate: 0.19,
        taxAmount: 54.72,
        lineTotal: 342.72,
      });
    }
  });
  const [order] = await db
    .select({ status: purchaseOrders.status })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id));
  if (order?.status === "CONFIRMED") {
    const receipt = await OrderReceiveRepository.receiveOrder(
      id,
      company.adminId,
      {
        receiptId,
        warehouseId: warehouse.id,
        lines: [{ poLineId: lineId, quantityReceived: 12 }],
        notes: "Demo delivery checked at the main warehouse.",
      },
      logger,
      locale,
    );
    if (!receipt.success) {
      logger.warn("Demo purchase order is ready but receipt was not saved");
    }
  }

  logger.debug("ERP demo purchasing is ready", { companyId });
}

// Priority: after companies (80), before nothing specific
export const priority = 20;
