/**
 * SMTP Account Create API Definition
 * Create new SMTP accounts
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../user/user-roles/enum";
import {
  SmtpAccountStatus,
  SmtpHealthStatus,
  SmtpSecurityType,
  SmtpSecurityTypeOptions,
} from "../enum";

/**
 * POST endpoint definition - Create SMTP account
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "smtp-client", "create"],
  title: "app.api.v1.core.emails.smtpClient.create.title",
  description: "app.api.v1.core.emails.smtpClient.create.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.smtpClient.create.container.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.container.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === ACCOUNT INFORMATION ===
      accountInfo: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.emails.smtpClient.create.accountInfo.title",
          description:
            "app.api.v1.core.emails.smtpClient.create.accountInfo.description",
          layout: { type: LayoutType.STACKED },
        },
        { request: "data" },
        {
          name: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.emails.smtpClient.create.name.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.name.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.name.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          description: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.v1.core.emails.smtpClient.create.accountDescription.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.accountDescription.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.accountDescription.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              helpText:
                "app.api.v1.core.emails.smtpClient.create.accountDescription.help",
              rows: 3,
            },
            z.string().optional(),
          ),
        },
      ),

      // === SERVER CONFIGURATION ===
      serverConfig: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.emails.smtpClient.create.serverConfig.title",
          description:
            "app.api.v1.core.emails.smtpClient.create.serverConfig.description",
          layout: { type: LayoutType.GRID_3_COLUMNS },
        },
        { request: "data" },
        {
          host: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.emails.smtpClient.create.host.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.host.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.host.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          port: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.emails.smtpClient.create.port.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.port.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.port.placeholder",
              layout: { type: LayoutType.INLINE },
              validation: { required: true, min: 1, max: 65535 },
            },
            z.number().min(1).max(65535),
          ),

          securityType: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.emails.smtpClient.create.securityType.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.securityType.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.securityType.placeholder",
              layout: { type: LayoutType.INLINE },
              options: SmtpSecurityTypeOptions,
              validation: { required: true },
              helpText:
                "app.api.v1.core.emails.smtpClient.create.securityType.help",
            },
            z.nativeEnum(SmtpSecurityType),
          ),
        },
      ),

      // === AUTHENTICATION ===
      authentication: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title:
            "app.api.v1.core.emails.smtpClient.create.authentication.title",
          description:
            "app.api.v1.core.emails.smtpClient.create.authentication.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          username: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.emails.smtpClient.create.username.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.username.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.username.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.v1.core.emails.smtpClient.create.password.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.password.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.password.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
              helpText:
                "app.api.v1.core.emails.smtpClient.create.password.help",
            },
            z.string().min(1),
          ),
        },
      ),

      // === EMAIL CONFIGURATION ===
      emailConfig: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.emails.smtpClient.create.emailConfig.title",
          description:
            "app.api.v1.core.emails.smtpClient.create.emailConfig.description",
          layout: { type: LayoutType.STACKED },
        },
        { request: "data" },
        {
          fromEmail: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.v1.core.emails.smtpClient.create.fromEmail.label",
              description:
                "app.api.v1.core.emails.smtpClient.create.fromEmail.description",
              placeholder:
                "app.api.v1.core.emails.smtpClient.create.fromEmail.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
              helpText:
                "app.api.v1.core.emails.smtpClient.create.fromEmail.help",
            },
            z.email(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.smtpClient.create.response.account.title",
          description:
            "app.api.v1.core.emails.smtpClient.create.response.account.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          // === ACCOUNT SUMMARY ===
          accountSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.smtpClient.create.response.accountSummary.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.id",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.id.label",
                },
                z.uuid(),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.name",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.name.label",
                },
                z.string(),
              ),
              description: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.accountDescription",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.accountDescription.label",
                },
                z.string().optional(),
              ),
              status: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.smtpClient.create.response.account.status",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.status.label",
                },
                z.nativeEnum(SmtpAccountStatus),
              ),
            },
          ),

          // === CONNECTION DETAILS ===
          connectionDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.smtpClient.create.response.connectionDetails.title",
              layout: { type: LayoutType.GRID_3_COLUMNS },
            },
            { response: true },
            {
              host: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.host",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.host.label",
                },
                z.string(),
              ),
              port: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.port",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.port.label",
                },
                z.number().int(),
              ),
              securityType: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.smtpClient.create.response.account.securityType",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.securityType.label",
                },
                z.nativeEnum(SmtpSecurityType),
              ),
              username: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.username",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.username.label",
                },
                z.string(),
              ),
              fromEmail: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.fromEmail",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.fromEmail.label",
                },
                z.email(),
              ),
              healthCheckStatus: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.smtpClient.create.response.account.healthCheckStatus",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.healthCheckStatus.label",
                },
                z.nativeEnum(SmtpHealthStatus).nullable(),
              ),
            },
          ),

          // === PERFORMANCE METRICS ===
          performanceMetrics: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.smtpClient.create.response.performanceMetrics.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
            },
            { response: true },
            {
              priority: responseField(
                {
                  type: WidgetType.BADGE,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.priority",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.priority.label",
                },
                z.number().int().optional(),
              ),
              totalEmailsSent: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.totalEmailsSent",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.totalEmailsSent.label",
                },
                z.number().int(),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.createdAt",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.createdAt.label",
                },
                z.string().datetime(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.smtpClient.create.response.account.updatedAt",
                  label:
                    "app.api.v1.core.emails.smtpClient.create.response.account.updatedAt.label",
                },
                z.string().datetime(),
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.validation.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.smtpClient.create.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.conflict.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.server.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.unknown.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.network.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.smtpClient.create.errors.notFound.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.smtpClient.create.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.smtpClient.create.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.smtpClient.create.success.title",
    description: "app.api.v1.core.emails.smtpClient.create.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        accountInfo: {
          name: "Marketing Campaign SMTP",
          description: "Primary SMTP account for marketing email campaigns",
        },
        serverConfig: {
          host: "smtp.example.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
        },
        authentication: {
          username: "campaigns@example.com",
          password: "secure_app_password",
        },
        emailConfig: {
          fromEmail: "campaigns@example.com",
        },
      },
      gmail: {
        accountInfo: {
          name: "Gmail SMTP",
          description: "Gmail SMTP configuration for transactional emails",
        },
        serverConfig: {
          host: "smtp.gmail.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
        },
        authentication: {
          username: "yourapp@gmail.com",
          password: "app-specific-password",
        },
        emailConfig: {
          fromEmail: "yourapp@gmail.com",
        },
      },
    },
    responses: {
      default: {
        account: {
          accountSummary: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Marketing Campaign SMTP",
            description: "Primary SMTP account for marketing email campaigns",
            status: SmtpAccountStatus.ACTIVE,
          },
          connectionDetails: {
            host: "smtp.example.com",
            port: 587,
            securityType: SmtpSecurityType.STARTTLS,
            username: "campaigns@example.com",
            fromEmail: "campaigns@example.com",
            healthCheckStatus: SmtpHealthStatus.HEALTHY,
          },
          performanceMetrics: {
            priority: 10,
            totalEmailsSent: 0,
            createdAt: "2024-01-07T12:00:00.000Z",
            updatedAt: "2024-01-07T12:00:00.000Z",
          },
        },
      },
      withIssues: {
        account: {
          accountSummary: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Test SMTP Account",
            description: "Testing SMTP configuration",
            status: SmtpAccountStatus.TESTING,
          },
          connectionDetails: {
            host: "smtp.testserver.com",
            port: 587,
            securityType: SmtpSecurityType.STARTTLS,
            username: "test@testserver.com",
            fromEmail: "test@testserver.com",
            healthCheckStatus: SmtpHealthStatus.UNHEALTHY,
          },
          performanceMetrics: {
            priority: 5,
            totalEmailsSent: 0,
            createdAt: "2024-01-07T12:05:00.000Z",
            updatedAt: "2024-01-07T12:05:00.000Z",
          },
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type SmtpAccountCreateRequestInput = typeof POST.types.RequestInput;
export type SmtpAccountCreateRequestOutput = typeof POST.types.RequestOutput;
export type SmtpAccountCreateResponseInput = typeof POST.types.ResponseInput;
export type SmtpAccountCreateResponseOutput = typeof POST.types.ResponseOutput;

// Export repository types for import standardization
// Repository types for standardized import patterns
export type SmtpAccountCreateRequestTypeInput = SmtpAccountCreateRequestInput;
export type SmtpAccountCreateRequestTypeOutput = SmtpAccountCreateRequestOutput;
export type SmtpAccountCreateResponseTypeInput = SmtpAccountCreateResponseInput;
export type SmtpAccountCreateResponseTypeOutput =
  SmtpAccountCreateResponseOutput;

const definitions = {
  POST,
};

export default definitions;
