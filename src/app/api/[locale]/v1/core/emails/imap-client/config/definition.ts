/**
 * IMAP Configuration API Endpoint Definition
 * Defines the API endpoints for IMAP configuration management
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
import { ImapLoggingLevel, ImapLoggingLevelOptions } from "./enum";

/**
 * Get IMAP Configuration Endpoint (GET)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "imap-client", "config"],
  category: "app.api.v1.core.emails.category" as const,
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.emails.imapClient.config.title" as const,
  description: "app.api.v1.core.emails.imapClient.config.description" as const,
  tags: ["app.api.v1.core.emails.imapClient.tags.config" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.config.form.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // Host field
      host: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.host",
        },
        z.string().min(1),
      ),

      // Port field
      port: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.port",
        },
        z.number().int().min(1).max(65535),
      ),

      // Username field
      username: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.username",
        },
        z.string().min(1),
      ),

      // Password field
      password: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.password",
        },
        z.string().min(1),
      ),

      // TLS field
      tls: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.tls",
        },
        z.boolean(),
      ),

      // Auto-reconnect field
      autoReconnect: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.autoReconnect",
        },
        z.boolean(),
      ),

      // Logging level field
      loggingLevel: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.loggingLevel",
        },
        z.enum(ImapLoggingLevel),
      ),

      // Server configuration fields
      serverEnabled: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.serverEnabled",
        },
        z.boolean(),
      ),

      maxConnections: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.maxConnections",
        },
        z.number().int().min(1),
      ),

      connectionTimeout: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.connectionTimeout",
        },
        z.number().int().min(1),
      ),

      poolIdleTimeout: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.poolIdleTimeout",
        },
        z.number().int().min(1),
      ),

      keepAlive: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.keepAlive",
        },
        z.boolean(),
      ),

      // Sync configuration fields
      syncEnabled: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.syncEnabled",
        },
        z.boolean(),
      ),

      syncInterval: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.syncInterval",
        },
        z.number().int().min(1),
      ),

      maxMessages: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.maxMessages",
        },
        z.number().int().min(1),
      ),

      batchSize: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.batchSize",
        },
        z.number().int().min(1),
      ),

      concurrentAccounts: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.concurrentAccounts",
        },
        z.number().int().min(1),
      ),

      // Performance configuration fields
      cacheEnabled: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.cacheEnabled",
        },
        z.boolean(),
      ),

      cacheMaxSize: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.cacheMaxSize",
        },
        z.number().int().min(1),
      ),

      cacheTtl: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.cacheTtl",
        },
        z.number().int().min(1),
      ),

      memoryThreshold: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.memoryThreshold",
        },
        z.number().int().min(1),
      ),

      // Resilience configuration fields
      maxRetries: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.maxRetries",
        },
        z.number().int().min(0),
      ),

      retryDelay: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.retryDelay",
        },
        z.number().int().min(1),
      ),

      circuitBreakerThreshold: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerThreshold",
        },
        z.number().int().min(1),
      ),

      circuitBreakerTimeout: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerTimeout",
        },
        z.number().int().min(1),
      ),

      // Monitoring configuration fields
      healthCheckInterval: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.healthCheckInterval",
        },
        z.number().int().min(1),
      ),

      metricsEnabled: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.metricsEnabled",
        },
        z.boolean(),
      ),

      // Development configuration fields
      debugMode: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.response.debugMode",
        },
        z.boolean(),
      ),

      testMode: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.emails.imapClient.config.response.testMode",
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
  },
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.config.title" as const,
    description:
      "app.api.v1.core.emails.imapClient.config.description" as const,
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
  path: ["v1", "core", "emails", "imap-client", "config"],
  category: "app.api.v1.core.emails.category" as const,
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.emails.imapClient.config.update.title" as const,
  description:
    "app.api.v1.core.emails.imapClient.config.update.description" as const,
  tags: ["app.api.v1.core.emails.imapClient.tags.config" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.config.form.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // Host field
      host: requestDataField(
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
        z.string().min(1),
      ),

      // Port field
      port: requestDataField(
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
        z.number().int().min(1).max(65535),
      ),

      // Username field
      username: requestDataField(
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
        z.string().min(1),
      ),

      // Password field
      password: requestDataField(
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
        z.string().min(1),
      ),

      // TLS field
      tls: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.secure.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.secure.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      // Auto-reconnect field
      autoReconnect: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      // Logging level field
      loggingLevel: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.imapClient.config.loggingLevel.label",
          description:
            "app.api.v1.core.emails.imapClient.config.loggingLevel.description",
          options: ImapLoggingLevelOptions,
          layout: { columns: 6 },
        },
        z.enum(ImapLoggingLevel),
      ),

      // Server configuration fields
      serverEnabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.serverEnabled.label",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      maxConnections: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.maxConnections",
          description:
            "app.api.v1.core.emails.imapClient.config.maxConnections.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      connectionTimeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.connectionTimeout",
          description:
            "app.api.v1.core.emails.imapClient.config.connectionTimeout.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      poolIdleTimeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.poolIdleTimeout",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      keepAlive: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.response.keepAlive",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      // Sync configuration fields
      syncEnabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.syncEnabled.label",
          description:
            "app.api.v1.core.emails.imapClient.config.syncEnabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      syncInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.syncInterval.label",
          description:
            "app.api.v1.core.emails.imapClient.config.syncInterval.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      maxMessages: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.maxMessages",
          description:
            "app.api.v1.core.emails.imapClient.sync.maxMessages.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      batchSize: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.response.batchSize",
          description:
            "app.api.v1.core.emails.imapClient.config.batchSize.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      concurrentAccounts: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.concurrentAccounts",
          description:
            "app.api.v1.core.emails.imapClient.sync.accountIds.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      // Performance configuration fields
      cacheEnabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.config.response.cacheEnabled",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      cacheMaxSize: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.cacheMaxSize",
          description:
            "app.api.v1.core.emails.imapClient.config.batchSize.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      cacheTtl: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.response.cacheTtl",
          description:
            "app.api.v1.core.emails.imapClient.config.form.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      memoryThreshold: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.memoryThreshold",
          description:
            "app.api.v1.core.emails.imapClient.config.form.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      // Resilience configuration fields
      maxRetries: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.response.maxRetries",
          description:
            "app.api.v1.core.emails.imapClient.config.response.maxRetries",
          layout: { columns: 6 },
        },
        z.number().int().min(0),
      ),

      retryDelay: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.config.response.retryDelay",
          description:
            "app.api.v1.core.emails.imapClient.config.response.retryDelay",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      circuitBreakerThreshold: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerThreshold",
          description:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerThreshold",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      circuitBreakerTimeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerTimeout",
          description:
            "app.api.v1.core.emails.imapClient.config.response.circuitBreakerTimeout",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      // Monitoring configuration fields
      healthCheckInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.emails.imapClient.config.response.healthCheckInterval",
          description:
            "app.api.v1.core.emails.imapClient.config.syncInterval.description",
          layout: { columns: 6 },
        },
        z.number().int().min(1),
      ),

      metricsEnabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.imapClient.config.response.metricsEnabled",
          description:
            "app.api.v1.core.emails.imapClient.config.serverEnabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      // Development configuration fields
      debugMode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.response.debugMode",
          description:
            "app.api.v1.core.emails.imapClient.config.debugMode.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      testMode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.config.response.testMode",
          description:
            "app.api.v1.core.emails.imapClient.config.debugMode.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      // Response message
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.config.update.response.message",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.config.errors.internal.title" as const,
      description:
        "app.api.v1.core.emails.imapClient.config.errors.internal.description" as const,
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.emails.imapClient.config.update.success.title" as const,
    description:
      "app.api.v1.core.emails.imapClient.config.update.success.description" as const,
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

export { GET, POST };
export default definitions;
