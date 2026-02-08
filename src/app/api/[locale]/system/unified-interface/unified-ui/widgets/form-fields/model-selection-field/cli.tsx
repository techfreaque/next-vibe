/**
 * Model Selection Field Widget - CLI implementation
 * Simplified model selection for terminal interfaces
 */

import { Text } from "ink";
import type { JSX } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type {
  ModelSelectionFieldWidgetConfigAny,
  ModelSelectionSimple,
  ModelSelectionWithCharacter,
} from "./types";

type ModelSelectionValue = ModelSelectionWithCharacter | ModelSelectionSimple;

export function ModelSelectionFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  ModelSelectionFieldWidgetConfigAny<TKey, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation();

  const value = field.value as ModelSelectionValue | undefined;

  if (!value) {
    return <Text dimColor>{t("app.chat.selector.notConfigured")}</Text>;
  }

  // Get current selection
  const currentSelection =
    "currentSelection" in value ? value.currentSelection : value;

  // Display current selection based on mode
  if (currentSelection.selectionType === ModelSelectionType.MANUAL) {
    return (
      <Text>
        {t("app.chat.selector.manualMode")}: {currentSelection.manualModelId}
      </Text>
    );
  }

  if (currentSelection.selectionType === ModelSelectionType.CHARACTER_BASED) {
    return <Text>{t("app.chat.selector.characterMode")}</Text>;
  }

  // FILTERS mode
  return (
    <Text>
      {t("app.chat.selector.autoMode")} ({t("app.chat.selector.intelligence")}:{" "}
      {currentSelection.intelligenceRange?.min ?? "?"}-
      {currentSelection.intelligenceRange?.max ?? "?"},{" "}
      {t("app.chat.selector.price")}: {currentSelection.priceRange?.min ?? "?"}-
      {currentSelection.priceRange?.max ?? "?"})
    </Text>
  );
}

export default ModelSelectionFieldWidgetInk;
