/**
 * POS Order Void API Route Definition
 * Voids an open order
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import posOrderListDefinitions from "@/app/api/[locale]/pos/order/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../../i18n";

const PosOrderVoidWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderVoidWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "void"],
  title: "orderVoid.post.title",
  titleShort: "orderVoid.post.titleShort" as const,
  description: "orderVoid.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.void"],
  allowedRoles: [UserRole.ADMIN],
  icon: "x-circle",

  fields: customWidgetObject({
    render: PosOrderVoidWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      orderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderVoid.post.orderId.label",
        description: "orderVoid.post.orderId.description",
        schema: z.uuid(),
        listEndpoint: posOrderListDefinitions.GET,
        labelField: "id",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderVoid.post.response.id",
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderVoid.post.response.status",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderVoid.post.errors.validation.title",
      description: "orderVoid.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderVoid.post.errors.unauthorized.title",
      description: "orderVoid.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderVoid.post.errors.forbidden.title",
      description: "orderVoid.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderVoid.post.errors.conflict.title",
      description: "orderVoid.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderVoid.post.errors.server.title",
      description: "orderVoid.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderVoid.post.errors.unknown.title",
      description: "orderVoid.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderVoid.post.errors.network.title",
      description: "orderVoid.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderVoid.post.errors.notFound.title",
      description: "orderVoid.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderVoid.post.errors.unsavedChanges.title",
      description: "orderVoid.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderVoid.post.success.title",
    description: "orderVoid.post.success.description",
  },

  examples: {
    requests: {
      default: {
        orderId: "eeff1122-e89b-12d3-a456-426614174003",
      },
    },
    responses: {
      default: {
        result: {
          id: "eeff1122-e89b-12d3-a456-426614174003",
          status: "VOIDED",
        },
      },
    },
  },
});

export type PosOrderVoidPostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
