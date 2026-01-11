/**
 * Characters API Definition
 * Defines endpoint for listing characters
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  navigateButtonField,
  objectField,
  responseArrayField,
  responseField,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../shared/types/common.schema";
import {
  DELETE as CharacterDELETE,
  GET as CharacterGET,
  PATCH as CharacterPATCH,
} from "./[id]/definition";
import { POST as CharacterPOST } from "./create/definition";
import { CharacterCategoryDB } from "./enum";

/**
 * Get Characters List Endpoint (GET)
 * Retrieves all characters (default + custom) for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "characters"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.characters.get.title" as const,
  description: "app.api.agent.chat.characters.get.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      noCard: true,
      gap: "6",
    },
    { response: true },
    {
      // Top action buttons container (widget object field - pure UI, no response data)
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        {},
        {
          backButton: backButton(),
          createButton: navigateButtonField({
            targetEndpoint: CharacterPOST,
            extractParams: () => ({}),
            prefillFromGet: false,
            label: "app.api.agent.chat.characters.get.createButton.label" as const,
            icon: "plus",
            variant: "default",
          }),
        },
      ),

      // Separator between buttons and content (widget field - pure UI)
      separator: widgetField(
        {
          type: WidgetType.SEPARATOR,
          spacingTop: SpacingSize.RELAXED,
          spacingBottom: SpacingSize.RELAXED,
        },
        {},
      ),

      // Sections array
      sections: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          gap: "6",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.STACKED,
            gap: "4",
            noCard: true,
          },
          { response: true },
          {
            sectionHeader: objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.INLINE,
                gap: "2",
                noCard: true,
              },
              { response: true },
              {
                icon: responseField(
                  { type: WidgetType.ICON, iconSize: "sm", noHover: true },
                  iconSchema,
                ),
                title: responseField(
                  { type: WidgetType.TEXT, size: "lg", emphasis: "bold" },
                  z.string() as z.ZodType<TranslationKey>,
                ),
                count: responseField({ type: WidgetType.BADGE }, z.number()),
              },
            ),
            characters: responseArrayField(
              {
                type: WidgetType.DATA_CARDS,
                layout: { type: LayoutType.GRID, columns: 1, spacing: "normal" },
                maxItems: 3,
              },
              objectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.INLINE,
                  gap: "4",
                  alignItems: "start",
                  noCard: true,
                },
                { response: true },
                {
                  id: responseField({ type: WidgetType.TEXT, hidden: true }, z.string()),
                  category: responseField(
                    { type: WidgetType.TEXT, hidden: true },
                    z.enum(CharacterCategoryDB),
                  ),
                  icon: responseField(
                    {
                      type: WidgetType.ICON,
                      containerSize: "lg",
                      iconSize: "base",
                      borderRadius: "lg",
                    },
                    iconSchema,
                  ),
                  content: objectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.STACKED,
                      gap: "1",
                      noCard: true,
                    },
                    { response: true },
                    {
                      name: responseField(
                        {
                          type: WidgetType.TEXT,
                          size: "base",
                          emphasis: "bold",
                        },
                        z.string() as z.ZodType<TranslationKey>,
                      ),
                      description: responseField(
                        { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                        z.string() as z.ZodType<TranslationKey>,
                      ),
                      tagline: responseField(
                        { type: WidgetType.TEXT, size: "xs", variant: "muted" },
                        z.string() as z.ZodType<TranslationKey>,
                      ),
                      modelRow: objectField(
                        {
                          type: WidgetType.CONTAINER,
                          layoutType: LayoutType.INLINE,
                          gap: "1",
                          noCard: true,
                        },
                        { response: true },
                        {
                          modelIcon: responseField(
                            {
                              type: WidgetType.ICON,
                              iconSize: "xs",
                              noHover: true,
                            },
                            iconSchema,
                          ),
                          modelInfo: responseField(
                            {
                              type: WidgetType.TEXT,
                              size: "xs",
                              variant: "muted",
                            },
                            z.string(),
                          ),
                          separator1: widgetField(
                            {
                              type: WidgetType.TEXT,
                              size: "xs",
                              variant: "muted",
                              content: "•" as const,
                            },
                            { response: true },
                          ),
                          modelProvider: responseField(
                            {
                              type: WidgetType.TEXT,
                              size: "xs",
                              variant: "muted",
                            },
                            z.string(),
                          ),
                          separator2: widgetField(
                            {
                              type: WidgetType.TEXT,
                              size: "xs",
                              variant: "muted",
                              content: "•" as const,
                            },
                            { response: true },
                          ),
                          creditCost: responseField(
                            {
                              type: WidgetType.TEXT,
                              size: "xs",
                              variant: "muted",
                            },
                            z.string(),
                          ),
                        },
                      ),
                    },
                  ),
                },
              ),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.get.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.network.title" as const,
      description: "app.api.agent.chat.characters.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.server.title" as const,
      description: "app.api.agent.chat.characters.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.get.errors.unsavedChanges.title" as const,
      description: "app.api.agent.chat.characters.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.get.success.title" as const,
    description: "app.api.agent.chat.characters.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      listAll: {
        sections: [
          {
            sectionHeader: {
              title: "app.api.agent.chat.characters.enums.category.assistant",
              icon: "robot-face",
              count: 1,
            },
            characters: [
              {
                id: "default",
                icon: "robot-face",
                category: "app.api.agent.chat.characters.enums.category.assistant",
                content: {
                  name: "app.api.agent.chat.characters.default.name",
                  tagline: "app.api.agent.chat.characters.default.tagline",
                  description: "app.api.agent.chat.characters.default.description",
                  modelRow: {
                    modelIcon: "sparkles",
                    modelInfo: "Claude Sonnet 4.5",
                    modelProvider: "Anthropic",
                    creditCost: "1.5 credits",
                  },
                },
              },
            ],
          },
          {
            sectionHeader: {
              title: "app.api.agent.chat.characters.enums.category.coding",
              icon: "code",
              count: 1,
            },
            characters: [
              {
                id: "550e8400-e29b-41d4-a716-446655440000",
                icon: "direct-hit",
                category: "app.api.agent.chat.characters.enums.category.coding",
                content: {
                  name: "app.api.agent.chat.characters.custom.name",
                  tagline: "app.api.agent.chat.characters.custom.tagline",
                  description: "app.api.agent.chat.characters.custom.description",
                  modelRow: {
                    modelIcon: "sparkles",
                    modelInfo: "GPT-5",
                    modelProvider: "OpenAI",
                    creditCost: "3 credits",
                  },
                },
              },
            ],
          },
        ],
      },
    },
    urlPathParams: undefined,
  },
});

// Type exports for GET endpoint
export type CharacterListRequestInput = typeof GET.types.RequestInput;
export type CharacterListRequestOutput = typeof GET.types.RequestOutput;
export type CharacterListResponseInput = typeof GET.types.ResponseInput;
export type CharacterListResponseOutput = typeof GET.types.ResponseOutput;

// Individual character card type from list response
export type CharacterListItem =
  CharacterListResponseOutput["sections"][number]["characters"][number];

const definitions = { GET };
export { GET };
export default definitions;
