/**
 * Outreach Deal - Upsert Definition
 * POST: create a paid deal for a contact (by email), or update one by id.
 * Only the fields passed change on update.
 * Client+server safe. No server imports.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  OutreachCurrencyOptions,
  OutreachDealStatus,
  OutreachDealStatusOptions,
} from "../enum";
import { outreachErrorTypes } from "../errors";
import { scopedTranslation } from "../i18n";
import { OUTREACH_DEAL_UPSERT_ALIAS } from "./constants";

const OutreachDealUpsertWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OutreachDealUpsertWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "outreach", "deal"],
  title: "deal.post.title",
  titleShort: "deal.post.titleShort",
  description: "deal.post.description",
  icon: "wallet",
  category: "leads",
  subCategory: "outreach",
  tags: ["tags.outreach", "tags.deals"],
  aliases: [OUTREACH_DEAL_UPSERT_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const [{ apiClient }, crm] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../crm/definition"),
        ]);
        await apiClient.refetchEndpoint(crm.default.GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: OutreachDealUpsertWidget,
    usage: { request: "data", response: true } as const,
    children: {
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.id.label",
        description: "deal.post.fields.id.description",
        columns: 12,
        schema: z.uuid().optional(),
      }),
      contactEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "deal.post.fields.contactEmail.label",
        description: "deal.post.fields.contactEmail.description",
        placeholder: "deal.post.fields.contactEmail.placeholder",
        columns: 6,
        schema: z.string().trim().toLowerCase().pipe(z.email()).optional(),
      }),
      contactName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.contactName.label",
        description: "deal.post.fields.contactName.description",
        placeholder: "deal.post.fields.contactName.placeholder",
        columns: 6,
        schema: z.string().trim().max(200).optional(),
      }),
      deliverable: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.deliverable.label",
        description: "deal.post.fields.deliverable.description",
        placeholder: "deal.post.fields.deliverable.placeholder",
        columns: 12,
        schema: z.string().trim().min(1).max(200).optional(),
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "deal.post.fields.amount.label",
        description: "deal.post.fields.amount.description",
        columns: 4,
        schema: z.coerce.number().min(0).max(10_000_000).optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "deal.post.fields.currency.label",
        description: "deal.post.fields.currency.description",
        options: OutreachCurrencyOptions,
        columns: 4,
        schema: z.enum(CurrenciesArr).optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "deal.post.fields.status.label",
        description: "deal.post.fields.status.description",
        options: OutreachDealStatusOptions,
        columns: 4,
        schema: z.enum(OutreachDealStatus).optional(),
      }),
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.channel.label",
        description: "deal.post.fields.channel.description",
        placeholder: "deal.post.fields.channel.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      refCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.refCode.label",
        description: "deal.post.fields.refCode.description",
        placeholder: "deal.post.fields.refCode.placeholder",
        columns: 6,
        schema: z.string().trim().max(64).optional(),
      }),
      utmCampaign: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.utmCampaign.label",
        description: "deal.post.fields.utmCampaign.description",
        placeholder: "deal.post.fields.utmCampaign.placeholder",
        columns: 6,
        schema: z.string().trim().max(100).optional(),
      }),
      campaignLinkId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deal.post.fields.campaignLinkId.label",
        description: "deal.post.fields.campaignLinkId.description",
        columns: 6,
        schema: z.uuid().optional(),
      }),
      liveAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "deal.post.fields.liveAt.label",
        description: "deal.post.fields.liveAt.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      paidAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "deal.post.fields.paidAt.label",
        description: "deal.post.fields.paidAt.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "deal.post.fields.notes.label",
        description: "deal.post.fields.notes.description",
        placeholder: "deal.post.fields.notes.placeholder",
        columns: 12,
        schema: z.string().trim().max(2000).optional(),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      dealId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deal.post.response.id",
        schema: z.uuid(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deal.post.response.created",
        schema: z.boolean(),
      }),
      dealStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deal.post.response.status",
        schema: z.enum(OutreachDealStatus),
      }),
      linkFound: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deal.post.response.linkFound",
        schema: z.boolean().nullable(),
      }),
    },
  }),

  errorTypes: outreachErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        contactEmail: "youtube@paradoxa.ai",
        contactName: "MoeMoe",
        deliverable: "YouTube integration",
        amount: 550,
        currency: "USD",
        status: OutreachDealStatus.PAID,
        channel: "youtube",
        refCode: "moemoe",
        utmCampaign: "moemoe-2026-11-14",
        liveAt: "2026-11-14",
      },
    },
    responses: {
      default: {
        dealId: "7a2b3c4d-5e6f-4a1b-9c2d-3e4f5a6b7c80",
        created: true,
        dealStatus: OutreachDealStatus.PAID,
        linkFound: null,
      },
    },
  },
});

export type OutreachDealUpsertRequestOutput = typeof POST.types.RequestOutput;
export type OutreachDealUpsertResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
