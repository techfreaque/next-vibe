/**
 * Referral Payout Email Templates
 * User confirmation + admin notification
 */

import { Hr, Section, Text as Span } from "@react-email/components";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ReactElement } from "react";
import { z } from "zod";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { EmailTemplate } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/tracking_context.email";
import type { EmailTemplateDefinition } from "@/app/api/[locale]/messenger/registry/template";
import { db } from "@/app/api/[locale]/system/db";
import { users } from "@/app/api/[locale]/user/db";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { PayoutCurrency } from "../enum";
import type { ReferralT } from "../i18n";
import { scopedTranslation } from "../i18n";
import { REFERRAL_CONFIG } from "../config";
import type definition from "./definition";
import {
  type PayoutPostRequestOutput,
  type PayoutPostResponseOutput,
} from "./definition";

// ============================================================================
// SCHEMA
// ============================================================================

const payoutEmailPropsSchema = z.object({
  amountCents: z.number(),
  currency: z.string(),
  walletAddress: z.string().optional().nullable(),
  userId: z.string().optional(),
  leadId: z.string().optional(),
});

type PayoutEmailProps = z.infer<typeof payoutEmailPropsSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

function PayoutUserEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PayoutEmailProps;
  t: ReferralT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  void locale;
  void tracking;
  const isCrypto = props.currency !== PayoutCurrency.CREDITS;
  return (
    <EmailTemplate
      locale={locale}
      title={
        isCrypto
          ? t("payout.email.user.titleCrypto")
          : t("payout.email.user.titleCredits")
      }
      previewText={
        isCrypto
          ? t("payout.email.user.previewCrypto")
          : t("payout.email.user.previewCredits")
      }
      recipientEmail={recipientEmail}
      tracking={
        props.userId && props.leadId
          ? createTrackingContext(locale, props.leadId, props.userId)
          : tracking
      }
    >
      <Span style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
        {isCrypto
          ? t("payout.email.user.bodyCrypto", {
              cryptoPayoutHours: REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS,
            })
          : t("payout.email.user.bodyCredits")}
      </Span>
      <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            color: "#4b5563",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                  width: "120px",
                }}
              >
                {t("payout.email.user.labelAmount")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>
                {props.amountCents.toLocaleString()}{" "}
                {t("payout.email.user.credits")}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                }}
              >
                {t("payout.email.user.labelMethod")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>{props.currency}</td>
            </tr>
            {props.walletAddress ? (
              <tr>
                <td
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                  }}
                >
                  {t("payout.email.user.labelWallet")}:
                </td>
                <td style={{ paddingBottom: "8px", wordBreak: "break-all" }}>
                  {props.walletAddress}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Section>
      {isCrypto ? (
        <Span style={{ fontSize: "14px", color: "#6b7280" }}>
          {t("payout.email.user.followUpCrypto")}
        </Span>
      ) : null}
    </EmailTemplate>
  );
}

// ============================================================================
// TEMPLATE DEFINITION
// ============================================================================

export const payoutUserEmailTemplate: EmailTemplateDefinition<
  PayoutEmailProps,
  typeof scopedTranslation,
  PayoutPostRequestOutput,
  PayoutPostResponseOutput,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    id: "referral-payout-user",
    version: "1.0.0",
    name: "payout.email.user.titleCrypto",
    description: "payout.email.user.previewCrypto",
    category: "payout.get.title",
    path: "/referral/payout/email.tsx",
    defaultSubject: "payout.email.user.subjectCrypto",
    previewFields: {
      amountCents: {
        type: "number",
        label: "payout.fields.amountCents.label",
        description: "payout.fields.amountCents.description",
        defaultValue: 5000,
        required: true,
      },
      currency: {
        type: "select",
        label: "payout.fields.currency.label",
        description: "payout.fields.currency.description",
        defaultValue: "CREDITS",
        required: true,
        options: [
          { value: "CREDITS", label: "enums.payoutCurrency.credits" },
          { value: "BTC", label: "enums.payoutCurrency.btc" },
          { value: "USDC", label: "enums.payoutCurrency.usdc" },
        ],
      },
      walletAddress: {
        type: "text",
        label: "payout.fields.walletAddress.label",
        description: "payout.fields.walletAddress.description",
        defaultValue: "",
      },
    },
  },
  schema: payoutEmailPropsSchema,
  component: PayoutUserEmail,
  exampleProps: {
    amountCents: 5000,
    currency: "CREDITS",
    walletAddress: "",
  },
  render: async ({ requestData, locale, user, logger }) => {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: configT } = configScopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const [userRow] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, user.id));
      if (!userRow) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const isCrypto = requestData.currency !== PayoutCurrency.CREDITS;
      const subject = isCrypto
        ? `${t("payout.email.user.subjectCrypto")} - ${configT("appName")}`
        : `${t("payout.email.user.subjectCredits")} - ${configT("appName")}`;
      const tracking = createTrackingContext(locale, user.leadId, user.id);
      const jsx = (
        <PayoutUserEmail
          props={{
            amountCents: requestData.amountCents,
            currency: requestData.currency,
            walletAddress: requestData.walletAddress,
            userId: user.id,
            leadId: user.leadId,
          }}
          t={t}
          locale={locale}
          recipientEmail={userRow.email}
          tracking={tracking}
        />
      );
      return success({
        toEmail: userRow.email,
        toName: userRow.email,
        subject,
        replyToEmail: contactClientRepository.getSupportEmail(locale),
        replyToName: configT("appName"),
        leadId: user.leadId,
        jsx,
      });
    } catch (err) {
      logger.error("Failed to render user payout email", parseError(err));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

// ============================================================================
// ADMIN PAYOUT TEMPLATE
// ============================================================================

const payoutAdminEmailPropsSchema = z.object({
  amountCents: z.number(),
  currency: z.string(),
  walletAddress: z.string().optional().nullable(),
  userEmail: z.string().email().optional(),
});

type PayoutAdminEmailProps = z.infer<typeof payoutAdminEmailPropsSchema>;

export const payoutAdminEmailTemplate: EmailTemplateDefinition<
  PayoutAdminEmailProps,
  typeof scopedTranslation,
  PayoutPostRequestOutput,
  PayoutPostResponseOutput,
  never,
  typeof definition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    id: "referral-payout-admin",
    version: "1.0.0",
    name: "payout.email.admin.title",
    description: "payout.email.admin.preview",
    category: "payout.get.title",
    path: "/referral/payout/email.tsx",
    defaultSubject: "payout.email.admin.subject",
    previewFields: {
      amountCents: {
        type: "number",
        label: "payout.fields.amountCents.label",
        defaultValue: 5000,
        required: true,
      },
      currency: {
        type: "select",
        label: "payout.fields.currency.label",
        defaultValue: "CREDITS",
        required: true,
        options: [
          { value: "CREDITS", label: "enums.payoutCurrency.credits" },
          { value: "BTC", label: "enums.payoutCurrency.btc" },
          { value: "USDC", label: "enums.payoutCurrency.usdc" },
        ],
      },
      userEmail: {
        type: "email",
        label: "payout.email.admin.labelUser",
        defaultValue: "user@example.com",
      },
    },
  },
  schema: payoutAdminEmailPropsSchema,
  component: ({ props, t, locale, recipientEmail }) =>
    renderAdminPayoutEmailContent(
      t,
      locale,
      recipientEmail,
      props.amountCents,
      props.currency,
      props.walletAddress,
      props.userEmail,
    ),
  exampleProps: {
    amountCents: 5000,
    currency: "CREDITS",
    walletAddress: "",
    userEmail: "user@example.com",
  },
  render: async ({ requestData, locale, user, logger }) => {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: configT } = configScopedTranslation.scopedT(locale);
    const adminEmail = contactClientRepository.getSupportEmail(locale);
    try {
      let userEmail: string | undefined;
      if (user.id) {
        const [userRow] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, user.id));
        userEmail = userRow?.email;
      }
      return success({
        toEmail: adminEmail,
        toName: configT("appName"),
        subject: `[${configT("appName")}] ${t("payout.email.admin.subject")} - ${requestData.amountCents} ${t("payout.email.admin.credits")} via ${requestData.currency}`,
        replyToEmail: userEmail,
        replyToName: userEmail,
        leadId: user.leadId,
        jsx: renderAdminPayoutEmailContent(
          t,
          locale,
          adminEmail,
          requestData.amountCents,
          requestData.currency,
          requestData.walletAddress,
          userEmail,
        ),
      });
    } catch (err) {
      logger.error("Failed to render admin payout email", parseError(err));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

function renderAdminPayoutEmailContent(
  t: ReferralT,
  locale: CountryLanguage,
  recipientEmail: string,
  amountCents: number,
  currency: string,
  walletAddress: string | null | undefined,
  userEmail: string | undefined,
): ReactElement {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return (
    <EmailTemplate
      locale={locale}
      title={`${t("payout.email.admin.title")} - ${configT("appName")}`}
      previewText={t("payout.email.admin.preview")}
      recipientEmail={recipientEmail}
      tracking={createTrackingContext(locale)}
    >
      <Span style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
        {t("payout.email.admin.body")}
      </Span>
      <Section
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginTop: "16px",
          marginBottom: "24px",
        }}
      >
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            color: "#4b5563",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            {userEmail ? (
              <tr>
                <td
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                    width: "120px",
                  }}
                >
                  {t("payout.email.admin.labelUser")}:
                </td>
                <td style={{ paddingBottom: "8px" }}>{userEmail}</td>
              </tr>
            ) : null}
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                }}
              >
                {t("payout.email.admin.labelAmount")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>
                {amountCents.toLocaleString()} {t("payout.email.admin.credits")}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  paddingBottom: "8px",
                  paddingRight: "16px",
                }}
              >
                {t("payout.email.admin.labelCurrency")}:
              </td>
              <td style={{ paddingBottom: "8px" }}>{currency}</td>
            </tr>
            {walletAddress ? (
              <tr>
                <td
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                  }}
                >
                  {t("payout.email.admin.labelWallet")}:
                </td>
                <td style={{ paddingBottom: "8px", wordBreak: "break-all" }}>
                  {walletAddress}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Section>
      <Span style={{ fontSize: "14px", color: "#6b7280" }}>
        {t("payout.email.admin.footer")}
      </Span>
    </EmailTemplate>
  );
}
