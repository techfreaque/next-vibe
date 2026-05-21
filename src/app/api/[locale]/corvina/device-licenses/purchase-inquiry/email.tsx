// oxlint-disable oxlint-plugin-i18n/no-literal-string -- Email template uses fixed EN strings
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
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import { z } from "zod";

import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const purchaseInquiryEmailPropsSchema = z.object({
  logicalId: z.string(),
  orgResourceId: z.string(),
  deviceLabel: z.string().optional(),
  contactName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string().optional(),
  message: z.string().optional(),
  requestedMonths: z.number().optional(),
  inquiryId: z.number(),
});

export type PurchaseInquiryEmailProps = z.infer<
  typeof purchaseInquiryEmailPropsSchema
>;

export function PurchaseInquiryEmailContent({
  logicalId,
  orgResourceId,
  deviceLabel,
  contactName,
  contactEmail,
  contactPhone,
  message,
  requestedMonths,
  inquiryId,
}: PurchaseInquiryEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>
        New license inquiry #{String(inquiryId)}: {logicalId}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>
            New Purchase Inquiry #{inquiryId}
          </Heading>

          <Text style={textStyle}>
            A new device license inquiry has been submitted.
          </Text>

          <Section style={sectionHeadStyle}>
            <Text style={sectionTitleStyle}>Device Details</Text>
          </Section>
          <Section style={cardStyle}>
            <Text style={labelStyle}>Device ID</Text>
            <Text style={valueStyle}>{logicalId}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Organization</Text>
            <Text style={valueStyle}>{orgResourceId}</Text>
            {deviceLabel !== undefined && (
              <>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Device Name</Text>
                <Text style={valueStyle}>{deviceLabel}</Text>
              </>
            )}
          </Section>

          <Section style={sectionHeadStyle}>
            <Text style={sectionTitleStyle}>Contact Details</Text>
          </Section>
          <Section style={cardStyle}>
            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{contactName}</Text>
            <Hr style={dividerStyle} />
            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{contactEmail}</Text>
            {contactPhone !== undefined && (
              <>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Phone</Text>
                <Text style={valueStyle}>{contactPhone}</Text>
              </>
            )}
            {requestedMonths !== undefined && (
              <>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Requested Months</Text>
                <Text style={valueStyle}>{requestedMonths}</Text>
              </>
            )}
            {message !== undefined && (
              <>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Message</Text>
                <Text style={valueStyle}>{message}</Text>
              </>
            )}
          </Section>

          <Text style={footerStyle}>
            Respond to this inquiry in the admin panel.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const purchaseInquiryEmailTemplate: EmailTemplateDefinition<
  PurchaseInquiryEmailProps,
  typeof scopedTranslation,
  never,
  never,
  never,
  readonly UserRoleValue[]
> = {
  scopedTranslation,
  meta: {
    id: "corvina-purchase-inquiry",
    version: "1.0.0",
    name: "post.title",
    description: "post.description",
    category: "category",
    path: "/corvina/device-licenses/purchase-inquiry/email.tsx",
    defaultSubject: "email.subject",
  },
  schema: purchaseInquiryEmailPropsSchema,
  component: ({ props }) => PurchaseInquiryEmailContent(props),
  exampleProps: {
    logicalId: "device-abc-123",
    orgResourceId: "org-xyz-456",
    deviceLabel: "Building A - Gateway",
    contactName: "John Smith",
    contactEmail: "john@example.com",
    contactPhone: "+1 555-0100",
    message: "Looking for a 1-year subscription.",
    requestedMonths: 12,
    inquiryId: 42,
  },
  render: ({ t }) =>
    fail({
      message: t("post.errors.server.description"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }),
};

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
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const textStyle = {
  fontSize: "15px",
  color: "#444",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const sectionHeadStyle = {
  margin: "24px 0 8px",
};

const sectionTitleStyle = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

const cardStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "20px",
  margin: "8px 0 16px",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "600" as const,
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
