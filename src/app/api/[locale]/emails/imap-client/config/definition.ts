/**
 * IMAP Configuration API Endpoint Definition
 * Defines the API endpoints for IMAP configuration management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
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

import { UserRole } from "../../../user/user-roles/enum";
import { ImapLoggingLevel, ImapLoggingLevelOptions } from "./enum";
import { scopedTranslation } from "./i18n";
import { ImapConfigContainer } from "./widget";

/**
 * Get IMAP Configuration Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "config"],
  category: "app.endpointCategories.email",
  allowedRoles: [UserRole.ADMIN],

  title: "title" as const,
  description: "description" as const,
  icon: "settings",
  tags: ["tags.config" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.title" as const,
    description: "form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      // Host field
      host: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.host",
        schema: z.string().min(1),
      }),

      // Port field
      port: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.port",
        schema: z.coerce.number().int().min(1).max(65535),
      }),

      // Username field
      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.username",
        schema: z.string().min(1),
      }),

      // Password field
      password: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.password",
        schema: z.string().min(1),
      }),

      // TLS field
      tls: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.tls",
        schema: z.boolean(),
      }),

      // Auto-reconnect field
      autoReconnect: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.autoReconnect",
        schema: z.boolean(),
      }),

      // Logging level field
      loggingLevel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.loggingLevel",
        schema: z.enum(ImapLoggingLevel),
      }),

      // Server configuration fields
      serverEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.serverEnabled",
        schema: z.boolean(),
      }),

      maxConnections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.maxConnections",
        schema: z.coerce.number().int().min(1),
      }),

      connectionTimeout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.connectionTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      poolIdleTimeout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.poolIdleTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      keepAlive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.keepAlive",
        schema: z.boolean(),
      }),

      // Sync configuration fields
      syncEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.syncEnabled",
        schema: z.boolean(),
      }),

      syncInterval: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.syncInterval",
        schema: z.coerce.number().int().min(1),
      }),

      maxMessages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.maxMessages",
        schema: z.coerce.number().int().min(1),
      }),

      batchSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.batchSize",
        schema: z.coerce.number().int().min(1),
      }),

      concurrentAccounts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.concurrentAccounts",
        schema: z.coerce.number().int().min(1),
      }),

      // Performance configuration fields
      cacheEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cacheEnabled",
        schema: z.boolean(),
      }),

      cacheMaxSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cacheMaxSize",
        schema: z.coerce.number().int().min(1),
      }),

      cacheTtl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.cacheTtl",
        schema: z.coerce.number().int().min(1),
      }),

      memoryThreshold: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.memoryThreshold",
        schema: z.coerce.number().int().min(1),
      }),

      // Resilience configuration fields
      maxRetries: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.maxRetries",
        schema: z.coerce.number().int().min(0),
      }),

      retryDelay: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.retryDelay",
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerThreshold: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.circuitBreakerThreshold",
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerTimeout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.circuitBreakerTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      // Monitoring configuration fields
      healthCheckInterval: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.healthCheckInterval",
        schema: z.coerce.number().int().min(1),
      }),

      metricsEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.metricsEnabled",
        schema: z.boolean(),
      }),

      // Development configuration fields
      debugMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.debugMode",
        schema: z.boolean(),
      }),

      testMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.testMode",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.errors.validation.title" as const,
      description: "update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
  },
  successTypes: {
    title: "title" as const,
    description: "description" as const,
  },

  examples: {
    responses: {
      default: {
        host: "imap.gmail.com",
        port: 993,
        username: "user@gmail.com",
        password: "app-password",
        tls: true,
        autoReconnect: true,
        loggingLevel: ImapLoggingLevel.INFO,
        serverEnabled: true,
        maxConnections: 5,
        connectionTimeout: 30000,
        poolIdleTimeout: 60000,
        keepAlive: true,
        syncEnabled: true,
        syncInterval: 300000,
        maxMessages: 1000,
        batchSize: 100,
        concurrentAccounts: 3,
        cacheEnabled: true,
        cacheMaxSize: 10000,
        cacheTtl: 3600000,
        memoryThreshold: 80,
        maxRetries: 3,
        retryDelay: 1000,
        circuitBreakerThreshold: 5,
        circuitBreakerTimeout: 60000,
        healthCheckInterval: 30000,
        metricsEnabled: true,
        debugMode: false,
        testMode: false,
      },
      minimal: {
        host: "mail.company.com",
        port: 143,
        username: "admin@company.com",
        password: "secure-pass",
        tls: false,
        autoReconnect: false,
        loggingLevel: ImapLoggingLevel.ERROR,
        serverEnabled: false,
        maxConnections: 1,
        connectionTimeout: 10000,
        poolIdleTimeout: 30000,
        keepAlive: false,
        syncEnabled: false,
        syncInterval: 600000,
        maxMessages: 100,
        batchSize: 10,
        concurrentAccounts: 1,
        cacheEnabled: false,
        cacheMaxSize: 1000,
        cacheTtl: 1800000,
        memoryThreshold: 90,
        maxRetries: 0,
        retryDelay: 5000,
        circuitBreakerThreshold: 10,
        circuitBreakerTimeout: 120000,
        healthCheckInterval: 60000,
        metricsEnabled: false,
        debugMode: true,
        testMode: true,
      },
    },
  },
});

/**
 * Update IMAP Configuration Endpoint (POST)
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "config"],
  category: "app.endpointCategories.email",
  allowedRoles: [UserRole.ADMIN],

  title: "update.title" as const,
  description: "update.description" as const,
  icon: "settings",
  tags: ["tags.config" as const],

  fields: customWidgetObject({
    render: ImapConfigContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // Host field
      host: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "serverEnabled.label",
        description: "serverEnabled.description",
        placeholder: "accounts.create.host.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // Port field
      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "maxConnections.label",
        description: "maxConnections.description",
        placeholder: "accounts.create.port.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(65535),
      }),

      // Username field
      username: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accounts.create.username.label",
        description: "accounts.create.username.description",
        placeholder: "accounts.create.username.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // Password field
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "accounts.create.password.label",
        description: "accounts.create.password.description",
        placeholder: "accounts.create.password.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // TLS field
      tls: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "accounts.create.secure.label",
        description: "accounts.create.secure.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Auto-reconnect field
      autoReconnect: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "accounts.create.keepAlive.label",
        description: "accounts.create.keepAlive.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Logging level field
      loggingLevel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "loggingLevel.label",
        description: "loggingLevel.description",
        options: ImapLoggingLevelOptions,
        columns: 6,
        schema: z.enum(ImapLoggingLevel),
      }),

      // Server configuration fields
      serverEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "serverEnabled.label",
        description: "serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      maxConnections: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.maxConnections",
        description: "maxConnections.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      connectionTimeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.connectionTimeout",
        description: "connectionTimeout.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      poolIdleTimeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.poolIdleTimeout",
        description: "serverEnabled.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      keepAlive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "response.keepAlive",
        description: "serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Sync configuration fields
      syncEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "syncEnabled.label",
        description: "syncEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      syncInterval: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "syncInterval.label",
        description: "syncInterval.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      maxMessages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.maxMessages",
        description: "sync.maxMessages.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.batchSize",
        description: "batchSize.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      concurrentAccounts: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.concurrentAccounts",
        description: "sync.accountIds.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Performance configuration fields
      cacheEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "response.cacheEnabled",
        description: "serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      cacheMaxSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.cacheMaxSize",
        description: "batchSize.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      cacheTtl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.cacheTtl",
        description: "form.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      memoryThreshold: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.memoryThreshold",
        description: "form.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Resilience configuration fields
      maxRetries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.maxRetries",
        description: "response.maxRetries",
        columns: 6,
        schema: z.coerce.number().int().min(0),
      }),

      retryDelay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.retryDelay",
        description: "response.retryDelay",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerThreshold: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.circuitBreakerThreshold",
        description: "response.circuitBreakerThreshold",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerTimeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.circuitBreakerTimeout",
        description: "response.circuitBreakerTimeout",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Monitoring configuration fields
      healthCheckInterval: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "response.healthCheckInterval",
        description: "syncInterval.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      metricsEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "response.metricsEnabled",
        description: "serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Development configuration fields
      debugMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "response.debugMode",
        description: "debugMode.description",
        columns: 6,
        schema: z.boolean(),
      }),

      testMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "response.testMode",
        description: "debugMode.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Response message
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "update.response.message",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.errors.validation.title" as const,
      description: "update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
  },
  successTypes: {
    title: "update.success.title" as const,
    description: "update.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        host: "imap.gmail.com",
        port: 993,
        username: "user@gmail.com",
        password: "app-password",
        tls: true,
        autoReconnect: true,
        loggingLevel: ImapLoggingLevel.INFO,
        serverEnabled: true,
        maxConnections: 5,
        connectionTimeout: 30000,
        poolIdleTimeout: 60000,
        keepAlive: true,
        syncEnabled: true,
        syncInterval: 300000,
        maxMessages: 1000,
        batchSize: 100,
        concurrentAccounts: 3,
        cacheEnabled: true,
        cacheMaxSize: 10000,
        cacheTtl: 3600000,
        memoryThreshold: 80,
        maxRetries: 3,
        retryDelay: 1000,
        circuitBreakerThreshold: 5,
        circuitBreakerTimeout: 60000,
        healthCheckInterval: 30000,
        metricsEnabled: true,
        debugMode: false,
        testMode: false,
      },
      minimal: {
        host: "mail.company.com",
        port: 143,
        username: "admin@company.com",
        password: "secure-pass",
        tls: false,
        autoReconnect: false,
        loggingLevel: ImapLoggingLevel.ERROR,
        serverEnabled: false,
        maxConnections: 1,
        connectionTimeout: 10000,
        poolIdleTimeout: 30000,
        keepAlive: false,
        syncEnabled: false,
        syncInterval: 600000,
        maxMessages: 100,
        batchSize: 10,
        concurrentAccounts: 1,
        cacheEnabled: false,
        cacheMaxSize: 1000,
        cacheTtl: 1800000,
        memoryThreshold: 90,
        maxRetries: 0,
        retryDelay: 5000,
        circuitBreakerThreshold: 10,
        circuitBreakerTimeout: 120000,
        healthCheckInterval: 60000,
        metricsEnabled: false,
        debugMode: true,
        testMode: true,
      },
    },
    responses: {
      default: {
        message: "IMAP configuration updated successfully",
      },
      minimal: {
        message: "IMAP configuration updated successfully",
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
const definitions = {
  GET,
  POST,
} as const;
export default definitions;
