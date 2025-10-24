/**
 * Docker Operations Definition
 * API endpoint definition for Docker command execution utilities
 * Following migration guide: Repository-only logic with proper definition structure
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
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Docker Operations Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.db.utils.dockerOperations.title",
  description: "app.api.v1.core.system.db.utils.dockerOperations.description",
  category: "app.api.v1.core.system.db.utils.dockerOperations.category",
  tags: [
    "app.api.v1.core.system.db.utils.dockerOperations.tags.docker",
    "app.api.v1.core.system.db.utils.dockerOperations.tags.utils",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["docker", "docker-utils"],
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "utils", "docker-operations"],
  examples: {
    requests: {
      composeUp: {
        command: "docker compose -f docker-compose-dev.yml up -d",
        options: {
          timeout: 60000,
          hideStandardLogs: true,
          description: "Starting Docker containers...",
        },
      },
      composeDown: {
        command: "docker compose -f docker-compose-dev.yml down",
        options: {
          timeout: 30000,
          hideStandardLogs: true,
          description: "Stopping Docker containers...",
        },
      },
      success: {
        command: "docker ps",
        options: {
          timeout: 5000,
          hideStandardLogs: false,
        },
      },
      failure: {
        command: "docker invalid-command",
        options: {
          timeout: 5000,
        },
      },
    },
    responses: {
      composeUp: {
        success: true,
        output: "Container dev-postgres Started",
      },
      composeDown: {
        success: true,
        output: "Container dev-postgres Stopped",
      },
      success: {
        success: true,
        output: "Container dev-postgres Started",
      },
      failure: {
        success: false,
        output: "Container dev-postgres Failed",
        error: "Docker command failed",
      },
    },
    urlPathVariables: undefined,
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.utils.dockerOperations.container.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      command: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.command.label",
          description:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.command.description",
          placeholder:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.command.placeholder",
          layout: { columns: 12 },
        },
        z.string().min(1).describe("Docker command to execute"),
      ),
      options: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.options.label",
          description:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.options.description",
          placeholder:
            "app.api.v1.core.system.db.utils.dockerOperations.fields.options.placeholder",
          layout: { columns: 12 },
        },
        z
          .object({
            timeout: z.number().optional().describe("Timeout in milliseconds"),
            hideStandardLogs: z
              .boolean()
              .optional()
              .describe("Whether to hide standard Docker logs"),
            description: z
              .string()
              .optional()
              .describe("Description of the operation"),
          })
          .optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.utils.dockerOperations.response.success.label",
        },
        z.boolean().describe("Whether the command executed successfully"),
      ),
      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.utils.dockerOperations.response.output.label",
        },
        z.string().describe("Command output"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.utils.dockerOperations.response.error.label",
        },
        z.string().optional().describe("Error message if command failed"),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.validation.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.timeout.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.timeout.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.title",
      description:
        "app.api.v1.core.system.db.utils.dockerOperations.errors.internal.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.utils.dockerOperations.success.title",
    description:
      "app.api.v1.core.system.db.utils.dockerOperations.success.description",
  },
});

/**
 * Export types for repository to use
 */
export type DockerOperationRequestInput = typeof POST.types.RequestInput;
export type DockerOperationRequestOutput = typeof POST.types.RequestOutput;
export type DockerOperationResponseInput = typeof POST.types.ResponseInput;
export type DockerOperationResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
