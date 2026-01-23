/**
 * IMAP Configuration API Endpoint Definition
 * Defines the API endpoints for IMAP configuration management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { ImapLoggingLevel, ImapLoggingLevelOptions } from "./enum";

/**
 * Get IMAP Configuration Endpoint (GET)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "config"],
  category: "app.api.emails.category" as const,
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.emails.imapClient.config.title" as const,
  description: "app.api.emails.imapClient.config.description" as const,
  icon: "settings",
  tags: ["app.api.emails.imapClient.tags.config" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.config.form.title" as const,
      description: "app.api.emails.imapClient.config.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      // Host field
      host: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.host",
        schema: z.string().min(1),
      }),

      // Port field
      port: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.port",
        schema: z.coerce.number().int().min(1).max(65535),
      }),

      // Username field
      username: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.username",
        schema: z.string().min(1),
      }),

      // Password field
      password: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.password",
        schema: z.string().min(1),
      }),

      // TLS field
      tls: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.tls",
        schema: z.boolean(),
      }),

      // Auto-reconnect field
      autoReconnect: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.autoReconnect",
        schema: z.boolean(),
      }),

      // Logging level field
      loggingLevel: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.loggingLevel",
        schema: z.enum(ImapLoggingLevel),
      }),

      // Server configuration fields
      serverEnabled: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.serverEnabled",
        schema: z.boolean(),
      }),

      maxConnections: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.maxConnections",
        schema: z.coerce.number().int().min(1),
      }),

      connectionTimeout: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.connectionTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      poolIdleTimeout: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.poolIdleTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      keepAlive: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.keepAlive",
        schema: z.boolean(),
      }),

      // Sync configuration fields
      syncEnabled: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.syncEnabled",
        schema: z.boolean(),
      }),

      syncInterval: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.syncInterval",
        schema: z.coerce.number().int().min(1),
      }),

      maxMessages: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.maxMessages",
        schema: z.coerce.number().int().min(1),
      }),

      batchSize: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.batchSize",
        schema: z.coerce.number().int().min(1),
      }),

      concurrentAccounts: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.concurrentAccounts",
        schema: z.coerce.number().int().min(1),
      }),

      // Performance configuration fields
      cacheEnabled: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.cacheEnabled",
        schema: z.boolean(),
      }),

      cacheMaxSize: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.cacheMaxSize",
        schema: z.coerce.number().int().min(1),
      }),

      cacheTtl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.cacheTtl",
        schema: z.coerce.number().int().min(1),
      }),

      memoryThreshold: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.memoryThreshold",
        schema: z.coerce.number().int().min(1),
      }),

      // Resilience configuration fields
      maxRetries: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.maxRetries",
        schema: z.coerce.number().int().min(0),
      }),

      retryDelay: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.retryDelay",
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerThreshold: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.config.response.circuitBreakerThreshold",
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerTimeout: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.config.response.circuitBreakerTimeout",
        schema: z.coerce.number().int().min(1),
      }),

      // Monitoring configuration fields
      healthCheckInterval: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.config.response.healthCheckInterval",
        schema: z.coerce.number().int().min(1),
      }),

      metricsEnabled: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.metricsEnabled",
        schema: z.boolean(),
      }),

      // Development configuration fields
      debugMode: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.debugMode",
        schema: z.boolean(),
      }),

      testMode: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.response.testMode",
        schema: z.boolean(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.config.update.errors.validation.title" as const,
      description:
        "app.api.emails.imapClient.config.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.config.errors.unauthorized.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
  },
  successTypes: {
    title: "app.api.emails.imapClient.config.title" as const,
    description: "app.api.emails.imapClient.config.description" as const,
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
  method: Methods.POST,
  path: ["emails", "imap-client", "config"],
  category: "app.api.emails.category" as const,
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.emails.imapClient.config.update.title" as const,
  description: "app.api.emails.imapClient.config.update.description" as const,
  icon: "settings",
  tags: ["app.api.emails.imapClient.tags.config" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.config.form.title" as const,
      description: "app.api.emails.imapClient.config.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Host field
      host: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.config.serverEnabled.label",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        placeholder:
          "app.api.emails.imapClient.accounts.create.host.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // Port field
      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.maxConnections.label",
        description:
          "app.api.emails.imapClient.config.maxConnections.description",
        placeholder:
          "app.api.emails.imapClient.accounts.create.port.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(65535),
      }),

      // Username field
      username: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.accounts.create.username.label",
        description:
          "app.api.emails.imapClient.accounts.create.username.description",
        placeholder:
          "app.api.emails.imapClient.accounts.create.username.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // Password field
      password: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.emails.imapClient.accounts.create.password.label",
        description:
          "app.api.emails.imapClient.accounts.create.password.description",
        placeholder:
          "app.api.emails.imapClient.accounts.create.password.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      // TLS field
      tls: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.accounts.create.secure.label",
        description:
          "app.api.emails.imapClient.accounts.create.secure.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Auto-reconnect field
      autoReconnect: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.accounts.create.keepAlive.label",
        description:
          "app.api.emails.imapClient.accounts.create.keepAlive.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Logging level field
      loggingLevel: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.imapClient.config.loggingLevel.label",
        description:
          "app.api.emails.imapClient.config.loggingLevel.description",
        options: ImapLoggingLevelOptions,
        columns: 6,
        schema: z.enum(ImapLoggingLevel),
      }),

      // Server configuration fields
      serverEnabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.serverEnabled.label",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      maxConnections: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.maxConnections",
        description:
          "app.api.emails.imapClient.config.maxConnections.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      connectionTimeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.connectionTimeout",
        description:
          "app.api.emails.imapClient.config.connectionTimeout.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      poolIdleTimeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.poolIdleTimeout",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      keepAlive: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.response.keepAlive",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Sync configuration fields
      syncEnabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.syncEnabled.label",
        description: "app.api.emails.imapClient.config.syncEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      syncInterval: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.syncInterval.label",
        description:
          "app.api.emails.imapClient.config.syncInterval.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      maxMessages: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.maxMessages",
        description: "app.api.emails.imapClient.sync.maxMessages.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      batchSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.batchSize",
        description: "app.api.emails.imapClient.config.batchSize.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      concurrentAccounts: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.concurrentAccounts",
        description: "app.api.emails.imapClient.sync.accountIds.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Performance configuration fields
      cacheEnabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.response.cacheEnabled",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      cacheMaxSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.cacheMaxSize",
        description: "app.api.emails.imapClient.config.batchSize.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      cacheTtl: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.cacheTtl",
        description: "app.api.emails.imapClient.config.form.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      memoryThreshold: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.memoryThreshold",
        description: "app.api.emails.imapClient.config.form.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Resilience configuration fields
      maxRetries: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.maxRetries",
        description: "app.api.emails.imapClient.config.response.maxRetries",
        columns: 6,
        schema: z.coerce.number().int().min(0),
      }),

      retryDelay: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.retryDelay",
        description: "app.api.emails.imapClient.config.response.retryDelay",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerThreshold: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.emails.imapClient.config.response.circuitBreakerThreshold",
        description:
          "app.api.emails.imapClient.config.response.circuitBreakerThreshold",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      circuitBreakerTimeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.emails.imapClient.config.response.circuitBreakerTimeout",
        description:
          "app.api.emails.imapClient.config.response.circuitBreakerTimeout",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      // Monitoring configuration fields
      healthCheckInterval: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.config.response.healthCheckInterval",
        description:
          "app.api.emails.imapClient.config.syncInterval.description",
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),

      metricsEnabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.response.metricsEnabled",
        description:
          "app.api.emails.imapClient.config.serverEnabled.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Development configuration fields
      debugMode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.response.debugMode",
        description: "app.api.emails.imapClient.config.debugMode.description",
        columns: 6,
        schema: z.boolean(),
      }),

      testMode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.config.response.testMode",
        description: "app.api.emails.imapClient.config.debugMode.description",
        columns: 6,
        schema: z.boolean(),
      }),

      // Response message
      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.config.update.response.message",
        schema: z.string(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.config.update.errors.validation.title" as const,
      description:
        "app.api.emails.imapClient.config.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.config.errors.unauthorized.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.emails.imapClient.config.errors.internal.description" as const,
    },
  },
  successTypes: {
    title: "app.api.emails.imapClient.config.update.success.title" as const,
    description:
      "app.api.emails.imapClient.config.update.success.description" as const,
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
