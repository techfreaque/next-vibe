/**
 * Referral Links - Endpoint Definitions
 * Self-serve tracked links for every signed-in user: one link per placement,
 * carrying the user's own referral code plus UTM tags.
 * GET: the caller's links with visits, signups, paying users and earnings.
 * POST: create a link for one of the caller's own active codes.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { REFERRAL_LINK_CREATE_ALIAS, REFERRAL_LINKS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ReferralLinksWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralLinksWidget })),
);
const ReferralLinkCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralLinkCreateWidget })),
);

const allowedRoles = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;

const referralLinkSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  destinationPath: z.string(),
  refCode: z.string().nullable(),
  url: z.string(),
  visits: z.coerce.number(),
  signups: z.coerce.number(),
  paid: z.coerce.number(),
  /** Confirmed commission (cents) from users this link brought in. */
  earnedCents: z.coerce.number(),
  /** Commission still inside the refund hold (cents). */
  pendingCents: z.coerce.number(),
  createdAt: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["referral", "links"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "link",
  category: "referral",
  subCategory: "Program",
  tags: ["tags.referral", "tags.links"],
  aliases: [REFERRAL_LINKS_ALIAS],
  allowedRoles,

  fields: customWidgetObject({
    render: ReferralLinksWidget,
    usage: { response: true } as const,
    children: {
      links: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.links",
        schema: z.array(referralLinkSchema),
      }),
    },
  }),

  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        links: [
          {
            id: "7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
            name: "YouTube review, November",
            source: "youtube",
            medium: "referral",
            campaign: "uncensored-ai-review",
            destinationPath: "/",
            refCode: "MYCODE",
            url: "https://unbottled.ai/track?ref=MYCODE&url=%2F&utm_source=youtube&utm_medium=referral&utm_campaign=uncensored-ai-review&utm_id=7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
            visits: 1240,
            signups: 61,
            paid: 9,
            earnedCents: 1800,
            pendingCents: 600,
            createdAt: "2026-11-01T10:00:00.000Z",
          },
        ],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "links"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "link",
  category: "referral",
  subCategory: "Program",
  tags: ["tags.referral", "tags.links"],
  aliases: [REFERRAL_LINK_CREATE_ALIAS],
  allowedRoles,

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: ReferralLinkCreateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.name.label",
        description: "post.fields.name.description",
        placeholder: "post.fields.name.placeholder",
        schema: z.string().trim().min(1).max(120),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.source.label",
        description: "post.fields.source.description",
        placeholder: "post.fields.source.placeholder",
        schema: z.string().trim().min(1).max(100),
      }),
      campaign: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.campaign.label",
        description: "post.fields.campaign.description",
        placeholder: "post.fields.campaign.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      medium: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.medium.label",
        description: "post.fields.medium.description",
        placeholder: "post.fields.medium.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      destinationPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.destinationPath.label",
        description: "post.fields.destinationPath.description",
        placeholder: "post.fields.destinationPath.placeholder",
        columns: 6,
        schema: z.string().trim().max(200).default("/"),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.code.label",
        description: "post.fields.code.description",
        placeholder: "post.fields.code.placeholder",
        columns: 6,
        schema: z.string().trim().max(64).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.id",
        hidden: true,
        schema: z.uuid(),
      }),
      url: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.url",
        schema: z.string(),
      }),
      refCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.code",
        schema: z.string(),
      }),
    },
  }),

  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        name: "YouTube review, November",
        source: "youtube",
        campaign: "uncensored-ai-review",
        destinationPath: "/",
      },
      withCode: {
        name: "Newsletter issue 42",
        source: "newsletter",
        medium: "email",
        destinationPath: "/story/refusal-index",
        code: "MYCODE",
      },
    },
    responses: {
      default: {
        id: "7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
        url: "https://unbottled.ai/track?ref=MYCODE&url=%2F&utm_source=youtube&utm_medium=referral&utm_campaign=uncensored-ai-review&utm_id=7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
        refCode: "MYCODE",
      },
      withCode: {
        id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9102",
        url: "https://unbottled.ai/track?ref=MYCODE&url=%2Fstory%2Frefusal-index&utm_source=newsletter&utm_medium=email&utm_campaign=newsletter-issue-42&utm_id=8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9102",
        refCode: "MYCODE",
      },
    },
  },
});

export type ReferralLinksGetResponseOutput = typeof GET.types.ResponseOutput;
export type ReferralLinkCreateRequestOutput = typeof POST.types.RequestOutput;
export type ReferralLinkCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export default definitions;
