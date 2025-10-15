/**
 * Email Layout Components
 * Reusable components for lead email templates
 */

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as icons from "lucide-react";
import {
  createDataUrl,
  createTransparentPixelDataUrl,
} from "next-vibe/shared/utils";
import type React from "react";
import type { JSX, ReactNode } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { TrackedLink } from "../../../emails/smtp-client/components/tracked_link";
import type { TrackingContext } from "../../../emails/smtp-client/components/tracking_context";

type IconName = keyof typeof icons;

interface EmailLayoutProps {
  previewText: string;
  children: ReactNode;
  locale: CountryLanguage;
}

export function EmailLayout({
  previewText,
  children,
  locale,
}: EmailLayoutProps): React.JSX.Element {
  return (
    <Html lang={locale.split("-")[0]}>
      <Head />
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
          {children}
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Email Header Component
 */
interface EmailHeaderProps {
  backgroundColor?: string;
  t: TFunction;
}

export function EmailHeader({
  backgroundColor = "#f8fafc",
  t,
}: EmailHeaderProps): React.JSX.Element {
  return (
    <Section
      style={{
        backgroundColor,
        padding: "32px 24px",
        textAlign: "left",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        borderBottom: "3px solid #3b82f6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "0",
              background: "linear-gradient(to right, #06b6d4, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "1",
              letterSpacing: "-0.5px",
              textAlign: "left",
            }}
          >
            {t("common.logoPart1")}
          </Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "0",
              background: "linear-gradient(to right, #06b6d4, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "1",
              letterSpacing: "-0.5px",
              textAlign: "left",
            }}
          >
            {t("common.logoPart2")}
          </Text>
        </div>
        <Text
          style={{
            fontSize: "14px",
            color: "#64748b",
            margin: "0",
            fontStyle: "italic",
          }}
        >
          {t("email.template.tagline")}
        </Text>
      </div>
    </Section>
  );
}

/**
 * Email Content Section Component
 */
interface EmailContentProps {
  children: ReactNode;
  backgroundColor?: string;
  padding?: string;
}

export function EmailContent({
  children,
  backgroundColor = "#ffffff",
  padding = "40px 32px",
}: EmailContentProps): React.JSX.Element {
  return (
    <Section
      style={{
        backgroundColor,
        padding,
        borderLeft: "1px solid #e5e7eb",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      {children}
    </Section>
  );
}

/**
 * Email Footer Component
 */
interface EmailFooterProps {
  companyName: string;
  companyEmail: string;
  unsubscribeUrl: string;
  t: TFunction;
  tracking: TrackingContext;
}

export function EmailFooter({
  companyName,
  companyEmail,
  unsubscribeUrl,
  t,
  tracking,
}: EmailFooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <Section
      style={{
        backgroundColor: "#f8fafc",
        padding: "24px 32px",
        textAlign: "center",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        borderTop: "1px solid #e5e7eb",
        border: "1px solid #e5e7eb",
      }}
    >
      <Text
        style={{
          fontSize: "14px",
          color: "#6b7280",
          margin: "0 0 12px 0",
        }}
      >
        {t("emailJourneys.components.footer.copyright", {
          currentYear,
          companyName,
        })}
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: "#9ca3af",
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
    </Section>
  );
}

/**
 * Call-to-Action Button Component
 */
interface CTAButtonProps {
  href: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  tracking: TrackingContext;
}

export function CTAButton({
  href,
  text,
  backgroundColor = "#3b82f6",
  textColor = "#ffffff",
  size = "medium",
  tracking,
}: CTAButtonProps): React.JSX.Element {
  const sizeStyles = {
    small: { padding: "12px 24px", fontSize: "14px" },
    medium: { padding: "16px 32px", fontSize: "16px" },
    large: { padding: "20px 40px", fontSize: "18px" },
  };

  return (
    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <TrackedLink
        href={href}
        tracking={tracking}
        style={{
          backgroundColor,
          color: textColor,
          ...sizeStyles[size],
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          display: "inline-block",
          boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
        }}
      >
        {text}
      </TrackedLink>
    </div>
  );
}

/**
 * Social Proof Box Component
 */
interface SocialProofBoxProps {
  quote: string;
  author: string;
  company: string;
  backgroundColor?: string;
  t: TFunction;
}

export function SocialProofBox({
  quote,
  author,
  company,
  backgroundColor = "#f0f9ff",
  t,
}: SocialProofBoxProps): React.JSX.Element {
  return (
    <Section
      style={{
        backgroundColor,
        padding: "24px",
        margin: "24px 0",
        borderRadius: "8px",
        borderLeft: "4px solid #3b82f6",
      }}
    >
      <Text
        style={{
          fontSize: "16px",
          fontStyle: "italic",
          color: "#374151",
          margin: "0 0 16px 0",
          lineHeight: "1.6",
        }}
      >
        {t("emailJourneys.components.socialProof.quotePrefix")}
        {quote}
        {t("emailJourneys.components.socialProof.quoteSuffix")}
      </Text>
      <Text
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#1f2937",
          margin: "0",
        }}
      >
        {t("emailJourneys.components.socialProof.attribution", {
          author,
          company,
        })}
      </Text>
    </Section>
  );
}

/**
 * Stats Grid Component
 */
interface StatsGridProps {
  stats: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps): React.JSX.Element {
  return (
    <Section
      style={{
        margin: "32px 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          gap: "16px",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: "20px 16px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: stat.color || "#dc2626",
                margin: "0 0 8px 0",
              }}
            >
              {stat.value}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600",
                margin: "0",
              }}
            >
              {stat.label}
            </Text>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Email Image Component
 * Converts remote or local images to inline data URLs for email compatibility
 */
interface EmailImageProps {
  src: string; // URL or path to image (remote URL or local path relative to public directory)
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function EmailImage({
  src,
  alt,
  width,
  height,
  style = {},
}: EmailImageProps): Promise<React.JSX.Element> {
  try {
    // Build the full URL for the image
    const getImageUrl = (imageSrc: string): string => {
      if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
        // Already a full URL
        return imageSrc;
      } else {
        // Local path - construct URL using envClient.NEXT_PUBLIC_APP_URL
        const cleanPath = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
        return `${envClient.NEXT_PUBLIC_APP_URL}${cleanPath}`;
      }
    };

    const imageUrl = getImageUrl(src);

    // // Fetch the image and convert to base64
    // const response = await fetch(imageUrl);
    // if (!response.ok) {
    //   console.error(`Failed to fetch image: ${src}`, {
    //     url: imageUrl,
    //     status: response.status,
    //     statusText: response.statusText,
    //   });
    //   // Return a placeholder transparent pixel
    //   return (
    //     <Img
    //       src={createTransparentPixelDataUrl()}
    //       alt={alt}
    //       width={width}
    //       height={height}
    //       style={{
    //         display: "block",
    //         maxWidth: "100%",
    //         height: "auto",
    //         ...style,
    //       }}
    //     />
    //   );
    // }

    // // Get the image as an array buffer
    // const arrayBuffer = await response.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // // Get content type from response headers
    // const contentType = response.headers.get("content-type") || "image/png";

    // // Convert to base64 data URL
    // const base64Content = buffer.toString("base64");
    // const dataUrl = createDataUrlFromBase64(base64Content, contentType);

    return (
      <Img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          ...style,
        }}
      />
    );
  } catch {
    // Return a placeholder transparent pixel on error
    return (
      <Img
        src={createTransparentPixelDataUrl()}
        alt={alt}
        width={width}
        height={height}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          ...style,
        }}
      />
    );
  }
}

export async function LucideEmailIcon(
  icon: IconName,
  props: { width?: string; height?: string; color?: string; alt: string },
): Promise<JSX.Element> {
  // Convert icon name to kebab-case for the URL
  // Handle both PascalCase (Check) and camelCase (checkCircle) to kebab-case
  const iconName = icon
    // Insert hyphens before uppercase letters that follow lowercase letters
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    // Convert to lowercase
    .toLowerCase();

  // Build the remote SVG URL using the working version
  const url = `https://unpkg.com/lucide-static@0.525.0/icons/${iconName.toLowerCase()}.svg`;

  // Fetch the SVG
  const response = await fetch(url);
  if (!response.ok) {
    // Return empty div if icon fetch fails
    return <div />;
  }

  // Fetch the SVG content
  const svg = await response.text();

  // Create data URL using the utility function
  const dataUrl = createDataUrl(svg, "image/svg+xml");

  return (
    <Img
      src={dataUrl}
      alt={props.alt}
      width={props.width || "24"}
      height={props.height || "24"}
    />
  );
}
