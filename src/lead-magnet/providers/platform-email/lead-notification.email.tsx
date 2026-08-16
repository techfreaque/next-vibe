import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

export interface LeadNotificationEmailProps {
  firstName: string;
  email: string;
  skillId: string;
  toName: string;
  capturedAt: string;
  locale: CountryLanguage;
}

export function LeadNotificationEmail({
  firstName,
  email,
  skillId,
  toName,
  capturedAt,
  locale,
}: LeadNotificationEmailProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Html>
      <Head />
      <Preview>
        {t("previewPrefix")} {firstName} {t("previewSuffix")}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{t("heading")}</Heading>
          <Text style={textStyle}>
            {t("hiPrefix")} {toName},
          </Text>
          <Text style={textStyle}>{t("body")}</Text>
          <Section style={cardStyle}>
            <Text style={labelStyle}>{t("labelName")}</Text>
            <Text style={valueStyle}>{firstName}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>{t("labelEmail")}</Text>
            <Text style={valueStyle}>{email}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>{t("labelSkillId")}</Text>
            <Text style={valueStyle}>{skillId}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>{t("labelCapturedAt")}</Text>
            <Text style={valueStyle}>{capturedAt}</Text>
          </Section>
          <Text style={footerStyle}>{t("footer")}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const textStyle = {
  fontSize: "15px",
  color: "#444",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const cardStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "20px",
  margin: "24px 0",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const valueStyle = {
  fontSize: "15px",
  color: "#1a1a1a",
  margin: "0 0 12px",
};

const dividerStyle = {
  borderColor: "#e5e7eb",
  margin: "12px 0",
};

const footerStyle = {
  fontSize: "12px",
  color: "#aaa",
  lineHeight: "1.5",
  margin: "32px 0 0",
};
