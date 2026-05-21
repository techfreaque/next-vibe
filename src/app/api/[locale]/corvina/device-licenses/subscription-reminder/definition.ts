import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const SubscriptionReminderContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionReminderContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "subscription-reminder"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaDeviceSubscriptions",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_subscription_reminder"],

  fields: customWidgetObject({
    render: SubscriptionReminderContainer,
    usage: { response: true } as const,
    children: {
      checked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.checked" as const,
        schema: z.number(),
      }),
      reminded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.reminded" as const,
        schema: z.number(),
      }),
      errors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          content: "post.response.errors.item" as const,
          schema: z.string(),
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        checked: 9,
        reminded: 2,
        errors: [],
      },
    },
  },
});

export type SubscriptionReminderPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
