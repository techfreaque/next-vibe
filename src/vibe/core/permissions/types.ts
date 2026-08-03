/**
 * The permission-check contract, kept apart from the rules that produce it and
 * from the wording that renders it.
 *
 * Denial causes are CODES, not sentences. `core/permissions/registry.ts` decides
 * whether access is denied and reports the cause plus the raw runtime values a
 * message would need to interpolate; `core/permissions/denial-message.ts` holds
 * the locale and turns that into text. Splitting the contract out keeps the
 * registry free of both i18n and message shape.
 */

import type { UserRoleValue } from "../../identity/roles/enum";
import type { Platform } from "../../platforms/platforms";

/** Why a platform access check said no. */
export type PlatformDenialReason =
  | "productionDisabled"
  | "platformExcluded"
  | "cliPackageAuthRequired"
  | "mcpNotListed";

export interface PlatformAccessResult {
  allowed: boolean;
  reason?: PlatformDenialReason;
  blockedByRole?: UserRoleValue;
}

/**
 * Why an endpoint access check said no: a cause code plus raw values only.
 * Never a sentence, and never English prose — the resolver picks its translation
 * key from `cause`/`reason`, it does not receive a noun to splice in.
 */
export type EndpointAccessDenial =
  | { cause: "allowedRolesMissing" }
  | {
      cause: "platformDenied";
      platform: Platform;
      reason: PlatformDenialReason;
    }
  | {
      cause: "insufficientRoles";
      /** `null` for a public (unauthenticated) caller. */
      userId: string | null;
      requiredRoles: readonly UserRoleValue[];
      userRoles: readonly UserRoleValue[];
    };

export type EndpointAccessResult =
  | { allowed: true }
  | { allowed: false; denial: EndpointAccessDenial };
