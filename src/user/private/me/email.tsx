/**
 * Email change confirmation.
 * Sent to the NEW address after a profile save that requested a change
 * (users.pendingEmail). Clicking the link completes the swap
 * (verify-email repository, purpose "email-change"); until then the current
 * address stays the login.
 */

import { Button } from "@react-email/button";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { eq } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { ReactElement } from "react";
import { z } from "zod";

import { configScopedTranslation } from "@/env/i18n";
import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import type { TrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import type { EmailTemplateDefinition } from "@/messenger/registry/template";

import {
  createVerificationToken,
  VERIFY_TOKEN_TTL_DAYS,
} from "../../public/verify-email/token";
import type meDefinition from "./definition";
import type { MePostRequestOutput, MePostResponseOutput } from "./definition";
import { type MeT, scopedTranslation } from "./i18n";

const propsSchema = z.object({
  name: z.string(),
  confirmUrl: z.string(),
  /** The address that stays active until the link is clicked */
  currentEmail: z.string(),
});

type EmailChangeProps = z.infer<typeof propsSchema>;

const textStyle = { fontSize: "16px", lineHeight: "1.6", color: "#374151" };

function EmailChangeConfirm({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: EmailChangeProps;
  t: MeT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");
  return (
    <EmailTemplate
      locale={locale}
      title={t("emailChange.title")}
      previewText={t("emailChange.previewText", { appName })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      <Text style={textStyle}>
        {t("emailChange.greeting", { name: props.name })}
      </Text>
      <Text style={{ ...textStyle, marginBottom: "28px" }}>
        {t("emailChange.body", { appName, current: props.currentEmail })}
      </Text>
      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={props.confirmUrl}
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            padding: "14px 32px",
            textDecoration: "none",
          }}
        >
          {t("emailChange.button")}
        </Button>
      </Section>
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "1.5",
          color: "#9ca3af",
          fontStyle: "italic",
        }}
      >
        {t("emailChange.expiry", { days: VERIFY_TOKEN_TTL_DAYS })}
      </Text>
      <Text style={{ fontSize: "14px", color: "#9ca3af" }}>
        {t("emailChange.signoff", { appName })}
      </Text>
    </EmailTemplate>
  );
}

/** Profile save (POST /user/private/me) that requested a new address. */
export const emailChangeConfirmEmailTemplate: EmailTemplateDefinition<
  EmailChangeProps,
  typeof scopedTranslation,
  MePostRequestOutput,
  MePostResponseOutput,
  never,
  typeof meDefinition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    version: "1.0.0",
    id: "email-change-confirm",
    name: "emailChange.template.name",
    description: "emailChange.template.description",
    category: "emailChange.template.category",
    path: "/user/private/me/email.tsx",
    defaultSubject: "emailChange.subject",
  },
  schema: propsSchema,
  component: EmailChangeConfirm,
  exampleProps: {
    name: "Max",
    confirmUrl: "https://example.com/en-US/user/verify-email/token123",
    currentEmail: "old@example.com",
  },
  render: async ({ requestData, user, locale }) => {
    const requested = requestData.basicInfo?.email;
    if (user.isPublic || !user.id || !requested) {
      return success({ skip: true as const, reason: "no email change" });
    }
    const [row] = await db
      .select({
        email: users.email,
        pendingEmail: users.pendingEmail,
        name: users.privateName,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    // Only when this save left exactly this address pending
    if (
      !row?.pendingEmail ||
      row.pendingEmail.toLowerCase() !== requested.toLowerCase()
    ) {
      return success({ skip: true as const, reason: "no change pending" });
    }
    const { t } = scopedTranslation.scopedT(locale);
    const { t: globalT } = configScopedTranslation.scopedT(locale);
    const token = createVerificationToken(
      user.id,
      row.pendingEmail,
      Date.now(),
      "email-change",
    );
    if (!token) {
      return fail({
        message: t("emailChange.errors.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const confirmUrl = `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/verify-email/${encodeURIComponent(token)}`;
    return success({
      toEmail: row.pendingEmail,
      toName: row.name,
      subject: t("emailChange.subject", { appName: globalT("appName") }),
      leadId: user.leadId,
      jsx: EmailChangeConfirm({
        props: { name: row.name, confirmUrl, currentEmail: row.email },
        t,
        locale,
        recipientEmail: row.pendingEmail,
        tracking: createTrackingContext(locale, user.leadId, user.id),
      }),
    });
  },
};
