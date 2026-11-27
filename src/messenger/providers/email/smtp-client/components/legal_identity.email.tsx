/**
 * Sender identification line for optional mail (journeys, campaigns,
 * newsletters): operator, postal address, contact and imprint link, as
 * German/EU rules expect. Identity comes from the same config the imprint
 * page renders. Shared by EmailTemplate and CampaignEmailLayout.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";

import { scopedTranslation } from "../i18n";
import { TrackedLink } from "./tracked_link.email";
import type { TrackingContext } from "./tracking_context.email";

const linkStyle = { color: "#9ca3af", textDecoration: "underline" };

export function EmailLegalIdentity({
  locale,
  tracking,
}: {
  locale: CountryLanguage;
  tracking: TrackingContext;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  // Relative: TrackedLink resolves it against the tracking baseUrl.
  const imprintUrl = `/${locale}/story/imprint`;
  return (
    <div
      style={{
        fontSize: "11px",
        color: "#9ca3af",
        marginTop: "12px",
        lineHeight: "1.6",
      }}
    >
      {t("components.email.footer.legalOperator", {
        companyName: configT("group.name"),
        owner: configT("group.responsiblePerson.name"),
        address: configT("group.address.addressIn1Line"),
      })}
      <br />
      {t("components.email.footer.legalContact")}:{" "}
      <TrackedLink
        href={`mailto:${supportEmail}`}
        tracking={tracking}
        style={linkStyle}
      >
        {supportEmail}
      </TrackedLink>
      {t("components.email.footer.footerSeparator")}
      <TrackedLink href={imprintUrl} tracking={tracking} style={linkStyle}>
        {t("components.email.footer.legalNotice")}
      </TrackedLink>
    </div>
  );
}

/**
 * "Don't want these emails? Unsubscribe" line. `unsubscribeUrl` null = notice
 * only, no opt-out link (billing notices).
 */
export function EmailOptOutLine({
  locale,
  tracking,
  unsubscribeUrl,
  text,
  linkText,
}: {
  locale: CountryLanguage;
  tracking: TrackingContext;
  unsubscribeUrl: string | null;
  /** Replaces the default "Don't want to receive these emails?" line. */
  text?: string;
  /** Replaces the default "Unsubscribe" link label. */
  linkText?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <div style={{ fontSize: "12px", color: "#9ca3af" }}>
      {text ?? t("components.email.footer.unsubscribeText")}
      {unsubscribeUrl !== null && (
        <>
          {" "}
          <TrackedLink
            href={unsubscribeUrl}
            tracking={tracking}
            style={{ color: "#6b7280", textDecoration: "underline" }}
          >
            {linkText ?? t("components.email.footer.unsubscribeLink")}
          </TrackedLink>
        </>
      )}
    </div>
  );
}
