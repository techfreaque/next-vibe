/**
 * Chat Threads Search API Definition
 * Defines endpoint for searching threads with relevance scoring
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ThreadStatus, ThreadStatusOptions } from "../../enum";

/**
 * Search Threads Endpoint (GET)
 * Searches threads with relevance scoring and snippet extraction
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "threads", "search"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.threads.search.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.search.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.search.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === SEARCH QUERY ===
      query: requestDataField(
        {
          type: WidgetType.TEXT_INPUT,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.fields.query.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.fields.query.description" as const,
          dataType: FieldDataType.STRING,
          layout: { type: LayoutType.STACKED },
        },
        z.string().min(1).max(500),
      ),

      // === OPTIONAL FILTERS ===
      folderId: requestDataField(
        {
          type: WidgetType.TEXT_INPUT,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.fields.folderId.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.fields.folderId.description" as const,
          dataType: FieldDataType.STRING,
          layout: { type: LayoutType.STACKED },
        },
        z.string().uuid().nullable(),
      ),

      status: requestDataField(
        {
          type: WidgetType.SELECT,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.fields.status.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.fields.status.description" as const,
          dataType: FieldDataType.ENUM,
          layout: { type: LayoutType.STACKED },
          options: ThreadStatusOptions,
        },
        z.nativeEnum(ThreadStatus).nullable(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.NUMBER_INPUT,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.fields.limit.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.fields.limit.description" as const,
          dataType: FieldDataType.NUMBER,
          layout: { type: LayoutType.STACKED },
        },
        z.number().int().min(1).max(100).default(20),
      ),

      // === RESPONSE ===
      results: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.fields.results.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.fields.results.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.title" as const,
            description:
              "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.description" as const,
            layout: { type: LayoutType.STACKED },
          },
          { request: false, response: true },
          {
            // Thread data
            threadId: responseField(
              {
                type: WidgetType.TEXT_INPUT,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.threadId.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.threadId.description" as const,
                dataType: FieldDataType.STRING,
                layout: { type: LayoutType.STACKED },
              },
              z.string().uuid(),
            ),

            title: responseField(
              {
                type: WidgetType.TEXT_INPUT,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.title.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.title.description" as const,
                dataType: FieldDataType.STRING,
                layout: { type: LayoutType.STACKED },
              },
              z.string(),
            ),

            score: responseField(
              {
                type: WidgetType.NUMBER_INPUT,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.score.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.score.description" as const,
                dataType: FieldDataType.NUMBER,
                layout: { type: LayoutType.STACKED },
              },
              z.number(),
            ),

            matchedMessages: responseArrayField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.description" as const,
                layout: { type: LayoutType.STACKED },
              },
              objectField(
                {
                  type: WidgetType.CONTAINER,
                  title:
                    "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.title" as const,
                  description:
                    "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.description" as const,
                  layout: { type: LayoutType.STACKED },
                },
                { request: false, response: true },
                {
                  messageId: responseField(
                    {
                      type: WidgetType.TEXT_INPUT,
                      title:
                        "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.messageId.title" as const,
                      description:
                        "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.messageId.description" as const,
                      dataType: FieldDataType.STRING,
                      layout: { type: LayoutType.STACKED },
                    },
                    z.string().uuid(),
                  ),

                  snippet: responseField(
                    {
                      type: WidgetType.TEXT_INPUT,
                      title:
                        "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.snippet.title" as const,
                      description:
                        "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.matchedMessages.item.snippet.description" as const,
                      dataType: FieldDataType.STRING,
                      layout: { type: LayoutType.STACKED },
                    },
                    z.string(),
                  ),
                },
              ),
            ),

            createdAt: responseField(
              {
                type: WidgetType.TEXT_INPUT,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.createdAt.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.createdAt.description" as const,
                dataType: FieldDataType.STRING,
                layout: { type: LayoutType.STACKED },
              },
              z.string(),
            ),

            updatedAt: responseField(
              {
                type: WidgetType.TEXT_INPUT,
                title:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.updatedAt.title" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.fields.results.item.updatedAt.description" as const,
                dataType: FieldDataType.STRING,
                layout: { type: LayoutType.STACKED },
              },
              z.string(),
            ),
          },
        ),
      ),
    },
  ),

  successTypes: [
    {
      title: "app.api.v1.core.agent.chat.threads.search.get.success.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.success.description",
    },
  ],

  errors: [
    {
      type: EndpointErrorTypes.VALIDATION_FAILED,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.validationFailed.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.validationFailed.description",
    },
    {
      type: EndpointErrorTypes.NETWORK_ERROR,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.networkError.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.networkError.description",
    },
    {
      type: EndpointErrorTypes.UNAUTHORIZED,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unauthorized.description",
    },
    {
      type: EndpointErrorTypes.FORBIDDEN,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.forbidden.description",
    },
    {
      type: EndpointErrorTypes.NOT_FOUND,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.notFound.description",
    },
    {
      type: EndpointErrorTypes.SERVER_ERROR,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.serverError.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.serverError.description",
    },
    {
      type: EndpointErrorTypes.UNKNOWN_ERROR,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unknownError.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unknownError.description",
    },
    {
      type: EndpointErrorTypes.UNSAVED_CHANGES,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unsavedChanges.description",
    },
    {
      type: EndpointErrorTypes.CONFLICT,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.conflict.description",
    },
  ],
});

const definitions = { GET };
export default definitions;

