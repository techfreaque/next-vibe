/**
 * Uncensored-model consent repository.
 *
 * Accounts store the consent on `users`, guests on `leads`. A guest's consent
 * moves to the account when the lead is linked on signup/login
 * (carryLeadConsentToUser). The gates (chat stream, image generation, /v1)
 * call {@link UncensoredConsentRepository.gate}.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ContentLevelValue } from "../../skills/enum";
import {
  isConsentCurrent,
  isUncensoredContent,
  UNCENSORED_CONSENT_VERSION,
} from "./constants";
import type { UncensoredConsentStatus } from "./definition";
import { scopedTranslation, type UncensoredConsentT } from "./i18n";

interface StoredConsent {
  uncensoredConsentAt: Date | null;
  uncensoredConsentVersion: number | null;
}

/** Where this caller's consent lives: the account, else the guest's lead. */
type ConsentOwner =
  | { kind: "user"; id: string }
  | { kind: "lead"; id: string }
  | { kind: "none" };

function ownerOf(user: JwtPayloadType): ConsentOwner {
  if (!user.isPublic && user.id) {
    return { kind: "user", id: user.id };
  }
  if (user.leadId) {
    return { kind: "lead", id: user.leadId };
  }
  return { kind: "none" };
}

function toStatus(row: StoredConsent | undefined): UncensoredConsentStatus {
  const consentedAt = row?.uncensoredConsentAt ?? null;
  const version = row?.uncensoredConsentVersion ?? null;
  return {
    consented: isConsentCurrent(consentedAt, version),
    consentedAt,
    version,
  };
}

export class UncensoredConsentRepository {
  private static async readStored(
    owner: ConsentOwner,
  ): Promise<StoredConsent | undefined> {
    if (owner.kind === "user") {
      const [row] = await db
        .select({
          uncensoredConsentAt: users.uncensoredConsentAt,
          uncensoredConsentVersion: users.uncensoredConsentVersion,
        })
        .from(users)
        .where(eq(users.id, owner.id))
        .limit(1);
      return row;
    }
    if (owner.kind === "lead") {
      const [row] = await db
        .select({
          uncensoredConsentAt: leads.uncensoredConsentAt,
          uncensoredConsentVersion: leads.uncensoredConsentVersion,
        })
        .from(leads)
        .where(eq(leads.id, owner.id))
        .limit(1);
      return row;
    }
    return undefined;
  }

  private static async writeStored(
    owner: ConsentOwner,
    value: StoredConsent,
  ): Promise<boolean> {
    if (owner.kind === "user") {
      const updated = await db
        .update(users)
        .set({ ...value, updatedAt: new Date() })
        .where(eq(users.id, owner.id))
        .returning({ id: users.id });
      return updated.length > 0;
    }
    if (owner.kind === "lead") {
      const updated = await db
        .update(leads)
        .set({ ...value, updatedAt: new Date() })
        .where(eq(leads.id, owner.id))
        .returning({ id: leads.id });
      return updated.length > 0;
    }
    return false;
  }

  /** GET: consent status of the caller (account or guest). */
  static async getStatus(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: UncensoredConsentT,
  ): Promise<ResponseType<UncensoredConsentStatus>> {
    try {
      return success(
        toStatus(await UncensoredConsentRepository.readStored(ownerOf(user))),
      );
    } catch (error) {
      logger.error("Failed to read uncensored consent", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /** POST: record the confirmation (current consent text version). */
  static async agree(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: UncensoredConsentT,
  ): Promise<ResponseType<UncensoredConsentStatus>> {
    const owner = ownerOf(user);
    if (owner.kind === "none") {
      return fail({
        message: t("errors.noIdentity"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    try {
      const value: StoredConsent = {
        uncensoredConsentAt: new Date(),
        uncensoredConsentVersion: UNCENSORED_CONSENT_VERSION,
      };
      const saved = await UncensoredConsentRepository.writeStored(owner, value);
      if (!saved) {
        return fail({
          message: t("errors.noIdentity"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      logger.info("Uncensored consent given", {
        owner: owner.kind,
        id: owner.id,
        version: UNCENSORED_CONSENT_VERSION,
      });
      return success(toStatus(value));
    } catch (error) {
      logger.error("Failed to save uncensored consent", parseError(error));
      return fail({
        message: t("errors.saveFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /** DELETE: withdraw the confirmation. */
  static async withdraw(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: UncensoredConsentT,
  ): Promise<ResponseType<UncensoredConsentStatus>> {
    const owner = ownerOf(user);
    if (owner.kind === "none") {
      return fail({
        message: t("errors.noIdentity"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    try {
      const value: StoredConsent = {
        uncensoredConsentAt: null,
        uncensoredConsentVersion: null,
      };
      await UncensoredConsentRepository.writeStored(owner, value);
      logger.info("Uncensored consent withdrawn", {
        owner: owner.kind,
        id: owner.id,
      });
      return success(toStatus(value));
    } catch (error) {
      logger.error("Failed to withdraw uncensored consent", parseError(error));
      return fail({
        message: t("errors.saveFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Server gate for running a model. Passes for every non-uncensored model;
   * an uncensored one needs the caller's current consent. Refuses with
   * CONSENT_REQUIRED (clients open the consent dialog on it) and a message
   * that tells CLI / MCP / AI callers exactly how a human confirms.
   */
  static async gate(params: {
    content: typeof ContentLevelValue | undefined;
    modelName: string;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    /** "api" = /v1 key callers: point at the API keys page, not the chat. */
    surface?: "chat" | "api";
  }): Promise<ResponseType<void>> {
    const { content, modelName, user, locale, logger, surface } = params;
    if (!isUncensoredContent(content)) {
      return success();
    }
    const { t } = scopedTranslation.scopedT(locale);
    let stored: StoredConsent | undefined;
    try {
      stored = await UncensoredConsentRepository.readStored(ownerOf(user));
    } catch (error) {
      logger.error(
        "Uncensored consent lookup failed - refusing the model",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
    if (toStatus(stored).consented) {
      return success();
    }
    logger.debug("Uncensored model refused: no consent", {
      model: modelName,
      isPublic: user.isPublic,
      storedVersion: stored?.uncensoredConsentVersion ?? null,
    });
    return fail({
      message: t(surface === "api" ? "gate.apiRequired" : "gate.required", {
        model: modelName,
      }),
      errorType: ErrorResponseTypes.CONSENT_REQUIRED,
      expected: true,
    });
  }

  /**
   * Signup/login: a guest who already confirmed keeps it on the account.
   * Never overwrites an account's own (newer) consent. Best-effort.
   */
  static async carryLeadConsentToUser(
    leadId: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const lead = await UncensoredConsentRepository.readStored({
        kind: "lead",
        id: leadId,
      });
      if (
        !lead ||
        !isConsentCurrent(
          lead.uncensoredConsentAt,
          lead.uncensoredConsentVersion,
        )
      ) {
        return;
      }
      const account = await UncensoredConsentRepository.readStored({
        kind: "user",
        id: userId,
      });
      if (
        account &&
        isConsentCurrent(
          account.uncensoredConsentAt,
          account.uncensoredConsentVersion,
        )
      ) {
        return;
      }
      await UncensoredConsentRepository.writeStored(
        { kind: "user", id: userId },
        lead,
      );
      logger.debug("Carried guest uncensored consent to account", {
        leadId,
        userId,
      });
    } catch (error) {
      logger.error(
        "Failed to carry uncensored consent to account",
        parseError(error),
        { leadId, userId },
      );
    }
  }
}
