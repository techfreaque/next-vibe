/**
 * Help List Command Endpoint Definition
 * Production-ready endpoint for listing all available CLI commands
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

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "help", "list"],
  title: "app.api.system.help.list.post.title",
  description: "app.api.system.help.list.post.description",
  category: "app.api.system.help.category",
  tags: ["app.api.system.help.list.tag"],
  icon: "info",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["list", "ls", "commands"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.help.list.fields.category.label",
          description: "app.api.system.help.list.fields.category.description",
          placeholder: "app.api.system.help.list.fields.category.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.system.help.list.fields.format.label",
          description: "app.api.system.help.list.fields.format.description",
          columns: 6,
          options: [
            {
              value: "tree",
              label: "app.api.system.help.list.fields.format.options.tree",
            },
            {
              value: "flat",
              label: "app.api.system.help.list.fields.format.options.flat",
            },
            {
              value: "json",
              label: "app.api.system.help.list.fields.format.options.json",
            },
          ],
        },
        z.enum(["tree", "flat", "json"]).optional().default("tree"),
      ),

      showAliases: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.help.list.fields.showAliases.label",
          description:
            "app.api.system.help.list.fields.showAliases.description",
          columns: 6,
        },
        z.boolean().optional().default(true),
      ),

      showDescriptions: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.help.list.fields.showDescriptions.label",
          description:
            "app.api.system.help.list.fields.showDescriptions.description",
          columns: 6,
        },
        z.boolean().optional().default(true),
      ),

      // === RESPONSE FIELDS ===
      // Note: success and totalCommands are hidden internal fields
      // They're used for response tracking but not rendered in CLI output

      commands: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "category",
          sortBy: "alias",
          hierarchical: true,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.HORIZONTAL,
          },
          { response: true },
          {
            alias: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.alias" as const,
              },
              z.string(),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.message" as const,
              },
              z.string(),
            ),
            description: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.description" as const,
              },
              z.string().optional(),
            ),
            category: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.category" as const,
              },
              z.string(),
            ),
            aliases: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.aliases" as const,
              },
              z.string().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.help.list.fields.commands.rule" as const,
              },
              z.string(),
            ),
          },
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.help.list.post.errors.validation.title",
      description:
        "app.api.system.help.list.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.help.list.post.errors.network.title",
      description: "app.api.system.help.list.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.help.list.post.errors.unauthorized.title",
      description:
        "app.api.system.help.list.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.help.list.post.errors.forbidden.title",
      description: "app.api.system.help.list.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.help.list.post.errors.notFound.title",
      description: "app.api.system.help.list.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.help.list.post.errors.server.title",
      description: "app.api.system.help.list.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.help.list.post.errors.unknown.title",
      description: "app.api.system.help.list.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.help.list.post.errors.server.title",
      description: "app.api.system.help.list.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.help.list.post.errors.conflict.title",
      description: "app.api.system.help.list.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.help.list.post.success.title",
    description: "app.api.system.help.list.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        format: "tree",
        showAliases: true,
        showDescriptions: true,
      },
      treeFormat: {
        format: "tree",
        showAliases: true,
        showDescriptions: true,
      },
      flatFormat: {
        format: "flat",
        showAliases: true,
        showDescriptions: false,
      },
      jsonFormat: {
        format: "json",
        showAliases: true,
        showDescriptions: true,
      },
      byCategory: {
        category: "system",
        format: "tree",
        showAliases: true,
        showDescriptions: true,
      },
    },
    responses: {
      default: {
        commands: [
          {
            alias: "check",
            message: "Run comprehensive code quality checks",
            category: "system",
            description: "Run comprehensive code quality checks",
            aliases: "check, c",
            rule: "check",
          },
          {
            alias: "db:ping",
            message: "Check database connectivity",
            category: "database",
            description: "Check database connectivity",
            aliases: "ping, db:ping",
            rule: "db:ping",
          },
          {
            alias: "lead:create",
            message: "Create a new lead",
            category: "leads",
            description: "Create a new lead",
            aliases: "lead:create",
            rule: "lead:create",
          },
        ],
      },
      treeFormat: {
        commands: [
          {
            alias: "check",
            message: "check",
            category: "system",
            description: "Run comprehensive code quality checks",
            aliases: "check, c",
            rule: "check",
          },
          {
            alias: "db:migrate",
            message: "db:migrate",
            category: "system",
            description: "Run database migrations",
            aliases: "migrate",
            rule: "db:migrate",
          },
        ],
      },
      flatFormat: {
        commands: [
          {
            alias: "check",
            message: "check",
            category: "system",
            aliases: "check, c",
            rule: "check",
          },
          {
            alias: "db:migrate",
            message: "db:migrate",
            category: "system",
            aliases: "migrate",
            rule: "db:migrate",
          },
        ],
      },
      jsonFormat: {
        commands: [
          {
            alias: "check",
            message: "check",
            category: "system",
            description: "Run comprehensive code quality checks",
            aliases: "check, c",
            rule: "check",
          },
        ],
      },
      byCategory: {
        commands: [
          {
            alias: "check",
            message: "check",
            category: "system",
            description: "Run comprehensive code quality checks",
            aliases: "check, c",
            rule: "check",
          },
          {
            alias: "db:ping",
            message: "db:ping",
            category: "system",
            description: "Check database connectivity",
            aliases: "ping, db:ping",
            rule: "db:ping",
          },
        ],
      },
    },
  },
});

export type HelpListRequestInput = typeof POST.types.RequestInput;
export type HelpListRequestOutput = typeof POST.types.RequestOutput;
export type HelpListResponseInput = typeof POST.types.ResponseInput;
export type HelpListResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
