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
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const subscriptionReminderEmailPropsSchema = z.object({
  logicalId: z.string(),
  orgResourceId: z.string(),
  expiryDate: dateSchema,
  daysUntilExpiry: z.number(),
  isAdmin: z.boolean(),
  clientEmail: z.string().optional(),
});

export type SubscriptionReminderEmailProps = z.infer<
  typeof subscriptionReminderEmailPropsSchema
>;

export function SubscriptionReminderEmailContent({
  logicalId,
  orgResourceId,
  expiryDate,
  daysUntilExpiry,
  isAdmin,
  clientEmail,
}: SubscriptionReminderEmailProps): ReactElement {
  const formattedDate = expiryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const preview = isAdmin
    ? `[Admin] Subscription expiring: ${logicalId}`
    : `Your device subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>
            {isAdmin
              ? "Subscription Expiry Alert"
              : "Subscription Expiry Notice"}
          </Heading>

          {isAdmin ? (
            <>
              <Text style={textStyle}>
                The following device subscription is expiring soon:
              </Text>
              <Section style={cardStyle}>
                <Text style={labelStyle}>Device ID</Text>
                <Text style={valueStyle}>{logicalId}</Text>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Organization</Text>
                <Text style={valueStyle}>{orgResourceId}</Text>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Expiry Date</Text>
                <Text style={valueStyle}>{formattedDate}</Text>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Days Until Expiry</Text>
                <Text style={valueStyle}>{daysUntilExpiry}</Text>
                {clientEmail !== undefined && (
                  <>
                    <Hr style={dividerStyle} />
                    <Text style={labelStyle}>Client Email</Text>
                    <Text style={valueStyle}>{clientEmail}</Text>
                  </>
                )}
              </Section>
              <Text style={footerStyle}>
                Update the subscription in the admin panel to prevent service
                interruption.
              </Text>
            </>
          ) : (
            <>
              <Text style={textStyle}>
                Your device subscription is expiring in{" "}
                <strong>
                  {daysUntilExpiry} day{daysUntilExpiry === 1 ? "" : "s"}
                </strong>
                .
              </Text>
              <Section style={cardStyle}>
                <Text style={labelStyle}>Device ID</Text>
                <Text style={valueStyle}>{logicalId}</Text>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Organization</Text>
                <Text style={valueStyle}>{orgResourceId}</Text>
                <Hr style={dividerStyle} />
                <Text style={labelStyle}>Expiry Date</Text>
                <Text style={valueStyle}>{formattedDate}</Text>
              </Section>
              <Text style={textStyle}>
                Contact us to renew your subscription and ensure uninterrupted
                service.
              </Text>
              <Text style={footerStyle}>
                This is an automated reminder. You will not receive duplicate
                reminders for the same renewal cycle.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

export const subscriptionReminderEmailTemplate: EmailTemplateDefinition<
  SubscriptionReminderEmailProps,
  typeof scopedTranslation,
  never,
  never,
  never,
  readonly UserRoleValue[]
> = {
  scopedTranslation,
  meta: {
    id: "corvina-subscription-reminder",
    version: "1.0.0",
    name: "post.title",
    description: "post.description",
    category: "category",
    path: "/corvina/device-licenses/subscription-reminder/email.tsx",
    defaultSubject: "email.subject",
  },
  schema: subscriptionReminderEmailPropsSchema,
  component: ({ props }) => SubscriptionReminderEmailContent(props),
  exampleProps: {
    logicalId: "device-abc-123",
    orgResourceId: "org-xyz-456",
    expiryDate: Date.UTC(2026, 5, 15),
    daysUntilExpiry: 12,
    isAdmin: false,
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

const cardStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "20px",
  margin: "24px 0",
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
