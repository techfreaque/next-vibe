/**
 * Outreach CRM - Dashboard Definition
 * GET: contacts with status / angle / last contact (filterable, paged),
 * status counts, reply rate per angle family, and paid deals with spend
 * against the visits, signups, paying users and revenue they brought.
 * Every request field is optional so CLI/MCP calls work with zero args.
 * Client+server safe. No server imports.
 */

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
  OutreachAngleGroup,
  OutreachAttributionBasis,
  OutreachContactKind,
  OutreachContactKindOptions,
  OutreachContactStatus,
  OutreachContactStatusOptions,
  OutreachDealStatus,
} from "../enum";
import { outreachErrorTypes } from "../errors";
import { scopedTranslation } from "../i18n";
import {
  OUTREACH_CRM_ALIAS,
  OUTREACH_CRM_DEFAULT_LIMIT,
  OUTREACH_CRM_MAX_LIMIT,
} from "./constants";

const OutreachCrmWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OutreachCrmWidget })),
);

const moneySchema = z.object({
  currency: z.enum(CurrenciesArr),
  amountCents: z.coerce.number(),
});

const contactRowSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  kind: z.enum(OutreachContactKind),
  url: z.string().nullable(),
  angle: z.string().nullable(),
  status: z.enum(OutreachContactStatus),
  firstContactAt: z.coerce.date().nullable(),
  lastContactAt: z.coerce.date().nullable(),
  lastReplyAt: z.coerce.date().nullable(),
  lastSubject: z.string().nullable(),
  contactCount: z.coerce.number(),
  notes: z.string().nullable(),
  refCode: z.string().nullable(),
  channel: z.string().nullable(),
});

const dealRowSchema = z.object({
  id: z.uuid(),
  contactId: z.uuid(),
  contactName: z.string(),
  contactEmail: z.string(),
  deliverable: z.string(),
  amountCents: z.coerce.number(),
  currency: z.enum(CurrenciesArr),
  status: z.enum(OutreachDealStatus),
  channel: z.string().nullable(),
  campaignLinkId: z.uuid().nullable(),
  utmCampaign: z.string().nullable(),
  refCode: z.string().nullable(),
  notes: z.string().nullable(),
  liveAt: z.coerce.date().nullable(),
  paidAt: z.coerce.date().nullable(),
  basis: z.enum(OutreachAttributionBasis),
  /** Raw clicks on the campaign link, null without a link */
  linkVisits: z.coerce.number().nullable(),
  /** Journeys (visitors) matched to the deal */
  visitors: z.coerce.number(),
  signups: z.coerce.number(),
  paying: z.coerce.number(),
  revenue: z.array(moneySchema),
  costPerSignupCents: z.coerce.number().nullable(),
  costPerPayingCents: z.coerce.number().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "outreach", "crm"],
  title: "crm.get.title",
  titleShort: "crm.get.titleShort",
  description: "crm.get.description",
  icon: "mail",
  category: "leads",
  subCategory: "outreach",
  tags: ["tags.outreach", "tags.crm"],
  aliases: [OUTREACH_CRM_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: OutreachCrmWidget,
    usage: { request: "data", response: true } as const,
    children: {
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "crm.get.fields.status.label",
        description: "crm.get.fields.status.description",
        options: OutreachContactStatusOptions,
        columns: 4,
        schema: z.enum(OutreachContactStatus).optional(),
      }),
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "crm.get.fields.kind.label",
        description: "crm.get.fields.kind.description",
        options: OutreachContactKindOptions,
        columns: 4,
        schema: z.enum(OutreachContactKind).optional(),
      }),
      angle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "crm.get.fields.angle.label",
        description: "crm.get.fields.angle.description",
        placeholder: "crm.get.fields.angle.placeholder",
        columns: 4,
        schema: z.string().trim().max(60).optional(),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "crm.get.fields.search.label",
        description: "crm.get.fields.search.description",
        placeholder: "crm.get.fields.search.placeholder",
        columns: 12,
        schema: z.string().trim().max(200).optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "crm.get.fields.page.label",
        description: "crm.get.fields.page.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).default(1),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "crm.get.fields.limit.label",
        description: "crm.get.fields.limit.description",
        columns: 6,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(OUTREACH_CRM_MAX_LIMIT)
          .default(OUTREACH_CRM_DEFAULT_LIMIT),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "crm.get.response.summary",
        schema: z.object({
          total: z.coerce.number(),
          answered: z.coerce.number(),
          matching: z.coerce.number(),
          page: z.coerce.number(),
          pageCount: z.coerce.number(),
          limit: z.coerce.number(),
          byStatus: z.array(
            z.object({
              status: z.enum(OutreachContactStatus),
              count: z.coerce.number(),
            }),
          ),
        }),
      }),
      angles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "crm.get.response.angles",
        schema: z.array(
          z.object({
            group: z.enum(OutreachAngleGroup),
            contacts: z.coerce.number(),
            answered: z.coerce.number(),
          }),
        ),
      }),
      contacts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "crm.get.response.contacts",
        schema: z.array(contactRowSchema),
      }),
      deals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "crm.get.response.deals",
        schema: z.array(dealRowSchema),
      }),
      dealTotals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "crm.get.response.dealTotals",
        schema: z.array(
          z.object({
            currency: z.enum(CurrenciesArr),
            paidCents: z.coerce.number(),
            committedCents: z.coerce.number(),
          }),
        ),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

  errorTypes: outreachErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {},
      replied: { status: OutreachContactStatus.REPLIED },
    },
    responses: {
      default: {
        summary: {
          total: 1,
          answered: 1,
          matching: 1,
          page: 1,
          pageCount: 1,
          limit: OUTREACH_CRM_DEFAULT_LIMIT,
          byStatus: [{ status: OutreachContactStatus.DEAL, count: 1 }],
        },
        angles: [
          {
            group: OutreachAngleGroup.AUDIENCE_FIT,
            contacts: 1,
            answered: 1,
          },
        ],
        contacts: [
          {
            id: "6f1c2a4e-1b2d-4c3e-8f9a-0b1c2d3e4f50",
            name: "MoeMoe",
            email: "youtube@paradoxa.ai",
            kind: OutreachContactKind.CREATOR,
            url: null,
            angle: "B-audience-fit",
            status: OutreachContactStatus.DEAL,
            firstContactAt: new Date("2026-11-09T00:11:59Z"),
            lastContactAt: new Date("2026-11-10T00:00:00Z"),
            lastReplyAt: new Date("2026-11-10T00:00:00Z"),
            lastSubject: "Re: Sponsorship rates",
            contactCount: 5,
            notes: null,
            refCode: "moemoe",
            channel: "youtube",
          },
        ],
        deals: [
          {
            id: "7a2b3c4d-5e6f-4a1b-9c2d-3e4f5a6b7c80",
            contactId: "6f1c2a4e-1b2d-4c3e-8f9a-0b1c2d3e4f50",
            contactName: "MoeMoe",
            contactEmail: "youtube@paradoxa.ai",
            deliverable: "YouTube integration",
            amountCents: 55000,
            currency: "USD",
            status: OutreachDealStatus.PAID,
            channel: "youtube",
            campaignLinkId: null,
            utmCampaign: "moemoe-2026-11-14",
            refCode: "moemoe",
            notes: null,
            liveAt: new Date("2026-11-14T00:00:00Z"),
            paidAt: new Date("2026-11-10T00:00:00Z"),
            basis: OutreachAttributionBasis.TRACKED,
            linkVisits: null,
            visitors: 120,
            signups: 14,
            paying: 2,
            revenue: [{ currency: "USD", amountCents: 1600 }],
            costPerSignupCents: 3929,
            costPerPayingCents: 27500,
          },
        ],
        dealTotals: [{ currency: "USD", paidCents: 55000, committedCents: 0 }],
      },
      replied: {
        summary: {
          total: 0,
          answered: 0,
          matching: 0,
          page: 1,
          pageCount: 1,
          limit: OUTREACH_CRM_DEFAULT_LIMIT,
          byStatus: [],
        },
        angles: [],
        contacts: [],
        deals: [],
        dealTotals: [],
      },
    },
  },
});

export type OutreachCrmRequestOutput = typeof GET.types.RequestOutput;
export type OutreachCrmResponseOutput = typeof GET.types.ResponseOutput;
export type OutreachContactRow = OutreachCrmResponseOutput["contacts"][number];
export type OutreachDealRow = OutreachCrmResponseOutput["deals"][number];

const definitions = { GET };
export default definitions;
