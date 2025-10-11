/**
 * SMTP Account Edit API Definition
 * Edit existing SMTP accounts
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "../../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlParamsField,
  responseField,
} from "../../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  SmtpAccountStatus,
  SmtpHealthStatus,
  SmtpSecurityType,
  SmtpSecurityTypeOptions,
} from "../../enum";

const { GET, PUT } = createEndpoint({
  method: Methods.GET, // Use single method for GET
  path: ["v1", "core", "emails", "smtp-client", "edit", "[id]"],
  title: "app.api.v1.core.emails.smtpClient.edit.title",
  description: "app.api.v1.core.emails.smtpClient.edit.description",
  category: "app.api.v1.core.emails.smtpClient.category",
  tags: ["app.api.v1.core.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.smtpClient.edit.container.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // === URL PARAMETER ===
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.id.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.id.description",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // === REQUEST DATA FIELDS (for PUT) ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.name.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.name.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.name.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
        z.string().min(1).optional(),
      ),

      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.emails.smtpClient.edit.fields.description.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.description.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.description.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
        z.string().optional(),
      ),

      host: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.host.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.host.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.host.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1).optional(),
      ),

      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.port.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.port.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.port.placeholder",
          layout: { columns: 6 },
        },
        z.number().min(1).max(65535).optional(),
      ),

      securityType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.smtpClient.edit.fields.securityType.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.securityType.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.securityType.placeholder",
          layout: { columns: 6 },
          options: SmtpSecurityTypeOptions,
        },
        z.nativeEnum(SmtpSecurityType).optional(),
      ),

      username: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.username.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.username.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.username.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1).optional(),
      ),

      password: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PASSWORD,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.password.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.password.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.password.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1).optional(),
      ),

      fromEmail: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.emails.smtpClient.edit.fields.fromEmail.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.fromEmail.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.fromEmail.placeholder",
          layout: { columns: 6 },
        },
        z.email().optional(),
      ),

      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.smtpClient.edit.fields.priority.label",
          description:
            "app.api.v1.core.emails.smtpClient.edit.fields.priority.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.edit.fields.priority.placeholder",
          layout: { columns: 6 },
        },
        z.number().int().min(1).max(100).optional(),
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.smtpClient.edit.response.account.title",
          description:
            "app.api.v1.core.emails.smtpClient.edit.response.account.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.id",
            },
            z.uuid(),
          ),
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.name",
            },
            z.string(),
          ),
          description: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.description",
            },
            z.string().optional(),
          ),
          host: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.host",
            },
            z.string(),
          ),
          port: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.port",
            },
            z.number().int(),
          ),
          securityType: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.smtpClient.edit.response.account.securityType",
            },
            z.nativeEnum(SmtpSecurityType),
          ),
          username: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.username",
            },
            z.string(),
          ),
          fromEmail: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.fromEmail",
            },
            z.email(),
          ),
          status: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.smtpClient.edit.response.account.status",
            },
            z.nativeEnum(SmtpAccountStatus),
          ),
          healthCheckStatus: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.smtpClient.edit.response.account.healthCheckStatus",
            },
            z.nativeEnum(SmtpHealthStatus).nullable(),
          ),
          priority: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.priority",
            },
            z.number().int().optional(),
          ),
          totalEmailsSent: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.totalEmailsSent",
            },
            z.number().int(),
          ),
          lastUsedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.lastUsedAt",
            },
            z.string().datetime().nullable(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.createdAt",
            },
            z.string().datetime(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.edit.response.account.updatedAt",
            },
            z.string().datetime(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.validation.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.notFound.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.conflict.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.server.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.edit.errors.unknown.title",
      description:
        "app.api.v1.core.emails.smtpClient.edit.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.smtpClient.edit.success.title",
    description: "app.api.v1.core.emails.smtpClient.edit.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      get: {
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
      update: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Updated Campaign SMTP",
        description: "Updated SMTP account for marketing campaigns",
        priority: 15,
      },
    },
    responses: {
      get: {
        account: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Campaign SMTP",
          description: "SMTP account for marketing campaigns",
          host: "smtp.example.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
          username: "campaigns@example.com",
          fromEmail: "campaigns@example.com",
          status: SmtpAccountStatus.ACTIVE,
          healthCheckStatus: SmtpHealthStatus.HEALTHY,
          priority: 10,
          totalEmailsSent: 15000,
          lastUsedAt: "2024-01-07T11:45:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-07T10:00:00.000Z",
        },
      },
      update: {
        account: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Updated Campaign SMTP",
          description: "Updated SMTP account for marketing campaigns",
          host: "smtp.example.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
          username: "campaigns@example.com",
          fromEmail: "campaigns@example.com",
          status: SmtpAccountStatus.ACTIVE,
          healthCheckStatus: SmtpHealthStatus.HEALTHY,
          priority: 15,
          totalEmailsSent: 15000,
          lastUsedAt: "2024-01-07T11:45:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-07T12:30:00.000Z",
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type SmtpAccountEditGETRequestInput = typeof GET.types.RequestInput;
export type SmtpAccountEditGETRequestOutput = typeof GET.types.RequestOutput;
export type SmtpAccountEditGETResponseInput = typeof GET.types.ResponseInput;
export type SmtpAccountEditGETResponseOutput = typeof GET.types.ResponseOutput;

export type SmtpAccountEditPUTRequestInput = typeof PUT.types.RequestInput;
export type SmtpAccountEditPUTRequestOutput = typeof PUT.types.RequestOutput;
export type SmtpAccountEditPUTResponseInput = typeof PUT.types.ResponseInput;
export type SmtpAccountEditPUTResponseOutput = typeof PUT.types.ResponseOutput;

// Legacy export types for compatibility
export type SmtpAccountEditRequestInput = SmtpAccountEditPUTRequestInput;
export type SmtpAccountEditRequestOutput = SmtpAccountEditPUTRequestOutput;
export type SmtpAccountEditResponseInput = SmtpAccountEditPUTResponseInput;
export type SmtpAccountEditResponseOutput = SmtpAccountEditPUTResponseOutput;

// Export repository types for import standardization
export type SmtpAccountEditGetRequestTypeOutput =
  SmtpAccountEditGETRequestOutput;
export type SmtpAccountEditGetResponseTypeOutput =
  SmtpAccountEditGETResponseOutput;
export type SmtpAccountEditPutRequestTypeOutput =
  SmtpAccountEditPUTRequestOutput;
export type SmtpAccountEditPutResponseTypeOutput =
  SmtpAccountEditPUTResponseOutput;

const smtpAccountEditEndpoints = { GET, PUT };
export default smtpAccountEditEndpoints;
