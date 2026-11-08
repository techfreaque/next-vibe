/**
 * Campaign Links - Endpoint Definitions
 * GET: tagged links with visits → signups → paid. POST: build a new link.
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

import { scopedTranslation } from "../i18n";
import {
  GROWTH_CAMPAIGN_LINK_CREATE_ALIAS,
  GROWTH_CAMPAIGN_LINKS_ALIAS,
} from "./constants";

const CampaignLinksWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CampaignLinksWidget })),
);
const CampaignLinkCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CampaignLinkCreateWidget })),
);

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

const campaignLinkSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  content: z.string().nullable(),
  term: z.string().nullable(),
  destinationPath: z.string(),
  refCode: z.string().nullable(),
  url: z.string(),
  visits: z.coerce.number(),
  signups: z.coerce.number(),
  paid: z.coerce.number(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "growth", "links"],
  title: "links.get.title",
  titleShort: "links.get.titleShort",
  description: "links.get.description",
  icon: "link",
  category: "leads",
  subCategory: "growth",
  tags: ["tags.growth", "tags.campaigns"],
  aliases: [GROWTH_CAMPAIGN_LINKS_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignLinksWidget,
    usage: { response: true } as const,
    children: {
      links: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "links.get.response.links",
        schema: z.array(campaignLinkSchema),
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
            id: "6f1c2b4e-8f0a-4c1d-9b2e-3a4f5d6e7f80",
            name: "Reddit launch post",
            source: "reddit",
            medium: "social",
            campaign: "launch-nov",
            content: null,
            term: null,
            destinationPath: "/",
            refCode: null,
            url: "https://unbottled.ai/?utm_source=reddit&utm_medium=social&utm_campaign=launch-nov&utm_id=6f1c2b4e-8f0a-4c1d-9b2e-3a4f5d6e7f80",
            visits: 412,
            signups: 38,
            paid: 6,
          },
        ],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "growth", "links"],
  title: "links.post.title",
  titleShort: "links.post.titleShort",
  description: "links.post.description",
  icon: "link",
  category: "leads",
  subCategory: "growth",
  tags: ["tags.growth", "tags.campaigns"],
  aliases: [GROWTH_CAMPAIGN_LINK_CREATE_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: CampaignLinkCreateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.name.label",
        description: "links.post.fields.name.description",
        placeholder: "links.post.fields.name.placeholder",
        schema: z.string().trim().min(1).max(120),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.channel.label",
        description: "links.post.fields.channel.description",
        placeholder: "links.post.fields.channel.placeholder",
        columns: 6,
        schema: z.string().trim().min(1).max(100),
      }),
      medium: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.medium.label",
        description: "links.post.fields.medium.description",
        placeholder: "links.post.fields.medium.placeholder",
        columns: 6,
        schema: z.string().trim().min(1).max(100),
      }),
      campaign: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.campaign.label",
        description: "links.post.fields.campaign.description",
        placeholder: "links.post.fields.campaign.placeholder",
        schema: z.string().trim().min(1).max(100),
      }),
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.content.label",
        description: "links.post.fields.content.description",
        placeholder: "links.post.fields.content.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      term: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.term.label",
        description: "links.post.fields.term.description",
        placeholder: "links.post.fields.term.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      destinationPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.destinationPath.label",
        description: "links.post.fields.destinationPath.description",
        placeholder: "links.post.fields.destinationPath.placeholder",
        columns: 6,
        schema: z.string().trim().max(200).default("/"),
      }),
      refCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "links.post.fields.refCode.label",
        description: "links.post.fields.refCode.description",
        placeholder: "links.post.fields.refCode.placeholder",
        columns: 6,
        schema: z.string().trim().max(64).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "links.post.response.id",
        hidden: true,
        schema: z.uuid(),
      }),
      url: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "links.post.response.url",
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
        name: "Reddit launch post",
        source: "reddit",
        medium: "social",
        campaign: "launch-nov",
        destinationPath: "/",
      },
      withReferral: {
        name: "Partner newsletter",
        source: "partner-newsletter",
        medium: "email",
        campaign: "nov-feature",
        destinationPath: "/story",
        refCode: "FRIEND2024",
      },
    },
    responses: {
      default: {
        id: "6f1c2b4e-8f0a-4c1d-9b2e-3a4f5d6e7f80",
        url: "https://unbottled.ai/?utm_source=reddit&utm_medium=social&utm_campaign=launch-nov&utm_id=6f1c2b4e-8f0a-4c1d-9b2e-3a4f5d6e7f80",
      },
      withReferral: {
        id: "7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
        url: "https://unbottled.ai/track?ref=FRIEND2024&url=%2Fstory&utm_source=partner-newsletter&utm_medium=email&utm_campaign=nov-feature&utm_id=7a2d3c5f-9a1b-4d2e-8c3f-4b5a6e7f8091",
      },
    },
  },
});

export type CampaignLinksGetResponseOutput = typeof GET.types.ResponseOutput;
export type CampaignLinkCreateRequestOutput = typeof POST.types.RequestOutput;
export type CampaignLinkCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export default definitions;
