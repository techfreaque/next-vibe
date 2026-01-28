/**
 * ModelDisplay Widget - Ink implementation
 * Displays model selection information in CLI format
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteCreateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { ModelDisplayWidgetConfig } from "./types";

export function ModelDisplayWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  ModelDisplayWidgetConfig<TUsage, TSchemaType>
>): JSX.Element {
  // Extract model selection data from value
  let data: FavoriteCreateRequestOutput["modelSelection"] | null | undefined =
    null;

  data = field.value;

  // Try to get from response context if not found
  if (!data && context.response && context.response.success === true) {
    const responseData = context.response.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      !Array.isArray(responseData) &&
      "modelSelection" in responseData
    ) {
      const modelSelection = responseData.modelSelection;
      if (
        typeof modelSelection === "object" &&
        modelSelection !== null &&
        !Array.isArray(modelSelection)
      ) {
        data = modelSelection as FavoriteCreateRequestOutput["modelSelection"];
      }
    }
  }

  if (!data) {
    return <Box />;
  }

  // Handle CHARACTER_BASED
  if ("selectionType" in data) {
    if (data.selectionType === ModelSelectionType.CHARACTER_BASED) {
      return (
        <Box
          flexDirection="column"
          paddingY={1}
          borderStyle="round"
          borderColor="cyan"
        >
          <Text bold color="cyan">
            {context.t("app.chat.selector.characterBased")}
          </Text>
          <Text dimColor>
            {context.t("app.chat.selector.usesCharacterSettings")}
          </Text>
        </Box>
      );
    }

    // Resolve model for MANUAL and FILTERS
    const resolvedModel = CharactersRepositoryClient.getBestModelForCharacter(
      data as Exclude<
        FavoriteCreateRequestOutput["modelSelection"],
        { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
      >,
    );

    const isAutoMode = data.selectionType === ModelSelectionType.FILTERS;

    if (!resolvedModel) {
      // No model matches the filter criteria
      if (isAutoMode) {
        return (
          <Box
            flexDirection="column"
            paddingY={1}
            borderStyle="round"
            borderColor="red"
          >
            <Text bold color="red">
              {context.t("app.chat.selector.noModelsMatch")}
            </Text>
            <Text dimColor>
              {context.t("app.chat.selector.adjustFiltersMessage")}
            </Text>
          </Box>
        );
      }
      return <Box />;
    }

    const labelKey = isAutoMode
      ? "app.chat.selector.autoSelectedModel"
      : "app.chat.selector.manualSelectedModel";

    const providerName =
      resolvedModel.provider && modelProviders[resolvedModel.provider]
        ? modelProviders[resolvedModel.provider].name
        : "Unknown";

    return (
      <Box
        flexDirection="column"
        paddingY={1}
        borderStyle="round"
        borderColor="cyan"
      >
        <Text dimColor>{context.t(labelKey)}</Text>
        <Box>
          <Text bold color="cyan">
            {resolvedModel.name}
          </Text>
          <Text dimColor> ({providerName})</Text>
        </Box>
        <Text dimColor>
          {chalk.dim("Cost:")} {resolvedModel.creditCost}{" "}
          {context.t("app.api.agent.models.creditCostUnit")}
        </Text>
      </Box>
    );
  }

  return <Box />;
}
