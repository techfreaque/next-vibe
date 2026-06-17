/**
 * Inventory Transfer List Repository
 */

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { warehouses, warehouseTransfers } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { InventoryTransferListGetRequestOutput } from "./definition";

interface TransferRow {
  id: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: string;
  reference: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

async function buildTransferRows(
  rows: {
    id: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    status: string;
    reference: string | null;
    createdAt: Date;
    completedAt: Date | null;
  }[],
): Promise<TransferRow[]> {
  if (rows.length === 0) {
    return [];
  }

  // Collect all unique warehouse IDs and fetch names in one query
  const warehouseIds = [
    ...new Set([
      ...rows.map((r) => r.fromWarehouseId),
      ...rows.map((r) => r.toWarehouseId),
    ]),
  ];

  const warehouseRows = await db
    .select({ id: warehouses.id, name: warehouses.name })
    .from(warehouses)
    .where(inArray(warehouses.id, warehouseIds));

  const warehouseMap = new Map(warehouseRows.map((w) => [w.id, w.name]));

  return rows.map((row) => ({
    id: row.id,
    fromWarehouseId: row.fromWarehouseId,
    fromWarehouseName:
      warehouseMap.get(row.fromWarehouseId) ?? row.fromWarehouseId,
    toWarehouseId: row.toWarehouseId,
    toWarehouseName: warehouseMap.get(row.toWarehouseId) ?? row.toWarehouseId,
    status: row.status,
    reference: row.reference,
    createdAt: row.createdAt,
    completedAt: row.completedAt ?? null,
  }));
}

export class InventoryTransferListRepository {
  static async listTransfers(
    data: InventoryTransferListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      transfers: TransferRow[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (!data.companyId) {
        // Return transfers for all companies the user is a member of
        const memberRows = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );

        const companyIds = memberRows.map((r) => r.companyId);
        if (companyIds.length === 0) {
          return success({ transfers: [] });
        }

        const rows = await db
          .select({
            id: warehouseTransfers.id,
            fromWarehouseId: warehouseTransfers.fromWarehouseId,
            toWarehouseId: warehouseTransfers.toWarehouseId,
            status: warehouseTransfers.status,
            reference: warehouseTransfers.reference,
            createdAt: warehouseTransfers.createdAt,
            completedAt: warehouseTransfers.completedAt,
          })
          .from(warehouseTransfers)
          .where(inArray(warehouseTransfers.companyId, companyIds))
          .orderBy(warehouseTransfers.createdAt);

        return success({ transfers: await buildTransferRows(rows) });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const rows = await db
        .select({
          id: warehouseTransfers.id,
          fromWarehouseId: warehouseTransfers.fromWarehouseId,
          toWarehouseId: warehouseTransfers.toWarehouseId,
          status: warehouseTransfers.status,
          reference: warehouseTransfers.reference,
          createdAt: warehouseTransfers.createdAt,
          completedAt: warehouseTransfers.completedAt,
        })
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.companyId, data.companyId))
        .orderBy(warehouseTransfers.createdAt);

      return success({ transfers: await buildTransferRows(rows) });
    } catch (error) {
      logger.error("Error listing transfers", parseError(error));
      return fail({
        message: t("transferList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
