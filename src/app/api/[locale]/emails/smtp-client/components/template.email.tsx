import { Body, Container, Html, Preview, Section } from "@react-email/components";
import type { JSX, ReactNode } from "react";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { EmailImage } from "./email-image.email";
import { TrackedLink } from "./tracked_link.email";
import { TrackedPixel } from "./tracked_pixel.email";
import type { TrackingContext } from "./tracking_context.email";

interface EmailTemplateProps {
  title: string;
  previewText: string;
  children: ReactNode;
  t: TFunction;
  locale: CountryLanguage;
  tracking: TrackingContext;
  recipientEmail: string;
}

export function EmailTemplate({
  title,
  previewText,
  children,
  t,
  locale,
  tracking,
  recipientEmail,
}: EmailTemplateProps): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang={locale.split("-")[0]}>
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: "0",
          padding: "0",
        }}
      >
        <Container
          style={{
            padding: "0",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {/* Header with logo and app name */}
          <Section
            style={{
              backgroundColor: "#f8fafc", // Light gray-blue background
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              padding: "32px 24px",
              textAlign: "left",
              backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              borderBottom: "3px solid #3b82f6",
            }}
          >
            {/* Logo section - left aligned like nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              <EmailImage
                src="/images/unbottled-icon.png"
                alt={t("config.appName")}
                width="28"
                height="28"
                recipientEmail={recipientEmail}
                style={{
                  display: "block",
                }}
              />
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  margin: "0",
                  color: "#111827",
                  lineHeight: "1",
                  letterSpacing: "-0.025em",
                  whiteSpace: "nowrap",
                }}
              >
                {t("config.appName")}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {/* Tagline - below logo, left aligned */}
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#64748b", // Muted blue-gray for tagline
                  textAlign: "left",
                  fontStyle: "italic",
                  margin: "0",
                }}
              >
                {t("app.api.emails.template.tagline")}
              </div>
            </div>
          </Section>

          {/* Main content section */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "32px 24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              borderLeft: "1px solid #e5e7eb",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              {title}
            </div>

            {/* Decorative line under title */}
            <div
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#3b82f6",
                margin: "0 auto 24px",
                borderRadius: "2px",
              }}
            />

            {/* Main content */}
            <div
              style={{
                padding: "8px 0",
              }}
            >
              {children}
            </div>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f8fafc", // Light gray footer
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              padding: "24px",
              textAlign: "center",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            {/* Social media links and website button */}
            <div style={{ marginBottom: "20px" }}>
              <TrackedLink
                href={envClient.NEXT_PUBLIC_APP_URL}
                tracking={tracking}
                style={{
                  color: "#1e40af",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  display: "inline-block",
                }}
              >
                {t("app.api.emails.footer.visitWebsite")}
              </TrackedLink>
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textAlign: "center",
                margin: "0 0 8px 0",
              }}
            >
              {t("app.api.emails.footer.allRightsReserved", {
                currentYear,
                appName: t("config.appName"),
              })}
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textAlign: "center",
                margin: "8px 0 0 0",
              }}
            >
              {t("app.api.emails.smtpClient.components.email.footer.needHelp")}{" "}
              <TrackedLink
                href={`mailto:${contactClientRepository.getSupportEmail(locale)}`}
                tracking={tracking}
                style={{ color: "#2563eb" }}
              >
                {contactClientRepository.getSupportEmail(locale)}
              </TrackedLink>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                margin: "16px 0 0 0",
              }}
            >
              {t("app.api.emails.smtpClient.components.email.footer.copyright", {
                currentYear,
                appName: t("config.appName"),
              })}
            </div>
          </Section>
        </Container>

        {/* Tracking pixel at the end of email */}
        <TrackedPixel tracking={tracking} />
      </Body>
    </Html>
  );
}
