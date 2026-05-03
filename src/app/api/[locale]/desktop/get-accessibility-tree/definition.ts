/**
 * Desktop GetAccessibilityTree Tool - Definition
 * Retrieve AT-SPI accessibility tree via python3 pyatspi
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

import { scopedTranslation } from "../i18n";

const GetAccessibilityTreeWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GetAccessibilityTreeWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "get-accessibility-tree"],
  title: "get-accessibility-tree.title",
  description: "get-accessibility-tree.description",
  dynamicTitle: ({ request }) => {
    if (request?.appName) {
      return {
        message: "get-accessibility-tree.dynamicTitle" as const,
        messageParams: { app: String(request.appName) },
      };
    }
    return undefined;
  },
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopInspection",
  icon: "layers",
  tags: [
    "get-accessibility-tree.tags.desktopAutomation",
    "get-accessibility-tree.tags.accessibilityAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: GetAccessibilityTreeWidget,
    usage: { request: "data", response: true } as const,
    children: {
      appName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get-accessibility-tree.form.fields.appName.label",
        description: "get-accessibility-tree.form.fields.appName.description",
        placeholder: "get-accessibility-tree.form.fields.appName.placeholder",
        columns: 8,
        schema: z
          .string()
          .optional()
          .describe(
            "Process name or window title to target. Omit to dump the entire desktop accessibility tree.",
          ),
      }),
      maxDepth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get-accessibility-tree.form.fields.maxDepth.label",
        description: "get-accessibility-tree.form.fields.maxDepth.description",
        placeholder: "get-accessibility-tree.form.fields.maxDepth.placeholder",
        columns: 4,
        schema: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .default(5)
          .describe("Maximum tree depth to traverse (default: 5, max: 20)"),
      }),
      includeActions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get-accessibility-tree.form.fields.includeActions.label",
        description:
          "get-accessibility-tree.form.fields.includeActions.description",
        placeholder:
          "get-accessibility-tree.form.fields.includeActions.placeholder",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Include available actions per node (click, press, activate...). Adds detail but increases output size.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.success",
        schema: z
          .boolean()
          .describe("Whether the accessibility tree retrieval succeeded"),
      }),
      tree: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.tree",
        schema: z
          .string()
          .optional()
          .describe("Accessibility tree as structured text"),
      }),
      nodeCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.nodeCount",
        schema: z
          .number()
          .optional()
          .describe("Total number of nodes traversed"),
      }),
      truncated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.truncated",
        schema: z
          .boolean()
          .optional()
          .describe("Whether the query timed out and output may be incomplete"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-accessibility-tree.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      allApps: {},
      specificApp: { appName: "firefox", maxDepth: 3 },
    },
    responses: {
      default: {
        success: true,
        tree: "=== APP: Firefox ===\n  [frame] 'Mozilla Firefox'\n    [tool bar] 'Navigation'\n",
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get-accessibility-tree.errors.validation.title",
      description: "get-accessibility-tree.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get-accessibility-tree.errors.network.title",
      description: "get-accessibility-tree.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get-accessibility-tree.errors.unauthorized.title",
      description: "get-accessibility-tree.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get-accessibility-tree.errors.forbidden.title",
      description: "get-accessibility-tree.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get-accessibility-tree.errors.notFound.title",
      description: "get-accessibility-tree.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get-accessibility-tree.errors.serverError.title",
      description: "get-accessibility-tree.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get-accessibility-tree.errors.unknown.title",
      description: "get-accessibility-tree.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get-accessibility-tree.errors.unsavedChanges.title",
      description: "get-accessibility-tree.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get-accessibility-tree.errors.conflict.title",
      description: "get-accessibility-tree.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get-accessibility-tree.success.title",
    description: "get-accessibility-tree.success.description",
  },
});

export type DesktopGetAccessibilityTreeRequestInput =
  typeof POST.types.RequestInput;
export type DesktopGetAccessibilityTreeRequestOutput =
  typeof POST.types.RequestOutput;
export type DesktopGetAccessibilityTreeResponseInput =
  typeof POST.types.ResponseInput;
export type DesktopGetAccessibilityTreeResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
