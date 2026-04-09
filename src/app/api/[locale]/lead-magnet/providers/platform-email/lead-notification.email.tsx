// oxlint-disable oxlint-plugin-i18n/no-literal-string -- Email templates use fixed EN strings, not i18n
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
import type { JSX } from "react";
import React from "react";

export interface LeadNotificationEmailProps {
  firstName: string;
  email: string;
  skillId: string;
  toName: string;
  capturedAt: string;
}

export function LeadNotificationEmail({
  firstName,
  email,
  skillId,
  toName,
  capturedAt,
}: LeadNotificationEmailProps): JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>New lead: {firstName} just signed up via your skill</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>You got a new lead 🎯</Heading>
          <Text style={textStyle}>Hi {toName},</Text>
          <Text style={textStyle}>
            Someone just submitted your lead form. Here are their details:
          </Text>
          <Section style={cardStyle}>
            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{firstName}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{email}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Skill ID</Text>
            <Text style={valueStyle}>{skillId}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Captured at</Text>
            <Text style={valueStyle}>{capturedAt}</Text>
          </Section>
          <Text style={footerStyle}>
            This notification was sent because you connected Platform Email as
            your lead magnet provider.
          </Text>
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
