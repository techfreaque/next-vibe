/**
 * Outreach Contact - Upsert Definition
 * POST: create or update a contact by email; with a subject (or note) it also
 * logs the email as a touch. One call per sent email keeps the CRM current.
 * Client+server safe. No server imports.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  OutreachContactKind,
  OutreachContactKindOptions,
  OutreachContactStatus,
  OutreachContactStatusOptions,
  OutreachDirection,
  OutreachDirectionOptions,
} from "../enum";
import { outreachErrorTypes } from "../errors";
import { scopedTranslation } from "../i18n";
import { OUTREACH_CONTACT_UPSERT_ALIAS } from "./constants";

const OutreachContactUpsertWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OutreachContactUpsertWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "outreach", "contact"],
  title: "contact.post.title",
  titleShort: "contact.post.titleShort",
  description: "contact.post.description",
  icon: "user-plus",
  category: "leads",
  subCategory: "outreach",
  tags: ["tags.outreach", "tags.crm"],
  aliases: [OUTREACH_CONTACT_UPSERT_ALIAS],
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
    render: OutreachContactUpsertWidget,
    usage: { request: "data", response: true } as const,
    children: {
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "contact.post.fields.email.label",
        description: "contact.post.fields.email.description",
        placeholder: "contact.post.fields.email.placeholder",
        columns: 6,
        schema: z.string().trim().toLowerCase().pipe(z.email()),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.name.label",
        description: "contact.post.fields.name.description",
        placeholder: "contact.post.fields.name.placeholder",
        columns: 6,
        schema: z.string().trim().max(200).optional(),
      }),
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "contact.post.fields.kind.label",
        description: "contact.post.fields.kind.description",
        options: OutreachContactKindOptions,
        columns: 6,
        schema: z.enum(OutreachContactKind).optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "contact.post.fields.status.label",
        description: "contact.post.fields.status.description",
        options: OutreachContactStatusOptions,
        columns: 6,
        schema: z.enum(OutreachContactStatus).optional(),
      }),
      forceStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "contact.post.fields.forceStatus.label",
        description: "contact.post.fields.forceStatus.description",
        columns: 12,
        schema: z.boolean().optional().default(false),
      }),
      angle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.angle.label",
        description: "contact.post.fields.angle.description",
        placeholder: "contact.post.fields.angle.placeholder",
        columns: 6,
        schema: z.string().trim().max(120).optional(),
      }),
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.url.label",
        description: "contact.post.fields.url.description",
        placeholder: "contact.post.fields.url.placeholder",
        columns: 6,
        schema: z.string().trim().max(500).optional(),
      }),
      refCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.refCode.label",
        description: "contact.post.fields.refCode.description",
        placeholder: "contact.post.fields.refCode.placeholder",
        columns: 4,
        schema: z.string().trim().max(64).optional(),
      }),
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.channel.label",
        description: "contact.post.fields.channel.description",
        placeholder: "contact.post.fields.channel.placeholder",
        columns: 4,
        schema: z.string().trim().max(100).optional(),
      }),
      campaignLinkId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.campaignLinkId.label",
        description: "contact.post.fields.campaignLinkId.description",
        columns: 4,
        schema: z.uuid().optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "contact.post.fields.notes.label",
        description: "contact.post.fields.notes.description",
        placeholder: "contact.post.fields.notes.placeholder",
        columns: 12,
        schema: z.string().trim().max(4000).optional(),
      }),
      subject: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.subject.label",
        description: "contact.post.fields.subject.description",
        placeholder: "contact.post.fields.subject.placeholder",
        columns: 12,
        schema: z.string().trim().max(300).optional(),
      }),
      direction: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "contact.post.fields.direction.label",
        description: "contact.post.fields.direction.description",
        options: OutreachDirectionOptions,
        columns: 6,
        schema: z.enum(OutreachDirection).default(OutreachDirection.OUT),
      }),
      at: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "contact.post.fields.at.label",
        description: "contact.post.fields.at.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      touchNote: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "contact.post.fields.touchNote.label",
        description: "contact.post.fields.touchNote.description",
        placeholder: "contact.post.fields.touchNote.placeholder",
        columns: 12,
        schema: z.string().trim().max(1000).optional(),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.id",
        schema: z.uuid(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.created",
        schema: z.boolean(),
      }),
      currentStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.status",
        schema: z.enum(OutreachContactStatus),
      }),
      previousStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.previousStatus",
        schema: z.enum(OutreachContactStatus).nullable(),
      }),
      touchLogged: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.touchLogged",
        schema: z.boolean(),
      }),
      contactCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.contactCount",
        schema: z.coerce.number(),
      }),
      warning: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "contact.post.response.warning",
        schema: z.string().nullable(),
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
        email: "partnerships@modelfit.io",
        name: "ModelFit",
        angle: "A-affiliate",
        subject: "A recurring cut for ModelFit",
        status: OutreachContactStatus.SENT,
      },
    },
    responses: {
      default: {
        id: "6f1c2a4e-1b2d-4c3e-8f9a-0b1c2d3e4f50",
        created: true,
        currentStatus: OutreachContactStatus.SENT,
        previousStatus: null,
        touchLogged: true,
        contactCount: 1,
        warning: null,
      },
    },
  },
});

export type OutreachContactUpsertRequestOutput =
  typeof POST.types.RequestOutput;
export type OutreachContactUpsertResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
