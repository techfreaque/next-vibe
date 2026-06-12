/**
 * Vendor Deactivate API Route Definition
 * POST — soft-deactivate a vendor
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
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

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import vendorListDefinitions from "@/app/api/[locale]/purchasing/vendor/list/definition";
import { scopedTranslation } from "../../../i18n";

const VendorDeactivateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VendorDeactivateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "vendor", "[vendorId]", "deactivate"],
  title: "vendorDeactivate.post.title" as const,
  titleShort: "vendorDeactivate.post.titleShort" as const,
  description: "vendorDeactivate.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Vendors",
  icon: "file" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.vendor" as const,
    "tags.deactivate" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: VendorDeactivateWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      vendorId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "vendorDeactivate.post.vendorId.label" as const,
        description: "vendorDeactivate.post.vendorId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: vendorListDefinitions.GET,
        labelField: "name",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorDeactivate.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorDeactivate.post.response.isActive" as const,
            schema: z.boolean(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "vendorDeactivate.post.errors.validation.title" as const,
      description:
        "vendorDeactivate.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "vendorDeactivate.post.errors.unauthorized.title" as const,
      description:
        "vendorDeactivate.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "vendorDeactivate.post.errors.forbidden.title" as const,
      description:
        "vendorDeactivate.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "vendorDeactivate.post.errors.conflict.title" as const,
      description: "vendorDeactivate.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "vendorDeactivate.post.errors.server.title" as const,
      description: "vendorDeactivate.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "vendorDeactivate.post.errors.unknown.title" as const,
      description: "vendorDeactivate.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "vendorDeactivate.post.errors.network.title" as const,
      description: "vendorDeactivate.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "vendorDeactivate.post.errors.notFound.title" as const,
      description: "vendorDeactivate.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "vendorDeactivate.post.errors.unsavedChanges.title" as const,
      description:
        "vendorDeactivate.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "vendorDeactivate.post.success.title" as const,
    description: "vendorDeactivate.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { vendorId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          isActive: false,
        },
      },
    },
  },
});

export type VendorDeactivateRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST } as const;
export default definitions;
