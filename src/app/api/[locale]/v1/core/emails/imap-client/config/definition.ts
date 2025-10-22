/**
 * IMAP Configuration API Endpoint Definition
 * Defines the API endpoints for IMAP configuration management using createFormEndpoint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create-form-endpoint";
import {
  field,
  objectField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../user/user-roles/enum";
import { ImapLoggingLevel, ImapLoggingLevelOptions } from "./enum";

/**
 * IMAP Configuration form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "emails", "imap-client", "config"],
  category: "app.api.v1.core.emails.category",
  allowedRoles: [UserRole.ADMIN],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.emails.imapClient.config.title",
      description: "app.api.v1.core.emails.imapClient.config.description",
      tags: ["app.api.v1.core.emails.imapClient.tags.config"],
    },
    POST: {
      title: "app.api.v1.core.emails.imapClient.config.update.title",
      description:
        "app.api.v1.core.emails.imapClient.config.update.description",
      tags: ["app.api.v1.core.emails.imapClient.tags.config"],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.config.form.title",
      description: "app.api.v1.core.emails.imapClient.config.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Host field
      host: field(
        z.string().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.imapClient.config.serverEnabled.label",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.create.host.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Port field
      port: field(
        z.number().int().min(1).max(65535),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.maxConnections.label",
          description:
            "app.api.v1.core.emails.imapClient.config.maxConnections.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.create.port.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Username field
      username: field(
        z.string().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.username.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.username.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.create.username.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Password field
      password: field(
        z.string().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PASSWORD,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.password.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.password.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.create.password.placeholder",
          layout: { columns: 6 },
        },
      ),

      // TLS field
      tls: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.secure.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.secure.description",
          layout: { columns: 6 },
        },
      ),

      // Auto-reconnect field
      autoReconnect: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.description",
          layout: { columns: 6 },
        },
      ),

      // Logging level field
      loggingLevel: field(
        z.enum(ImapLoggingLevel),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.imapClient.config.loggingLevel.label",
          description:
            "app.api.v1.core.emails.imapClient.config.loggingLevel.description",
          options: ImapLoggingLevelOptions,
          layout: { columns: 6 },
        },
      ),

      // Server configuration fields
      serverEnabled: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.server.enabled",
          description: "app.api.v1.core.emails.imapClient.config.server.enabled.description",
          layout: { columns: 6 },
        },
      ),

      maxConnections: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.server.maxConnections",
          description: "app.api.v1.core.emails.imapClient.config.server.maxConnections.description",
          layout: { columns: 6 },
        },
      ),

      connectionTimeout: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.server.connectionTimeout",
          description: "app.api.v1.core.emails.imapClient.config.server.connectionTimeout.description",
          layout: { columns: 6 },
        },
      ),

      poolIdleTimeout: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.server.poolIdleTimeout",
          description: "app.api.v1.core.emails.imapClient.config.server.poolIdleTimeout.description",
          layout: { columns: 6 },
        },
      ),

      keepAlive: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.server.keepAlive",
          description: "app.api.v1.core.emails.imapClient.config.server.keepAlive.description",
          layout: { columns: 6 },
        },
      ),

      // Sync configuration fields
      syncEnabled: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.sync.enabled",
          description: "app.api.v1.core.emails.imapClient.config.sync.enabled.description",
          layout: { columns: 6 },
        },
      ),

      syncInterval: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.sync.interval",
          description: "app.api.v1.core.emails.imapClient.config.sync.interval.description",
          layout: { columns: 6 },
        },
      ),

      maxMessages: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.sync.maxMessages",
          description: "app.api.v1.core.emails.imapClient.config.sync.maxMessages.description",
          layout: { columns: 6 },
        },
      ),

      batchSize: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.sync.batchSize",
          description: "app.api.v1.core.emails.imapClient.config.sync.batchSize.description",
          layout: { columns: 6 },
        },
      ),

      concurrentAccounts: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.sync.concurrentAccounts",
          description: "app.api.v1.core.emails.imapClient.config.sync.concurrentAccounts.description",
          layout: { columns: 6 },
        },
      ),

      // Performance configuration fields
      cacheEnabled: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.performance.cacheEnabled",
          description: "app.api.v1.core.emails.imapClient.config.performance.cacheEnabled.description",
          layout: { columns: 6 },
        },
      ),

      cacheMaxSize: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.performance.cacheMaxSize",
          description: "app.api.v1.core.emails.imapClient.config.performance.cacheMaxSize.description",
          layout: { columns: 6 },
        },
      ),

      cacheTtl: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.performance.cacheTtl",
          description: "app.api.v1.core.emails.imapClient.config.performance.cacheTtl.description",
          layout: { columns: 6 },
        },
      ),

      memoryThreshold: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.performance.memoryThreshold",
          description: "app.api.v1.core.emails.imapClient.config.performance.memoryThreshold.description",
          layout: { columns: 6 },
        },
      ),

      // Resilience configuration fields
      maxRetries: field(
        z.number().int().min(0),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.resilience.maxRetries",
          description: "app.api.v1.core.emails.imapClient.config.resilience.maxRetries.description",
          layout: { columns: 6 },
        },
      ),

      retryDelay: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.resilience.retryDelay",
          description: "app.api.v1.core.emails.imapClient.config.resilience.retryDelay.description",
          layout: { columns: 6 },
        },
      ),

      circuitBreakerThreshold: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.resilience.circuitBreakerThreshold",
          description: "app.api.v1.core.emails.imapClient.config.resilience.circuitBreakerThreshold.description",
          layout: { columns: 6 },
        },
      ),

      circuitBreakerTimeout: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.resilience.circuitBreakerTimeout",
          description: "app.api.v1.core.emails.imapClient.config.resilience.circuitBreakerTimeout.description",
          layout: { columns: 6 },
        },
      ),

      // Monitoring configuration fields
      healthCheckInterval: field(
        z.number().int().min(1),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.monitoring.healthCheckInterval",
          description: "app.api.v1.core.emails.imapClient.config.monitoring.healthCheckInterval.description",
          layout: { columns: 6 },
        },
      ),

      metricsEnabled: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.monitoring.metricsEnabled",
          description: "app.api.v1.core.emails.imapClient.config.monitoring.metricsEnabled.description",
          layout: { columns: 6 },
        },
      ),

      // Development configuration fields
      debugMode: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.development.debugMode",
          description: "app.api.v1.core.emails.imapClient.config.development.debugMode.description",
          layout: { columns: 6 },
        },
      ),

      testMode: field(
        z.boolean(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.development.testMode",
          description: "app.api.v1.core.emails.imapClient.config.development.testMode.description",
          layout: { columns: 6 },
        },
      ),

      // Response message - only for POST
      message: field(
        z.string(),
        {
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.update.response.message",
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.imapClient.config.errors.internal.title",
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.config.title",
    description: "app.api.v1.core.emails.imapClient.config.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          username: "user@gmail.com",
          password: "app-password",
          tls: true,
          autoReconnect: true,
          loggingLevel: ImapLoggingLevel.INFO,
        },
        minimal: {
          host: "mail.company.com",
          port: 143,
          username: "admin@company.com",
          password: "secure-pass",
          tls: false,
          autoReconnect: false,
          loggingLevel: ImapLoggingLevel.ERROR,
        },
      },
    },
    POST: {
      requests: {
        default: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          username: "user@gmail.com",
          password: "app-password",
          tls: true,
          autoReconnect: true,
          loggingLevel: ImapLoggingLevel.INFO,
        },
        minimal: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          username: "user@gmail.com",
          password: "app-password",
          tls: true,
          autoReconnect: true,
          loggingLevel: ImapLoggingLevel.INFO,
        },
      },
      responses: {
        default: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          username: "user@gmail.com",
          password: "app-password",
          tls: true,
          autoReconnect: true,
          loggingLevel: ImapLoggingLevel.INFO,
          message: "IMAP configuration updated successfully",
        },
        minimal: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          username: "user@gmail.com",
          password: "app-password",
          tls: true,
          autoReconnect: true,
          loggingLevel: ImapLoggingLevel.INFO,
          message: "IMAP configuration updated successfully",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type ImapConfigGetRequestInput = typeof GET.types.RequestInput;
export type ImapConfigGetRequestOutput = typeof GET.types.RequestOutput;
export type ImapConfigGetResponseInput = typeof GET.types.ResponseInput;
export type ImapConfigGetResponseOutput = typeof GET.types.ResponseOutput;

export type ImapConfigPostRequestInput = typeof POST.types.RequestInput;
export type ImapConfigPostRequestOutput = typeof POST.types.RequestOutput;
export type ImapConfigPostResponseInput = typeof POST.types.ResponseInput;
export type ImapConfigPostResponseOutput = typeof POST.types.ResponseOutput;

// Legacy type exports for repository compatibility
export type ConfigGetRequestOutput = ImapConfigGetRequestOutput;
export type ConfigGetResponseOutput = ImapConfigGetResponseOutput;
export type ConfigUpdateRequestOutput = ImapConfigPostRequestOutput;
export type ConfigUpdateResponseOutput = ImapConfigPostResponseOutput;

/**
 * Export definitions
 */
const imapConfigDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default imapConfigDefinition;
