/**
 * Help Command Endpoint Definition
 * Production-ready endpoint for displaying help information
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "help"],
  title: "app.api.system.help.post.title",
  description: "app.api.system.help.post.description",
  category: "app.api.system.help.category",
  tags: ["app.api.system.help.tag"],
  icon: "help-circle",
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF, UserRole.PRODUCTION_OFF],
  aliases: ["help", "h"],
  cli: {
    firstCliArgKey: "command",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      command: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.help.fields.command.label",
          description: "app.api.system.help.fields.command.description",
          placeholder: "app.api.system.help.fields.command.placeholder",
          columns: 12,
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      // Header section
      header: objectField(
        {
          type: WidgetType.SECTION,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          title: responseField(
            {
              type: WidgetType.TITLE,
              content: "app.api.system.help.fields.header.title" as const,
            },
            z.string(),
          ),
          description: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.help.fields.header.description" as const,
            },
            z.string().optional(),
          ),
        },
      ),

      // Usage section
      usage: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.system.help.fields.usage.title",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          patterns: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
            },
            responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.fields.usage.patterns.item" as const,
              },
              z.string(),
            ),
          ),
        },
      ),

      // Options section
      options: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.system.help.fields.options.title",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.HORIZONTAL,
              },
              { response: true },
              {
                flag: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.help.fields.options.flag" as const,
                  },
                  z.string(),
                ),
                description: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.help.fields.options.description" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),

      // Examples section
      examples: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.system.help.fields.examples.title",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.HORIZONTAL,
              },
              { response: true },
              {
                command: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.help.fields.examples.command" as const,
                  },
                  z.string(),
                ),
                description: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.help.fields.examples.description" as const,
                  },
                  z.string().optional(),
                ),
              },
            ),
          ),
        },
      ),

      // Common Commands section (only for general help)
      commonCommands: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.system.help.fields.commonCommands.title",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.HORIZONTAL,
              },
              { response: true },
              {
                command: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.help.fields.examples.command" as const,
                  },
                  z.string(),
                ),
                description: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.help.fields.options.description" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),

      // Details section (only for specific command help)
      details: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.system.help.fields.details.title",
          layoutType: LayoutType.GRID,
        },
        { response: true },
        {
          category: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.help.fields.details.category.content" as const,
              label: "app.api.system.help.fields.details.category.content",
            },
            z.string().optional(),
          ),
          path: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.help.fields.details.path.content" as const,
              label: "app.api.system.help.fields.details.path.content",
            },
            z.string().optional(),
          ),
          method: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.help.fields.details.method.content" as const,
              label: "app.api.system.help.fields.details.method.content",
            },
            z.string().optional(),
          ),
          aliases: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.help.fields.details.aliases.content" as const,
              label: "app.api.system.help.fields.details.aliases.content",
            },
            z.string().optional(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.help.post.errors.validation.title",
      description: "app.api.system.help.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.help.post.errors.network.title",
      description: "app.api.system.help.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.help.post.errors.unauthorized.title",
      description: "app.api.system.help.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.help.post.errors.forbidden.title",
      description: "app.api.system.help.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.help.post.errors.notFound.title",
      description: "app.api.system.help.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.help.post.errors.server.title",
      description: "app.api.system.help.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.help.post.errors.unknown.title",
      description: "app.api.system.help.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.help.post.errors.server.title",
      description: "app.api.system.help.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.help.post.errors.conflict.title",
      description: "app.api.system.help.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.help.post.success.title",
    description: "app.api.system.help.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        command: undefined,
      },
      specificCommand: {
        command: "check",
      },
    },
    responses: {
      default: {
        header: {
          title: "Vibe CLI - Next-generation API execution tool",
          description:
            "Command-line interface for Next-Vibe API with real-time execution",
        },
        usage: {
          patterns: ["vibe <command> [options]", "vibe <command> --help"],
        },
        commonCommands: {
          items: [
            { command: "list", description: "List all available commands" },
            { command: "check", description: "Run code quality checks" },
            { command: "db:migrate", description: "Run database migrations" },
            { command: "test", description: "Run test suite" },
          ],
        },
        options: {
          items: [
            { flag: "-d, --data <json>", description: "Pass JSON data" },
            {
              flag: "-o, --output <format>",
              description: "Output format (pretty|json)",
            },
            { flag: "-v, --verbose", description: "Enable verbose output" },
            {
              flag: "-l, --locale <locale>",
              description: "Set locale (en-GLOBAL|de-DE|pl-PL)",
            },
            { flag: "--help", description: "Show this help" },
          ],
        },
        examples: {
          items: [
            { command: "vibe list", description: "List all commands" },
            { command: "vibe check", description: "Run checks" },
            { command: "vibe db:migrate", description: "Run migrations" },
            { command: "vibe help check", description: "Get command help" },
          ],
        },
        details: {
          category: undefined,
          path: undefined,
          method: undefined,
          aliases: undefined,
        },
      },
      specificCommand: {
        header: {
          title: "check - Run comprehensive code quality checks",
          description:
            "Runs linting, type checking, and other code quality tools",
        },
        usage: {
          patterns: ["vibe check [paths] [options]"],
        },
        details: {
          category: "system",
          path: "/system/check",
          method: "POST",
          aliases: "check, c",
        },
        options: {
          items: [
            { flag: "--fix", description: "Automatically fix issues" },
            { flag: "--skip-lint", description: "Skip linting" },
            { flag: "--skip-types", description: "Skip type checking" },
            { flag: "-v, --verbose", description: "Enable verbose output" },
          ],
        },
        examples: {
          items: [
            { command: "vibe check", description: "Run all checks" },
            { command: "vibe check --fix", description: "Fix issues" },
            { command: "vibe c --skip-lint", description: "Skip linting" },
          ],
        },
        commonCommands: {
          items: [
            { command: "list", description: "List all available commands" },
            { command: "check", description: "Run code quality checks" },
            { command: "db:migrate", description: "Run database migrations" },
            { command: "test", description: "Run test suite" },
          ],
        },
      },
    },
  },
});

export type HelpRequestInput = typeof POST.types.RequestInput;
export type HelpRequestOutput = typeof POST.types.RequestOutput;
export type HelpResponseInput = typeof POST.types.ResponseInput;
export type HelpResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
