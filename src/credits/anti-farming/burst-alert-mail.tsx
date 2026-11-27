/**
 * Anti-farming burst alert: internal ops mail (English, plain text block).
 */

import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import type { CSSProperties, JSX } from "react";

export function BurstAlertMail({
  subject,
  body,
}: {
  subject: string;
  body: string;
}): JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={textStyle}>{body}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const containerStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px 20px",
  maxWidth: "720px",
  borderRadius: "8px",
};

const textStyle: CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#111827",
  whiteSpace: "pre-wrap",
  margin: "0",
};
