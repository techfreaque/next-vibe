/**
 * Campaign Email Layout
 * Minimal layout for lead outreach campaigns.
 * No branding header — looks like a plain personal email.
 * Footer contains only the legally required unsubscribe link and a plain copyright.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { TrackedLink } from "./tracked_link.email";
import { TrackedPixel } from "./tracked_pixel.email";
import type { TrackingContext } from "./tracking_context.email";

interface CampaignEmailLayoutProps {
  previewText: string;
  children: ReactNode;
  locale: CountryLanguage;
  unsubscribeUrl: string;
  t: TFunction;
  tracking: TrackingContext;
}

export function CampaignEmailLayout({
  previewText,
  children,
  locale,
  unsubscribeUrl,
  t,
  tracking,
}: CampaignEmailLayoutProps): JSX.Element {
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

          {/* Minimal legal footer — unsubscribe only */}
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
              {t(
                "app.api.leads.campaigns.emails.journeys.emailJourneys.components.footer.unsubscribeText",
              )}{" "}
              <TrackedLink
                href={unsubscribeUrl}
                tracking={tracking}
                style={{
                  color: "#6b7280",
                  textDecoration: "underline",
                }}
              >
                {t(
                  "app.api.leads.campaigns.emails.journeys.emailJourneys.components.footer.unsubscribeLink",
                )}
              </TrackedLink>
            </div>
          </Section>
        </Container>
        <TrackedPixel tracking={tracking} />
      </Body>
    </Html>
  );
}
