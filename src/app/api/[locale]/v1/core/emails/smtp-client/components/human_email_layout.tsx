/**
 * Enhanced Human Email Layout with Built-in Tracking
 * Replaces the original HumanEmailLayout
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { TrackedLink } from "./tracked_link";
import { TrackedPixel } from "./tracked_pixel";
import type { TrackingContext } from "./tracking_context";

/**
 * Enhanced Human Email Layout Props
 */
interface HumanEmailLayoutProps {
  previewText: string;
  children: ReactNode;
  locale: CountryLanguage;
  companyName: string;
  companyEmail: string;
  unsubscribeUrl: string;
  t: TFunction;
  tracking: TrackingContext;
}

export function HumanEmailLayout({
  previewText,
  children,
  locale,
  companyName,
  companyEmail,
  unsubscribeUrl,
  t,
  tracking,
}: HumanEmailLayoutProps): JSX.Element {
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
          {/* Main content with minimal styling */}
          <Section
            style={{
              padding: "40px 20px",
              backgroundColor: "#ffffff",
            }}
          >
            {children}
          </Section>

          {/* Human-like footer with logo and company info */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "30px 20px",
              backgroundColor: "#f9fafb",
              textAlign: "center",
            }}
          >
            {/* Logo section */}
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: "0",
                    background: "linear-gradient(to right, #06b6d4, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: "1",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {t("common.logoPart1")}
                </Text>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: "0",
                    background: "linear-gradient(to right, #06b6d4, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: "1",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {t("common.logoPart2")}
                </Text>
              </div>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                  fontStyle: "italic",
                }}
              >
                {t("email.template.tagline")}
              </Text>
            </div>

            {/* Contact info */}
            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 8px 0",
              }}
            >
              {t("emailJourneys.components.footer.helpText")}{" "}
              <TrackedLink
                href={`mailto:${companyEmail}`}
                tracking={tracking}
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                }}
              >
                {companyEmail}
              </TrackedLink>
            </Text>

            {/* Unsubscribe */}
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0",
              }}
            >
              {t("emailJourneys.components.footer.unsubscribeText")}{" "}
              <TrackedLink
                href={unsubscribeUrl}
                tracking={tracking}
                style={{
                  color: "#6b7280",
                  textDecoration: "underline",
                }}
              >
                {t("emailJourneys.components.footer.unsubscribeLink")}
              </TrackedLink>
            </Text>

            {/* Copyright */}
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "8px 0 0 0",
              }}
            >
              {t("emailJourneys.components.footer.copyright", {
                currentYear: new Date().getFullYear(),
                companyName,
              })}
            </Text>
          </Section>
        </Container>
        <TrackedPixel tracking={tracking} />
      </Body>
    </Html>
  );
}
