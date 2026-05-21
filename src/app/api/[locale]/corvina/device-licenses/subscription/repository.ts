import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { corvinaDeviceSubscriptions } from "../db";
import type { DeviceSubscriptionT } from "./i18n";
import type {
  DeviceSubscriptionGetRequestOutput,
  DeviceSubscriptionGetResponseOutput,
  DeviceSubscriptionPostRequestOutput,
  DeviceSubscriptionPostResponseOutput,
  SubscriptionStatusType,
} from "./definition";

const TRIAL_DAYS = 30;
const EXPIRING_SOON_DAYS = 30;

export function computeSubscriptionStatus(
  effectiveStartDate: Date | null,
  effectiveEndDate: Date | null,
  hasRecord: boolean,
  hasPaidSubscription = false,
): { status: SubscriptionStatusType; daysUntilExpiry: number | null } {
  if (!hasRecord || !effectiveStartDate || !effectiveEndDate) {
    return { status: "no_subscription", daysUntilExpiry: null };
  }
  const now = new Date();
  const msUntilExpiry = effectiveEndDate.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(msUntilExpiry / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 0) {
    return { status: "expired", daysUntilExpiry };
  }
  if (!hasPaidSubscription) {
    return { status: "trial", daysUntilExpiry };
  }
  if (daysUntilExpiry <= EXPIRING_SOON_DAYS) {
    return { status: "expiring_soon", daysUntilExpiry };
  }
  return { status: "active", daysUntilExpiry };
}

export function computeEffectiveDates(
  trialStartDate: Date | null,
  subscriptionEndDate: Date | null,
  activationDate?: Date | null,
): { effectiveStartDate: Date | null; effectiveEndDate: Date | null } {
  const effectiveStartDate = trialStartDate ?? activationDate ?? null;
  if (!effectiveStartDate) {
    return { effectiveStartDate: null, effectiveEndDate: null };
  }
  if (subscriptionEndDate) {
    return { effectiveStartDate, effectiveEndDate: subscriptionEndDate };
  }
  const effectiveEndDate = new Date(effectiveStartDate);
  effectiveEndDate.setDate(effectiveEndDate.getDate() + TRIAL_DAYS);
  return { effectiveStartDate, effectiveEndDate };
}

export class DeviceSubscriptionRepository {
  static async get(
    data: DeviceSubscriptionGetRequestOutput,
    logger: EndpointLogger,
    t: DeviceSubscriptionT,
  ): Promise<ResponseType<DeviceSubscriptionGetResponseOutput>> {
    try {
      const [row] = await db
        .select()
        .from(corvinaDeviceSubscriptions)
        .where(eq(corvinaDeviceSubscriptions.logicalId, data.logicalId))
        .limit(1);

      const { effectiveStartDate, effectiveEndDate } = computeEffectiveDates(
        row?.trialStartDate ?? null,
        row?.subscriptionEndDate ?? null,
      );
      const { status, daysUntilExpiry } = computeSubscriptionStatus(
        effectiveStartDate,
        effectiveEndDate,
        !!row,
        row?.subscriptionEndDate !== null &&
          row?.subscriptionEndDate !== undefined,
      );

      return success({
        logicalIdOut: data.logicalId,
        orgResourceId: row?.orgResourceId ?? null,
        clientEmail: row?.clientEmail ?? null,
        trialStartDate: row?.trialStartDate ?? null,
        subscriptionEndDate: row?.subscriptionEndDate ?? null,
        effectiveStartDate,
        effectiveEndDate,
        status,
        daysUntilExpiry,
      });
    } catch (error) {
      logger.error(
        "DeviceSubscriptionRepository.get failed",
        parseError(error),
      );
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async upsert(
    data: DeviceSubscriptionPostRequestOutput,
    logger: EndpointLogger,
    t: DeviceSubscriptionT,
  ): Promise<ResponseType<DeviceSubscriptionPostResponseOutput>> {
    try {
      const [existing] = await db
        .select()
        .from(corvinaDeviceSubscriptions)
        .where(eq(corvinaDeviceSubscriptions.logicalId, data.logicalId))
        .limit(1);

      const newEndDate =
        data.subscriptionEndDate instanceof Date
          ? data.subscriptionEndDate
          : data.subscriptionEndDate !== undefined
            ? new Date(data.subscriptionEndDate)
            : undefined;

      const newStartDate =
        data.trialStartDate instanceof Date
          ? data.trialStartDate
          : data.trialStartDate !== undefined
            ? new Date(data.trialStartDate)
            : undefined;

      // Clear reminder if dates changed so the next cron fires a fresh reminder
      const endDateChanged =
        newEndDate !== undefined &&
        existing?.subscriptionEndDate?.toISOString() !==
          newEndDate.toISOString();
      const startDateChanged =
        newStartDate !== undefined &&
        existing?.trialStartDate?.toISOString() !== newStartDate.toISOString();
      const resetReminder = endDateChanged || startDateChanged;

      if (existing) {
        await db
          .update(corvinaDeviceSubscriptions)
          .set({
            orgResourceId: data.orgResourceId ?? existing.orgResourceId,
            clientEmail:
              data.clientEmail !== undefined
                ? data.clientEmail
                : existing.clientEmail,
            trialStartDate: newStartDate ?? existing.trialStartDate,
            subscriptionEndDate: newEndDate ?? existing.subscriptionEndDate,
            reminderSentAt: resetReminder ? null : existing.reminderSentAt,
            reminderCycleKey: resetReminder ? null : existing.reminderCycleKey,
            updatedAt: new Date(),
          })
          .where(eq(corvinaDeviceSubscriptions.logicalId, data.logicalId));
      } else {
        await db.insert(corvinaDeviceSubscriptions).values({
          logicalId: data.logicalId,
          orgResourceId: data.orgResourceId ?? "",
          clientEmail: data.clientEmail,
          trialStartDate: newStartDate,
          subscriptionEndDate: newEndDate,
        });
      }

      logger.info("DeviceSubscriptionRepository.upsert succeeded", {
        logicalId: data.logicalId,
      });

      return success({
        logicalId: data.logicalId,
        orgResourceId: data.orgResourceId,
        clientEmail: data.clientEmail,
        trialStartDate: newStartDate ?? existing?.trialStartDate ?? undefined,
        subscriptionEndDate:
          newEndDate ?? existing?.subscriptionEndDate ?? undefined,
      });
    } catch (error) {
      logger.error(
        "DeviceSubscriptionRepository.upsert failed",
        parseError(error),
      );
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
