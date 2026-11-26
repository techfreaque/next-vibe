import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { posOrders, posPayments, posSessions, posTerminals } from "../db";
import { PosOrderStatus, PosSessionStatus } from "../enum";

type PosTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type OpenOrder = typeof posOrders.$inferSelect & {
  companyId: string;
  cashAccountId: string | null;
  warehouseId: string | null;
  terminalCurrency: string;
};

export async function withOpenOrder<T>(
  orderId: string,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  messages: { notFound: TranslatedKeyType; conflict: TranslatedKeyType },
  operate: (tx: PosTransaction, order: OpenOrder) => Promise<ResponseType<T>>,
  options?: { beforeTender: TranslatedKeyType },
): Promise<ResponseType<T>> {
  const [owner] = await db
    .select({ companyId: posTerminals.companyId })
    .from(posOrders)
    .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
    .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
    .where(eq(posOrders.id, orderId));
  if (!owner) {
    return fail({
      message: messages.notFound,
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }
  const access = await CompanyAuthRepository.requireMember(
    userId,
    owner.companyId,
    CompanyMemberRole.MEMBER,
    logger,
    locale,
  );
  if (!access.success) {
    return access;
  }
  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({
        order: posOrders,
        cashAccountId: posTerminals.cashAccountNodeId,
        warehouseId: posTerminals.warehouseId,
        terminalCurrency: posTerminals.currency,
        sessionStatus: posSessions.status,
      })
      .from(posOrders)
      .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
      .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
      .where(
        and(
          eq(posOrders.id, orderId),
          eq(posTerminals.companyId, owner.companyId),
        ),
      )
      .for("update");
    if (
      !row ||
      row.order.status !== PosOrderStatus.OPEN ||
      row.sessionStatus !== PosSessionStatus.OPEN
    ) {
      return fail({
        message: messages.conflict,
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    if (options?.beforeTender) {
      const [payment] = await tx
        .select({ id: posPayments.id })
        .from(posPayments)
        .where(eq(posPayments.orderId, orderId))
        .limit(1);
      if (payment) {
        return fail({
          message: options.beforeTender,
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
    }
    return operate(tx, {
      ...row.order,
      companyId: owner.companyId,
      cashAccountId: row.cashAccountId,
      warehouseId: row.warehouseId,
      terminalCurrency: row.terminalCurrency,
    });
  });
}
