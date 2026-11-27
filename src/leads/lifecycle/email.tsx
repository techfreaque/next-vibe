/**
 * Lifecycle journey emails in the email template registry, so the email
 * preview tooling (messenger/preview) can render every step in every locale.
 *
 * Sending never goes through these definitions: the lifecycle engine renders
 * with renderLifecycleEmail (emails.tsx) and its own transport. `render`
 * therefore always skips.
 */

import { success } from "next-vibe/core/route/response.schema";
import { z } from "zod";

import type {
  EmailTemplateDefinition,
  TemplateMetadata,
} from "@/messenger/registry/template";

import { buildCopyContext, LifecycleEmail } from "./emails";
import type { LifecycleTemplateValue } from "./enum";
import { LifecycleTemplate } from "./enum";
import type { LifecycleTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";
import type runDefinition from "./run/definition";
import type {
  LifecycleRunPostRequestOutput,
  LifecycleRunPostResponseOutput,
} from "./run/definition";

const lifecyclePreviewPropsSchema = z.object({
  name: z.string().optional(),
  leadId: z.string().optional(),
  modelCount: z.coerce.number().int().min(0),
  mainstreamCount: z.coerce.number().int().min(0),
  openCount: z.coerce.number().int().min(0),
  uncensoredCount: z.coerce.number().int().min(0),
});
type LifecyclePreviewProps = z.infer<typeof lifecyclePreviewPropsSchema>;

type LifecycleEmailTemplate = EmailTemplateDefinition<
  LifecyclePreviewProps,
  typeof scopedTranslation,
  LifecycleRunPostRequestOutput,
  LifecycleRunPostResponseOutput,
  never,
  typeof runDefinition.POST.allowedRoles
>;

function lifecycleTemplate(
  template: typeof LifecycleTemplateValue,
  meta: Pick<
    TemplateMetadata<LifecycleTranslationKey>,
    "id" | "name" | "description" | "defaultSubject"
  >,
): LifecycleEmailTemplate {
  return {
    scopedTranslation,
    meta: {
      ...meta,
      version: "3.0.0",
      category: "emailTemplates.category",
      path: "/leads/lifecycle/email.tsx",
      previewFields: {
        name: {
          type: "text",
          label: "emailTemplates.preview.name.label",
          description: "emailTemplates.preview.name.description",
          defaultValue: "Alex",
        },
      },
    },
    schema: lifecyclePreviewPropsSchema,
    component: ({ props, locale, recipientEmail, tracking }) => (
      <LifecycleEmail
        template={template}
        locale={locale}
        recipientEmail={recipientEmail}
        leadId={props.leadId ?? null}
        name={props.name ?? null}
        counts={{
          modelCount: props.modelCount,
          mainstreamCount: props.mainstreamCount,
          openCount: props.openCount,
          uncensoredCount: props.uncensoredCount,
        }}
        context={buildCopyContext({
          locale,
          now: new Date(),
          lastActiveAt: null,
          currentIds: null,
          marketingOk: true,
          graceEndsAt: new Date(Date.now() + 7 * 86_400_000),
        })}
        tracking={tracking}
      />
    ),
    // Preview stand-ins; real sends use the live model catalog.
    exampleProps: {
      name: "Alex",
      modelCount: 90,
      mainstreamCount: 50,
      openCount: 25,
      uncensoredCount: 15,
    },
    render: () =>
      success({
        skip: true as const,
        reason: "lifecycle emails are sent by the lifecycle engine",
      }),
  };
}

export const lifecycleFirstChatEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.FIRST_CHAT_PROMPTS,
  {
    id: "lifecycle-first-chat",
    name: "emailTemplates.firstChatPrompts.name",
    description: "emailTemplates.firstChatPrompts.description",
    defaultSubject: "emails.firstChatPrompts.subject",
  },
);

export const lifecycleFirstChatSkillsEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.FIRST_CHAT_SKILLS,
  {
    id: "lifecycle-first-chat-skills",
    name: "emailTemplates.firstChatSkills.name",
    description: "emailTemplates.firstChatSkills.description",
    defaultSubject: "emails.firstChatSkills.subject",
  },
);

export const lifecycleOutOfCreditsEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.OUT_OF_CREDITS,
  {
    id: "lifecycle-out-of-credits",
    name: "emailTemplates.outOfCredits.name",
    description: "emailTemplates.outOfCredits.description",
    defaultSubject: "emails.outOfCredits.subject",
  },
);

export const lifecyclePaymentFailedEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.PAYMENT_FAILED,
  {
    id: "lifecycle-payment-failed",
    name: "emailTemplates.paymentFailed.name",
    description: "emailTemplates.paymentFailed.description",
    defaultSubject: "emails.paymentFailed.subject",
  },
);

export const lifecycleCustomerLikesEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.CUSTOMER_LIKES,
  {
    id: "lifecycle-customer-likes",
    name: "emailTemplates.customerLikes.name",
    description: "emailTemplates.customerLikes.description",
    defaultSubject: "emails.customerLikes.subject",
  },
);

export const lifecycleCustomerBuildNextEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.CUSTOMER_BUILD_NEXT,
  {
    id: "lifecycle-customer-build-next",
    name: "emailTemplates.customerBuildNext.name",
    description: "emailTemplates.customerBuildNext.description",
    defaultSubject: "emails.customerBuildNext.subject",
  },
);

export const lifecycleLapsedWinbackEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.LAPSED_WINBACK,
  {
    id: "lifecycle-lapsed-winback",
    name: "emailTemplates.lapsedWinback.name",
    description: "emailTemplates.lapsedWinback.description",
    defaultSubject: "emails.lapsedWinback.subject",
  },
);

export const lifecycleWhatsNewEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.WHATS_NEW,
  {
    id: "lifecycle-whats-new",
    name: "emailTemplates.whatsNew.name",
    description: "emailTemplates.whatsNew.description",
    defaultSubject: "emails.whatsNew.subject",
  },
);

export const lifecycleWinBackEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.WIN_BACK,
  {
    id: "lifecycle-win-back",
    name: "emailTemplates.winBack.name",
    description: "emailTemplates.winBack.description",
    defaultSubject: "emails.winBack.subject",
  },
);

export const lifecycleInviteSignupEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.INVITE_SIGNUP,
  {
    id: "lifecycle-invite-signup",
    name: "emailTemplates.inviteSignup.name",
    description: "emailTemplates.inviteSignup.description",
    defaultSubject: "emails.inviteSignup.subject",
  },
);

export const lifecycleInviteReminderEmailTemplate = lifecycleTemplate(
  LifecycleTemplate.INVITE_REMINDER,
  {
    id: "lifecycle-invite-reminder",
    name: "emailTemplates.inviteReminder.name",
    description: "emailTemplates.inviteReminder.description",
    defaultSubject: "emails.inviteReminder.subject",
  },
);
