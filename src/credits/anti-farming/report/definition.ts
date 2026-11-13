/**
 * Anti-Farming Report - Endpoint Definition
 * GET (admin): top subnets by blocked attempts and by free pools claimed,
 * top email domains among duplicate/disposable rejections, active limits.
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
  backButton,
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ANTI_FARMING_REPORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const AntiFarmingReportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AntiFarmingReportWidget })),
);

const subnetRowSchema = z.object({
  subnet: z.string(),
  blocked: z.coerce.number(),
  accountGranted: z.coerce.number(),
  accountBlocked: z.coerce.number(),
  guestGranted: z.coerce.number(),
  guestBlocked: z.coerce.number(),
  lastSeen: z.coerce.date(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits", "anti-farming", "report"],
  aliases: [ANTI_FARMING_REPORT_ALIAS] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "shield" as const,
  category: "credits" as const,
  subCategory: "Management" as const,
  tags: ["tags.antiFarming" as const, "tags.admin" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: AntiFarmingReportWidget,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      days: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.INT,
        label: "get.fields.days.label" as const,
        description: "get.fields.days.description" as const,
        columns: 4,
        schema: z.coerce.number().int().min(1).max(365).default(30),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window" as const,
        schema: z.object({
          days: z.coerce.number(),
          from: z.coerce.date(),
          month: z.string(),
        }),
      }),

      thresholds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.thresholds" as const,
        schema: z.object({
          accountPoolsPerSubnetPerMonth: z.coerce.number(),
          guestPoolsPerSubnetPerDay: z.coerce.number(),
          guestIpPoolWindowHours: z.coerce.number(),
          signupGuestSpendLookbackHours: z.coerce.number(),
          subnetPrefixV4: z.coerce.number(),
          subnetPrefixV6: z.coerce.number(),
        }),
      }),

      totals: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totals" as const,
        schema: z.object({
          total: z.coerce.number(),
          subnetAccountLimit: z.coerce.number(),
          subnetGuestLimit: z.coerce.number(),
          duplicateEmail: z.coerce.number(),
          disposableEmail: z.coerce.number(),
        }),
      }),

      subnetsByBlocked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.subnetsByBlocked" as const,
        schema: z.array(subnetRowSchema),
      }),

      subnetsByClaims: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.subnetsByClaims" as const,
        schema: z.array(subnetRowSchema),
      }),

      emailDomains: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailDomains" as const,
        schema: z.array(
          z.object({
            domain: z.string(),
            duplicate: z.coerce.number(),
            disposable: z.coerce.number(),
            total: z.coerce.number(),
            lastSeen: z.coerce.date(),
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

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
      week: { days: 7 },
    },
    responses: {
      default: {
        window: {
          days: 30,
          from: "2026-10-14T00:00:00.000Z",
          month: "2026-11",
        },
        thresholds: {
          accountPoolsPerSubnetPerMonth: 3,
          guestPoolsPerSubnetPerDay: 5,
          guestIpPoolWindowHours: 24,
          signupGuestSpendLookbackHours: 24,
          subnetPrefixV4: 24,
          subnetPrefixV6: 64,
        },
        totals: {
          total: 12,
          subnetAccountLimit: 4,
          subnetGuestLimit: 5,
          duplicateEmail: 2,
          disposableEmail: 1,
        },
        subnetsByBlocked: [
          {
            subnet: "203.0.113.0/24",
            blocked: 9,
            accountGranted: 3,
            accountBlocked: 4,
            guestGranted: 5,
            guestBlocked: 5,
            lastSeen: "2026-11-13T10:00:00.000Z",
          },
        ],
        subnetsByClaims: [
          {
            subnet: "203.0.113.0/24",
            blocked: 9,
            accountGranted: 3,
            accountBlocked: 4,
            guestGranted: 5,
            guestBlocked: 5,
            lastSeen: "2026-11-13T10:00:00.000Z",
          },
        ],
        emailDomains: [
          {
            domain: "mailinator.com",
            duplicate: 0,
            disposable: 1,
            total: 1,
            lastSeen: "2026-11-12T08:00:00.000Z",
          },
        ],
      },
    },
  },
});

export type AntiFarmingReportResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
