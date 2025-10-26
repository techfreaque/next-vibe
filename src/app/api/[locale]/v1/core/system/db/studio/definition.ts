/**
 * Open database studio Endpoint Definition
 * Production-ready endpoint for opening database studio
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "studio"],
  title: "app.api.v1.core.system.db.studio.post.title",
  description: "app.api.v1.core.system.db.studio.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.studio.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["studio", "db:studio"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.studio.post.form.title",
      description: "app.api.v1.core.system.db.studio.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.system.db.studio.fields.port.title",
          description:
            "app.api.v1.core.system.db.studio.fields.port.description",
          layout: { columns: 6 },
          validation: {
            min: 3000,
            max: 9999,
          },
        },
        z.string().optional().default("5555"),
      ),

      openBrowser: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.studio.fields.openBrowser.title",
          description:
            "app.api.v1.core.system.db.studio.fields.openBrowser.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(true),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.studio.fields.success.title",
        },
        z.boolean(),
      ),

      url: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.studio.fields.url.title",
        },
        z.string(),
      ),

      portUsed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.studio.fields.portUsed.title",
        },
        z.number(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.studio.fields.output.title",
        },
        z.string(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.studio.fields.duration.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.db.studio.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.db.studio.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.studio.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.studio.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.db.studio.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.studio.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.studio.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.studio.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.studio.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.studio.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.studio.post.success.title",
    description: "app.api.v1.core.system.db.studio.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        port: "5555",
        openBrowser: true,
      },
      customPort: {
        port: "8080",
        openBrowser: false,
      },
      noBrowser: {
        port: "5555",
        openBrowser: false,
      },
    },
    responses: {
      default: {
        success: true,
        url: "http://localhost:5555",
        portUsed: 5555,
        output: "✅ Database Studio opened at http://localhost:5555",
        duration: 1200,
      },
      customPort: {
        success: true,
        url: "http://localhost:8080",
        portUsed: 8080,
        output:
          "✅ Database Studio opened at http://localhost:8080 (browser not opened)",
        duration: 800,
      },
      noBrowser: {
        success: true,
        url: "http://localhost:5555",
        portUsed: 5555,
        output: "✅ Database Studio started at http://localhost:5555",
        duration: 600,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type StudioRequestInput = typeof POST.types.RequestInput;
export type StudioRequestOutput = typeof POST.types.RequestOutput;
export type StudioResponseInput = typeof POST.types.ResponseInput;
export type StudioResponseOutput = typeof POST.types.ResponseOutput;
