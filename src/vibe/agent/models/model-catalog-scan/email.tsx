/**
 * Model Catalog Scan - ops email.
 * Internal report to the ops inboxes: the plain-text report in a monospace
 * block so it pastes cleanly into a coding brief.
 */

import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import type { CSSProperties, JSX } from "react";

export interface ModelCatalogScanEmailProps {
  subject: string;
  body: string;
}

export function ModelCatalogScanEmail({
  subject,
  body,
}: ModelCatalogScanEmailProps): JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={reportStyle}>{body}</Text>
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
  padding: "24px 20px",
  maxWidth: "960px",
  borderRadius: "8px",
};

const reportStyle: CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#111827",
  whiteSpace: "pre-wrap",
  margin: "0",
};
