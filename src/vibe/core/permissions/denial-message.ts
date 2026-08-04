/**
 * Wording for permission denials.
 *
 * `core/permissions/registry.ts` is locale-free on purpose: it decides *whether*
 * access is denied and reports the cause as a code plus the raw runtime values a
 * sentence would need. This module is the other half — it holds the locale and
 * turns that code into text. Every caller that renders a denial goes through
 * here, so the sentence is written once and translated once.
 *
 * Key selection is code-driven: the cause picks the key, params carry only raw
 * values (`platform`, `userId`, role labels). No English prose is ever passed as
 * a parameter, which is why the "has no roles" and "public caller" variants are
 * separate keys rather than a `{{userRoles}}` filled with a translated noun.
 */

import { scopedTranslation as userRolesScopedTranslation } from "../../identity/roles/i18n";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation } from "../i18n/shared";
import type { ErrorResponseType } from "../route/response.schema";
import { ErrorResponseTypes, fail } from "../route/response.schema";
import type { EndpointAccessDenial, PlatformDenialReason } from "./types";

const PLATFORM_DENIAL_KEYS = {
  productionDisabled:
    "shared.permissions.errors.platformAccessDenied.productionDisabled",
  platformExcluded:
    "shared.permissions.errors.platformAccessDenied.platformExcluded",
  cliPackageAuthRequired:
    "shared.permissions.errors.platformAccessDenied.cliPackageAuthRequired",
  mcpNotListed: "shared.permissions.errors.platformAccessDenied.mcpNotListed",
} as const satisfies Record<PlatformDenialReason, string>;

/**
 * Render a denial from `permissionsRegistry.validateEndpointAccess` as a
 * localized error response.
 */
export function resolveEndpointAccessDenial(
  denial: EndpointAccessDenial,
  locale: CountryLanguage,
): ErrorResponseType {
  const { t } = scopedTranslation.scopedT(locale);

  if (denial.cause === "allowedRolesMissing") {
    return fail({
      message: t("shared.permissions.errors.allowedRolesMissing"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  if (denial.cause === "platformDenied") {
    return fail({
      message: t(PLATFORM_DENIAL_KEYS[denial.reason], {
        platform: String(denial.platform),
      }),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }

  const { t: tRoles } = userRolesScopedTranslation.scopedT(locale);
  const requiredRoles = denial.requiredRoles
    .map((role) => tRoles(role))
    .join(", ");
  const userRoles = denial.userRoles.map((role) => tRoles(role)).join(", ");

  if (denial.userId === null) {
    return fail({
      message: userRoles
        ? t("shared.permissions.errors.insufficientRolesPublic", {
            requiredRoles,
            userRoles,
          })
        : t("shared.permissions.errors.insufficientRolesPublicNoRoles", {
            requiredRoles,
          }),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }

  return fail({
    message: userRoles
      ? t("shared.permissions.errors.insufficientRoles", {
          userId: denial.userId,
          requiredRoles,
          userRoles,
        })
      : t("shared.permissions.errors.insufficientRolesNoRoles", {
          userId: denial.userId,
          requiredRoles,
        }),
    errorType: ErrorResponseTypes.FORBIDDEN,
  });
}

/**
 * Denial reason as a plain code, for logs and telemetry. Never user-facing —
 * anything a person reads goes through {@link resolveEndpointAccessDenial}.
 */
export function endpointAccessDenialCode(denial: EndpointAccessDenial): string {
  return denial.cause === "platformDenied"
    ? `${denial.cause}:${denial.reason}`
    : denial.cause;
}
