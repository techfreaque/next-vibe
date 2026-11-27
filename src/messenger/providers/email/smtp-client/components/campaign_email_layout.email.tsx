/**
 * Campaign Email Layout
 * Minimal layout for lead outreach campaigns.
 * No branding header - looks like a plain personal email.
 * Footer contains the legally required unsubscribe link and sender identification
 * (operator, postal address, contact, imprint link) as German/EU rules expect for
 * marketing mail. Identity comes from the same config the imprint page renders.
 */

import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX, ReactNode } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { EmailLogo } from "./email-image.email";
import { EmailLegalIdentity, EmailOptOutLine } from "./legal_identity.email";
import { TrackedPixel } from "./tracked_pixel.email";
import type { TrackingContext } from "./tracking_context.email";

interface CampaignEmailLayoutProps {
  previewText: string;
  children: ReactNode;
  locale: CountryLanguage;
  /** null = no opt-out link (transactional mail, e.g. billing notices). */
  unsubscribeUrl: string | null;
  tracking: TrackingContext;
  /** Replaces the default "Don't want to receive these emails?" line. */
  footerText?: string;
  /** Replaces the default "Unsubscribe" link label. */
  footerLinkText?: string;
}

export function CampaignEmailLayout({
  previewText,
  children,
  locale,
  unsubscribeUrl,
  tracking,
  footerText,
  footerLinkText,
}: CampaignEmailLayoutProps): JSX.Element {
  const { t: configT } = configScopedTranslation.scopedT(locale);
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
            <div style={{ display: "inline-block", marginBottom: "8px" }}>
              <EmailLogo alt={configT("appName")} />
            </div>
            <EmailOptOutLine
              locale={locale}
              tracking={tracking}
              unsubscribeUrl={unsubscribeUrl}
              text={footerText}
              linkText={footerLinkText}
            />
            <EmailLegalIdentity locale={locale} tracking={tracking} />
          </Section>
        </Container>
        <TrackedPixel />
      </Body>
    </Html>
  );
}
