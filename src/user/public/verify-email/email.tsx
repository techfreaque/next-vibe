/**
 * Email verification templates.
 * One component, two entry points: right after signup, and on resend.
 */

import { Button, Section, Text } from "@react-email/components";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { ReactElement } from "react";
import { z } from "zod";

import { configScopedTranslation } from "@/env/i18n";
import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import {
  createTrackingContext,
  type TrackingContext,
} from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import type {
  EmailRenderSkip,
  EmailResolvedData,
  EmailTemplateDefinition,
} from "@/messenger/registry/template";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import type signupDefinition from "../signup/definition";
import type {
  SignupPostRequestOutput,
  SignupPostResponseOutput,
} from "../signup/definition";
import type verifyEmailDefinition from "./definition";
import type {
  VerifyEmailPostRequestOutput,
  VerifyEmailPostResponseOutput,
} from "./definition";
import { scopedTranslation, type VerifyEmailT } from "./i18n";
import { createVerificationToken, VERIFY_TOKEN_TTL_DAYS } from "./token";

const propsSchema = z.object({
  name: z.string(),
  verifyUrl: z.string(),
  /** Newsletter ticked at signup and not yet confirmed: this link confirms it too */
  newsletterBonusCredits: z.number().optional(),
});

type VerifyEmailProps = z.infer<typeof propsSchema>;

function VerifyEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: VerifyEmailProps;
  t: VerifyEmailT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const appName = globalT("appName");
  return (
    <EmailTemplate
      locale={locale}
      title={t("email.title")}
      previewText={t("email.previewText", { appName })}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
        {t("email.greeting", { name: props.name })}
      </Text>
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
          marginBottom: "28px",
        }}
      >
        {t("email.body")}
      </Text>
      {props.newsletterBonusCredits !== undefined && (
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            marginTop: "-12px",
            marginBottom: "28px",
          }}
        >
          {t("email.newsletter", { credits: props.newsletterBonusCredits })}
        </Text>
      )}
      <Section style={{ textAlign: "center", marginBottom: "28px" }}>
        <Button
          href={props.verifyUrl}
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
          {t("email.button")}
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
        {t("email.expiry", { days: VERIFY_TOKEN_TTL_DAYS })}
      </Text>
      <Text style={{ fontSize: "14px", color: "#9ca3af" }}>
        {t("email.signoff", { appName })}
      </Text>
    </EmailTemplate>
  );
}

interface VerifyRecipient {
  id: string;
  leadId: string;
  email: string;
  name: string;
}

async function buildVerificationEmail(
  recipient: VerifyRecipient,
  locale: CountryLanguage,
  template: { component: typeof VerifyEmail },
): Promise<SuccessResponseType<EmailResolvedData> | ErrorResponseType> {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const token = createVerificationToken(recipient.id, recipient.email);
  if (!token) {
    return fail({
      message: t("errors.failed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  const verifyUrl = `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/verify-email/${encodeURIComponent(token)}`;
  const { NewsletterConfirmRepository } =
    await import("@/newsletter/confirm/repository");
  const newsletterPending =
    await NewsletterConfirmRepository.hasPendingForAccount(
      recipient.id,
      recipient.email,
    );
  return success({
    toEmail: recipient.email,
    toName: recipient.name,
    subject: t("email.subject", { appName: globalT("appName") }),
    leadId: recipient.leadId,
    jsx: template.component({
      props: {
        name: recipient.name,
        verifyUrl,
        ...(newsletterPending
          ? { newsletterBonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus }
          : {}),
      },
      t,
      locale,
      recipientEmail: recipient.email,
      tracking: createTrackingContext(locale, recipient.leadId, recipient.id),
    }),
  });
}

async function renderForUser(
  found: Awaited<ReturnType<typeof UserRepository.getUserByEmail>>,
  locale: CountryLanguage,
  template: { component: typeof VerifyEmail },
): Promise<
  SuccessResponseType<EmailResolvedData | EmailRenderSkip> | ErrorResponseType
> {
  if (!found.success) {
    return fail({
      message: found.message,
      errorType: ErrorResponseTypes.NOT_FOUND,
      cause: found,
    });
  }
  if (found.data.emailVerified) {
    return success({ skip: true as const, reason: "already verified" });
  }
  return buildVerificationEmail(
    {
      id: found.data.id,
      leadId: found.data.leadId,
      email: found.data.email,
      name: found.data.privateName,
    },
    locale,
    template,
  );
}

const meta = {
  version: "1.0.0",
  name: "emailTemplates.name",
  description: "emailTemplates.description",
  category: "emailTemplates.category",
  defaultSubject: "email.subject",
} as const;

const exampleProps = {
  name: "Max",
  verifyUrl: "https://example.com/en-US/user/verify-email/token123",
};

/** Resend: logged-in user asks for a fresh link (POST /user/public/verify-email, no token). */
export const verifyEmailResendEmailTemplate: EmailTemplateDefinition<
  VerifyEmailProps,
  typeof scopedTranslation,
  VerifyEmailPostRequestOutput,
  VerifyEmailPostResponseOutput,
  never,
  typeof verifyEmailDefinition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    ...meta,
    id: "verify-email-resend",
    path: "/user/public/verify-email/email.tsx",
  },
  schema: propsSchema,
  component: VerifyEmail,
  exampleProps,
  render: async ({ requestData, user, locale, logger }) => {
    if (requestData.token || user.isPublic) {
      return success({ skip: true as const, reason: "not a resend request" });
    }
    const found = await UserRepository.getUserById(
      user.id,
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );
    return renderForUser(found, locale, verifyEmailResendEmailTemplate);
  },
};

/** Signup: sent right after the account is created. */
export const verifyEmailSignupEmailTemplate: EmailTemplateDefinition<
  VerifyEmailProps,
  typeof scopedTranslation,
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  never,
  typeof signupDefinition.POST.allowedRoles
> = {
  scopedTranslation,
  meta: {
    ...meta,
    id: "verify-email-signup",
    path: "/user/public/verify-email/email.tsx",
  },
  schema: propsSchema,
  component: VerifyEmail,
  exampleProps,
  render: async ({ requestData, locale, logger }) =>
    renderForUser(
      await UserRepository.getUserByEmail(
        requestData.email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      ),
      locale,
      verifyEmailSignupEmailTemplate,
    ),
};
