/**
 * Favorites Create API Definition
 * Defines endpoint for creating new favorites
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  submitButton,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { modelSelectionSchemaWithCharacter } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../../shared/types/common.schema";
import { TtsVoiceDB, TtsVoiceOptions } from "../../../text-to-speech/enum";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../characters/create/definition";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "../../characters/enum";

/**
 * Create Favorite Endpoint (POST)
 * Creates a new favorite for the current user
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "favorites", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  allowedClientRoles: [UserRole.PUBLIC] as const, // Allow public users to use client route

  title: "app.api.agent.chat.favorites.post.title" as const,
  description: "app.api.agent.chat.favorites.post.description" as const,
  icon: "plus" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.favorites" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.favorites.post.container.title" as const,
      description:
        "app.api.agent.chat.favorites.post.container.description" as const,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "data", response: true },
    {
      // Navigation and action buttons
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data", response: true },
        {
          backButton: backButton({
            label:
              "app.api.agent.chat.favorites.post.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
            usage: { request: "data", response: true },
          }),
          submitButton: submitButton({
            label:
              "app.api.agent.chat.favorites.post.submitButton.label" as const,
            loadingText:
              "app.api.agent.chat.favorites.post.submitButton.loadingText" as const,
            icon: "plus",
            variant: "primary",
            className: "ml-auto",
            usage: { request: "data", response: true },
          }),
        },
      ),

      // Separator between buttons and content
      separator: widgetField({
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { request: "data", response: true },
      }),

      // === REQUEST ===
      characterId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.post.characterId.label" as const,
        description:
          "app.api.agent.chat.favorites.post.characterId.description" as const,
        columns: 6,
        schema: z.string(),
      }),

      customName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.favorites.post.customName.label" as const,
        description:
          "app.api.agent.chat.favorites.post.customName.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      customIcon: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "app.api.agent.chat.favorites.post.customIcon.label" as const,
        description:
          "app.api.agent.chat.favorites.post.customIcon.description" as const,
        columns: 6,
        schema: iconSchema.optional(),
      }),
      voice: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.favorites.post.voice.label" as const,
        description:
          "app.api.agent.chat.favorites.post.voice.description" as const,
        options: TtsVoiceOptions,
        columns: 6,
        schema: z.enum(TtsVoiceDB).nullable().optional(),
      }),

      modelSelection: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MODEL_SELECTION,
        label:
          "app.api.agent.chat.favorites.post.modelSelection.title" as const,
        description:
          "app.api.agent.chat.favorites.post.modelSelection.description" as const,
        includeCharacterBased: true,
        columns: 12,
        schema: modelSelectionSchemaWithCharacter,
      }),

      // === RESPONSE ===
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.favorites.post.response.id.content" as const,
        schema: z.string().uuid(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.favorites.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.favorites.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.favorites.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.favorites.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.favorites.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.favorites.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.favorites.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.favorites.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.favorites.post.success.title" as const,
    description:
      "app.api.agent.chat.favorites.post.success.description" as const,
  },

  examples: {
    requests: {
      create: {
        characterId: "thea",
        customName: "Thea (Smart)",
        modelSelection: {
          currentSelection: {
            selectionType: ModelSelectionType.FILTERS,
            intelligenceRange: {
              min: IntelligenceLevel.SMART,
              max: IntelligenceLevel.BRILLIANT,
            },
            priceRange: {
              min: PriceLevel.CHEAP,
              max: PriceLevel.STANDARD,
            },
            contentRange: {
              min: ContentLevel.OPEN,
              max: ContentLevel.UNCENSORED,
            },
            speedRange: {
              min: SpeedLevel.FAST,
              max: SpeedLevel.THOROUGH,
            },
          },
          characterModelSelection: {
            selectionType: ModelSelectionType.FILTERS,
            intelligenceRange: {
              min: IntelligenceLevel.SMART,
              max: IntelligenceLevel.BRILLIANT,
            },
            priceRange: {
              min: PriceLevel.CHEAP,
              max: PriceLevel.STANDARD,
            },
            contentRange: {
              min: ContentLevel.MAINSTREAM,
              max: ContentLevel.UNCENSORED,
            },
            speedRange: {
              min: SpeedLevel.FAST,
              max: SpeedLevel.THOROUGH,
            },
          },
        },
      },
    },
    responses: {
      create: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
  },
});

// Type exports for POST endpoint
export type FavoriteCreateRequestInput = typeof POST.types.RequestInput;
export type FavoriteCreateRequestOutput = typeof POST.types.RequestOutput;
export type FavoriteCreateResponseInput = typeof POST.types.ResponseInput;
export type FavoriteCreateResponseOutput = typeof POST.types.ResponseOutput;

// Favorite field type alias for model selection (from POST request)
// This is the full structure with currentSelection and characterModelSelection
export type FavoriteModelSelection =
  FavoriteCreateRequestOutput["modelSelection"];

export type FavoriteFiltersModelSelection = Extract<
  FavoriteModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.FILTERS }
>;

export type FavoriteManualModelSelection = Extract<
  FavoriteModelSelection["currentSelection"],
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export type FavoriteCharacterBasedModelSelection = Extract<
  FavoriteModelSelection["currentSelection"],
  {
    selectionType: typeof ModelSelectionType.CHARACTER_BASED;
  }
>;

export function isCharacterBasedModelSelection(
  sel: FavoriteModelSelection,
): sel is {
  currentSelection: FavoriteCharacterBasedModelSelection;
} & FavoriteModelSelection {
  return (
    sel.currentSelection.selectionType === ModelSelectionType.CHARACTER_BASED
  );
}

const definitions = { POST } as const;
export default definitions;

// oxlint-disable-next-line no-unused-vars
const _test1: FiltersModelSelection = {} as FavoriteFiltersModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test2: ManualModelSelection = {} as FavoriteManualModelSelection;
// oxlint-disable-next-line no-unused-vars
const _test3: {
  selectionType: typeof ModelSelectionType.CHARACTER_BASED;
} = {} as FavoriteCharacterBasedModelSelection;
