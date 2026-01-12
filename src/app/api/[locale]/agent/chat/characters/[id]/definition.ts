/**
 * Single Character API Definition
 * Defines endpoints for GET, PATCH (update), and DELETE operations on a single character
 */

import { z } from "zod";

import { ModelId, ModelIdOptions } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  deleteButton,
  field,
  navigateButtonField,
  objectField,
  objectUnionField,
  requestDataRangeField,
  requestResponseField,
  requestUrlPathParamsField,
  responseArrayOptionalField,
  responseDataField,
  responseRangeField,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../../shared/types/common.schema";
import { ModelUtility, ModelUtilityDB, ModelUtilityOptions } from "../../../models/enum";
import { TtsVoice, TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
import {
  CONTENT_DISPLAY,
  ContentLevelFilterDB,
  INTELLIGENCE_DISPLAY,
  IntelligenceLevelFilterDB,
  ModelSelectionType,
  PRICE_DISPLAY,
  PriceLevelFilterDB,
  SPEED_DISPLAY,
  SpeedLevelFilterDB,
} from "../../favorites/enum";
import { CategoryOptions } from "../enum";
import { CharacterCategory, CharacterCategoryDB, CharacterOwnershipTypeDB } from "../enum";

/**
 * Update Character Endpoint (PATCH)
 * Updates a custom character (only custom characters can be updated)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.characters.id.patch.title" as const,
  description: "app.api.agent.chat.characters.id.patch.container.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.id.patch.container.title" as const,
      description: "app.api.agent.chat.characters.id.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      submitButton: {
        text: "app.api.agent.chat.characters.id.patch.actions.update" as const,
        loadingText: "app.api.agent.chat.characters.id.patch.actions.updating" as const,
        position: "bottom" as const,
        icon: "save" as const,
        variant: "primary" as const,
        size: "default" as const,
      },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.characters.id.patch.id.label" as const,
          description: "app.api.agent.chat.characters.id.patch.id.description" as const,
          hidden: true,
        },
        z.string(),
        true,
      ),

      // === REQUEST DATA ===
      name: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.name.label" as const,
          description: "app.api.agent.chat.characters.id.patch.name.description" as const,
          columns: 6,
        },
        z.string().min(1).max(100) as z.ZodType<TranslationKey>,
      ),
      description: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.description.label" as const,
          description: "app.api.agent.chat.characters.id.patch.description.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500) as z.ZodType<TranslationKey>,
      ),
      icon: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ICON,
          label: "app.api.agent.chat.characters.id.patch.icon.label" as const,
          description: "app.api.agent.chat.characters.id.patch.icon.description" as const,
          columns: 6,
        },
        iconSchema,
      ),
      systemPrompt: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.characters.id.patch.systemPrompt.label" as const,
          description: "app.api.agent.chat.characters.id.patch.systemPrompt.description" as const,
          columns: 12,
        },
        z.string().min(1).max(5000).optional().nullable(),
      ),
      category: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.id.patch.category.label" as const,
          description: "app.api.agent.chat.characters.id.patch.category.description" as const,
          options: CategoryOptions,
          columns: 6,
        },
        z.enum(CharacterCategoryDB),
      ),
      tagline: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.characters.id.patch.tagline.label" as const,
          description: "app.api.agent.chat.characters.id.patch.tagline.description" as const,
          columns: 6,
        },
        z.string().min(1).max(500) as z.ZodType<TranslationKey>,
      ),
      ownershipType: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.id.patch.ownershipType.label" as const,
          description: "app.api.agent.chat.characters.id.patch.ownershipType.description" as const,
          options: [
            {
              value: "app.api.agent.chat.characters.enums.ownershipType.user" as const,
              label: "app.api.agent.chat.characters.enums.ownershipType.user" as const,
            },
            {
              value: "app.api.agent.chat.characters.enums.ownershipType.public" as const,
              label: "app.api.agent.chat.characters.enums.ownershipType.public" as const,
            },
          ],
          columns: 6,
        },
        z.enum([
          "app.api.agent.chat.characters.enums.ownershipType.user",
          "app.api.agent.chat.characters.enums.ownershipType.public",
        ] as const),
      ),
      // Model Selection - discriminated union between manual and filter-based (optional for PATCH)
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.characters.post.modelSelection.title" as const,
          description: "app.api.agent.chat.characters.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
          showSubmitButton: false,
        },
        { request: "data", response: true },
        "selectionType",
        [
          // Variant 1: Manual model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data", response: true },
            {
              selectionType: requestResponseField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal(ModelSelectionType.MANUAL),
              ),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { request: "data" },
              ),
              manualModelId: requestResponseField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "app.api.agent.chat.characters.post.manualModelId.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.manualModelId.description" as const,
                  options: ModelIdOptions,
                  columns: 12,
                },
                z.enum(ModelId),
              ),
            },
          ),
          // Variant 2: Filter-based selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { request: "data", response: true },
            {
              selectionType: requestResponseField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  columns: 12,
                },
                z.literal(ModelSelectionType.FILTERS),
              ),
              modelDisplay: widgetField(
                {
                  type: WidgetType.MODEL_DISPLAY,
                  columns: 12,
                },
                { request: "data" },
              ),
              intelligenceRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.intelligenceRange.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.intelligenceRange.description" as const,
                  options: INTELLIGENCE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel:
                    "app.api.agent.chat.characters.post.intelligenceRange.minLabel" as const,
                  maxLabel:
                    "app.api.agent.chat.characters.post.intelligenceRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              priceRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.priceRange.label" as const,
                  description: "app.api.agent.chat.characters.post.priceRange.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.priceRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.priceRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.contentRange.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.contentRange.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.contentRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.contentRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(ContentLevelFilterDB),
              ),
              speedRange: requestDataRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.speedRange.label" as const,
                  description: "app.api.agent.chat.characters.post.speedRange.description" as const,
                  options: SPEED_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.speedRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.speedRange.maxLabel" as const,
                  columns: 12,
                },
                z.enum(SpeedLevelFilterDB),
              ),
              preferredStrengths: requestResponseField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.preferredStrengths.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.preferredStrengths.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              ),
              ignoredWeaknesses: requestResponseField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.ignoredWeaknesses.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.ignoredWeaknesses.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                },
                z.array(z.enum(ModelUtilityDB)).nullable().optional(),
              ),
            },
          ),
        ],
      ),
      voice: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.characters.post.voice.label" as const,
          description: "app.api.agent.chat.characters.post.voice.description" as const,
          options: TtsVoiceOptions,
          columns: 6,
        },
        z.enum(TtsVoiceDB),
      ),
      suggestedPrompts: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TAGS,
          label: "app.api.agent.chat.characters.post.suggestedPrompts.label" as const,
          description: "app.api.agent.chat.characters.post.suggestedPrompts.description" as const,
          placeholder: "app.api.agent.chat.characters.post.suggestedPrompts.placeholder" as const,
          columns: 12,
          maxTags: 4,
        },
        z.array(z.string()).max(4),
      ),
      // Navigation - back to previous screen
      backButton: backButton({
        label: "app.api.agent.chat.characters.id.patch.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.id.patch.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.network.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.id.patch.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.id.patch.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.server.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.id.patch.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.patch.success.title" as const,
    description: "app.api.agent.chat.characters.id.patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        name: "Updated Code Reviewer",
        description: "Updated description",
        icon: "technologist",
        systemPrompt: "Updated system prompt",
        category: CharacterCategory.CODING,
        tagline: "Updated tagline",
        ownershipType: "app.api.agent.chat.characters.enums.ownershipType.user",
        voice: TtsVoice.FEMALE,
        suggestedPrompts: ["Review this code for bugs", "Suggest performance improvements"],
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
      },
    },
    responses: {
      update: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Updated Code Reviewer",
        description: "Updated description",
        icon: "technologist",
        systemPrompt: "Updated system prompt",
        category: CharacterCategory.CODING,
        tagline: "Updated tagline",
        ownershipType: "app.api.agent.chat.characters.enums.ownershipType.user",
        voice: TtsVoice.FEMALE,
        suggestedPrompts: ["Review this code for bugs", "Suggest performance improvements"],
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
      },
    },
    urlPathParams: {
      update: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Delete Character Endpoint (DELETE)
 * Deletes a custom character by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.characters.id.delete.title" as const,
  description: "app.api.agent.chat.characters.id.delete.description" as const,
  icon: "trash" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.characters.id.delete.container.title" as const,
      description: "app.api.agent.chat.characters.id.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      submitButton: {
        text: "app.api.agent.chat.characters.id.delete.actions.delete" as const,
        loadingText: "app.api.agent.chat.characters.id.delete.actions.deleting" as const,
        position: "bottom" as const,
        icon: "trash" as const,
        variant: "destructive" as const,
        size: "default" as const,
      },
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.characters.id.delete.id.label" as const,
          description: "app.api.agent.chat.characters.id.delete.id.description" as const,
        },
        z.string(),
      ),

      // === RESPONSE DATA ===
      success: responseDataField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.characters.id.delete.success.content" as const,
        },
        z.boolean(),
      ),
      // Navigation - back to previous screen
      backButton: backButton({
        label: "app.api.agent.chat.characters.id.delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.id.delete.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.id.delete.errors.network.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.id.delete.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.id.delete.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.id.delete.errors.server.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.id.delete.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.id.delete.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.delete.success.title" as const,
    description: "app.api.agent.chat.characters.id.delete.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      delete: {
        success: true,
      },
    },
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Get Single Character Endpoint (GET)
 * Retrieves a specific character by ID (default or custom)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "characters", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.characters.id.get.title" as const,
  description: "app.api.agent.chat.characters.id.get.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      showSubmitButton: false,
    },
    { request: "urlPathParams", response: true },
    {
      // Hidden ID field for request (not displayed)
      id: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.characters.id.get.id.label" as const,
          description: "app.api.agent.chat.characters.id.get.id.description" as const,
          disabled: true,
          hidden: true,
        },
        z.string(),
        true,
      ),

      // Top action buttons (back on left, edit/delete on right)
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        {},
        {
          // Back button (left side)
          backButton: backButton({
            icon: "arrow-left",
            variant: "outline",
          }),

          // Right side buttons container
          rightButtons: widgetObjectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.HORIZONTAL,
              gap: "2",
              noCard: true,
            },
            {},
            {
              // Edit button - uses self-referencing GET endpoint for prefill
              // Note: getEndpoint is omitted - NavigateButtonWidget will auto-detect
              // the current GET endpoint from context.currentEndpoint
              editButton: navigateButtonField({
                targetEndpoint: PATCH,
                extractParams: (data) => ({
                  urlPathParams: { id: (data as { id: string }).id },
                }),
                prefillFromGet: true,
                label: "app.api.agent.chat.characters.id.get.editButton.label" as const,
                icon: "pencil",
                variant: "default",
              }),

              // Delete button
              deleteButton: deleteButton({
                targetEndpoint: DELETE,
                extractParams: (data) => ({
                  urlPathParams: { id: (data as { id: string }).id },
                }),
                label: "app.api.agent.chat.characters.id.get.deleteButton.label" as const,
                icon: "trash",
                variant: "destructive",
              }),
            },
          ),
        },
      ),

      // === Icon (inline) ===
      icon: responseDataField(
        {
          type: WidgetType.ICON,
          iconSize: "xl",
          containerSize: "sm",
          inline: true,
        },
        iconSchema,
      ),

      // === Name (inline) ===
      name: responseDataField(
        {
          type: WidgetType.TEXT,
          size: "xl",
          weight: "bold",
          inline: true,
        },
        z.string().min(1).max(100) as z.ZodType<TranslationKey>,
      ),

      // === Tagline (inline) ===
      tagline: responseDataField(
        {
          type: WidgetType.TEXT,
          size: "lg",
          color: "muted",
          inline: true,
        },
        z.string().min(1).max(500) as z.ZodType<TranslationKey>,
      ),

      // === Description ===
      description: responseDataField(
        {
          type: WidgetType.TEXT,
          size: "base",
        },
        z.string().min(1).max(500) as z.ZodType<TranslationKey>,
      ),

      // === Category badge (inline with other badges) ===
      category: responseDataField(
        {
          type: WidgetType.BADGE,
          variant: "default",
          inline: true,
        },
        z.enum(CharacterCategoryDB),
      ),

      // === Ownership Type badge (inline with other badges) ===
      ownershipType: responseDataField(
        {
          type: WidgetType.BADGE,
          variant: "info",
          inline: true,
        },
        z.enum(CharacterOwnershipTypeDB),
      ),

      // === Voice badge (inline with other badges) ===
      voice: responseDataField(
        {
          type: WidgetType.BADGE,
          variant: "default",
          inline: true,
        },
        z.enum(TtsVoiceDB),
      ),

      // === System prompt ===
      systemPrompt: responseDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.characters.id.patch.systemPrompt.label" as const,
          disabled: true,
          rows: 10,
        },
        z.string().max(5000).nullable(),
      ),

      // === MODEL SELECTION ===
      modelSelection: objectUnionField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.characters.post.modelSelection.title" as const,
          description: "app.api.agent.chat.characters.post.modelSelection.description" as const,
          layoutType: LayoutType.STACKED,
          showSubmitButton: false,
        },
        { response: true },
        "selectionType",
        [
          // Variant 1: Manual model selection
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              selectionType: responseDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  disabled: true,
                },
                z.literal(ModelSelectionType.MANUAL),
              ),
              manualModelId: responseDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "app.api.agent.chat.characters.post.manualModelId.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.manualModelId.description" as const,
                  options: ModelIdOptions,
                  disabled: true,
                },
                z.enum(ModelId),
              ),
            },
          ),
          // Variant 2: Filter-based selection with READONLY range sliders
          objectField(
            {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              selectionType: responseDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.FILTER_PILLS,
                  label: "app.api.agent.chat.characters.post.selectionType.label" as const,
                  options: [
                    {
                      value: ModelSelectionType.MANUAL,
                      label: "app.api.agent.chat.characters.post.selectionType.manual" as const,
                    },
                    {
                      value: ModelSelectionType.FILTERS,
                      label: "app.api.agent.chat.characters.post.selectionType.filters" as const,
                    },
                  ],
                  disabled: true,
                },
                z.literal(ModelSelectionType.FILTERS),
              ),
              intelligenceRange: responseRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.intelligenceRange.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.intelligenceRange.description" as const,
                  options: INTELLIGENCE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel:
                    "app.api.agent.chat.characters.post.intelligenceRange.minLabel" as const,
                  maxLabel:
                    "app.api.agent.chat.characters.post.intelligenceRange.maxLabel" as const,
                  disabled: true,
                },
                z.enum(IntelligenceLevelFilterDB),
              ),
              priceRange: responseRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.priceRange.label" as const,
                  description: "app.api.agent.chat.characters.post.priceRange.description" as const,
                  options: PRICE_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.priceRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.priceRange.maxLabel" as const,
                  disabled: true,
                },
                z.enum(PriceLevelFilterDB),
              ),
              contentRange: responseRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.contentRange.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.contentRange.description" as const,
                  options: CONTENT_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.contentRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.contentRange.maxLabel" as const,
                  disabled: true,
                },
                z.enum(ContentLevelFilterDB),
              ),
              speedRange: responseRangeField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.RANGE_SLIDER,
                  label: "app.api.agent.chat.characters.post.speedRange.label" as const,
                  description: "app.api.agent.chat.characters.post.speedRange.description" as const,
                  options: SPEED_DISPLAY.map((tier) => ({
                    label: tier.label,
                    value: tier.value,
                    icon: tier.icon,
                    description: tier.description,
                  })),
                  minLabel: "app.api.agent.chat.characters.post.speedRange.minLabel" as const,
                  maxLabel: "app.api.agent.chat.characters.post.speedRange.maxLabel" as const,
                  disabled: true,
                },
                z.enum(SpeedLevelFilterDB),
              ),
              preferredStrengths: responseArrayOptionalField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.preferredStrengths.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.preferredStrengths.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                  disabled: true,
                },
                field(
                  z.enum(ModelUtilityDB),
                  { response: true },
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.agent.chat.characters.post.preferredStrengths.item" as const,
                  },
                ),
              ),
              ignoredWeaknesses: responseArrayOptionalField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.MULTISELECT,
                  label: "app.api.agent.chat.characters.post.ignoredWeaknesses.label" as const,
                  description:
                    "app.api.agent.chat.characters.post.ignoredWeaknesses.description" as const,
                  options: ModelUtilityOptions,
                  columns: 6,
                  disabled: true,
                },
                field(
                  z.enum(ModelUtilityDB),
                  { response: true },
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.agent.chat.characters.post.ignoredWeaknesses.item" as const,
                  },
                ),
              ),
            },
          ),
        ],
      ),

      // === SUGGESTED PROMPTS (readonly tags) ===
      suggestedPrompts: responseDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TAGS,
          label: "app.api.agent.chat.characters.post.suggestedPrompts.label" as const,
          description: "app.api.agent.chat.characters.post.suggestedPrompts.description" as const,
          placeholder: "app.api.agent.chat.characters.post.suggestedPrompts.placeholder" as const,
          maxTags: 4,
          disabled: true,
        },
        z.array(z.string()).max(4),
      ),

      // Navigation - back to previous screen
      backButton: backButton({
        label: "app.api.agent.chat.characters.id.get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.characters.id.get.errors.validation.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.network.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.characters.id.get.errors.unauthorized.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.characters.id.get.errors.forbidden.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.id.get.errors.notFound.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.server.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.id.get.errors.unknown.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.characters.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.id.get.errors.conflict.title" as const,
      description: "app.api.agent.chat.characters.id.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.id.get.success.title" as const,
    description: "app.api.agent.chat.characters.id.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      getDefault: {
        id: "default",
        name: "Default",
        description: "The models unmodified behavior",
        icon: "🤖",
        systemPrompt: "",
        category: CharacterCategory.ASSISTANT,
        tagline: "Pure AI, No Personality",
        ownershipType: "app.api.agent.chat.characters.enums.ownershipType.system",
        voice: "app.api.agent.textToSpeech.voices.FEMALE",
        suggestedPrompts: ["Help me brainstorm ideas"],
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          preferredStrengths: [ModelUtility.CHAT],
          ignoredWeaknesses: [ModelUtility.CHAT],
        },
      },
      getCustom: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Code Reviewer",
        description: "Expert at reviewing code",
        icon: "👨‍💻",
        systemPrompt: "You are an expert code reviewer...",
        category: CharacterCategory.CODING,
        tagline: "Code Review Expert",
        ownershipType: "app.api.agent.chat.characters.enums.ownershipType.user",
        voice: "app.api.agent.textToSpeech.voices.MALE",
        suggestedPrompts: ["Review this code"],
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ModelId.GPT_5,
        },
      },
    },
    urlPathParams: {
      getDefault: { id: "default" },
      getCustom: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

// Type exports for GET endpoint
export type CharacterGetRequestInput = typeof GET.types.RequestInput;
export type CharacterGetRequestOutput = typeof GET.types.RequestOutput;
export type CharacterGetResponseInput = typeof GET.types.ResponseInput;
export type CharacterGetResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for PATCH endpoint
export type CharacterUpdateRequestInput = typeof PATCH.types.RequestInput;
export type CharacterUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type CharacterUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type CharacterUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

// Type exports for DELETE endpoint
export type CharacterDeleteRequestInput = typeof DELETE.types.RequestInput;
export type CharacterDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type CharacterDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type CharacterDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

// Type for filter-based model selection
type FiltersModelSelection = Extract<
  CharacterGetResponseOutput["modelSelection"],
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
type ManualModelSelection = Extract<
  CharacterGetResponseOutput["modelSelection"],
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export function isFiltersSelection(
  sel: CharacterGetResponseOutput["modelSelection"],
): sel is FiltersModelSelection {
  return sel.selectionType === ModelSelectionType.FILTERS;
}

export function isManualSelection(
  sel: CharacterGetResponseOutput["modelSelection"],
): sel is ManualModelSelection {
  return sel.selectionType === ModelSelectionType.MANUAL;
}

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
