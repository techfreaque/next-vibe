/**
 * Campaign Email Layout
 * Minimal layout for lead outreach campaigns.
 * No branding header - looks like a plain personal email.
 * Footer contains the legally required unsubscribe link and sender identification
 * (operator, postal address, contact, imprint link) as German/EU rules expect for
 * marketing mail. Identity comes from the same config the imprint page renders.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX, ReactNode } from "react";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";

import { scopedTranslation } from "../i18n";
import { TrackedLink } from "./tracked_link.email";
import { TrackedPixel } from "./tracked_pixel.email";
import type { TrackingContext } from "./tracking_context.email";

interface CampaignEmailLayoutProps {
  previewText: string;
  children: ReactNode;
  locale: CountryLanguage;
  unsubscribeUrl: string;
  tracking: TrackingContext;
}

export function CampaignEmailLayout({
  previewText,
  children,
  locale,
  unsubscribeUrl,
  tracking,
}: CampaignEmailLayoutProps): JSX.Element {
  const { t: st } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const supportEmail = contactClientRepository.getSupportEmail(locale);
  // Relative: TrackedLink resolves it against the campaign baseUrl.
  const imprintUrl = `/${locale}/story/imprint`;
  const linkStyle = { color: "#9ca3af", textDecoration: "underline" };
  return (
    <Html lang={locale.split("-")[0]}>
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: "0",
          padding: "20px",
          lineHeight: "1.6",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "0",
          }}
        >
          {/* Email body */}
          <Section
            style={{
              padding: "40px 20px",
              backgroundColor: "#ffffff",
            }}
          >
            {children}
          </Section>

          {/* Legal footer - unsubscribe + sender identification (imprint) */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              {st("components.email.footer.unsubscribeText")}{" "}
              <TrackedLink
                href={unsubscribeUrl}
                tracking={tracking}
                style={{
                  color: "#6b7280",
                  textDecoration: "underline",
                }}
              >
                {st("components.email.footer.unsubscribeLink")}
              </TrackedLink>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "12px",
              }}
            >
              {st("components.email.footer.legalOperator", {
                companyName: configT("group.name"),
                owner: configT("group.responsiblePerson.name"),
                address: configT("group.address.addressIn1Line"),
              })}
              <br />
              {st("components.email.footer.legalContact")}:{" "}
              <TrackedLink
                href={`mailto:${supportEmail}`}
                tracking={tracking}
                style={linkStyle}
              >
                {supportEmail}
              </TrackedLink>
              {st("components.email.footer.footerSeparator")}
              <TrackedLink
                href={imprintUrl}
                tracking={tracking}
                style={linkStyle}
              >
                {st("components.email.footer.legalNotice")}
              </TrackedLink>
            </div>
          </Section>
        </Container>
        <TrackedPixel tracking={tracking} />
      </Body>
    </Html>
  );
}
