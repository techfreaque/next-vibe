"use client";

import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/packages/next-vibe-ui/web/ui";

import type { IconValue } from "../../lib/config/icons";
import { MODEL_UTILITIES } from "../../lib/config/model-utilities";
import { ModelId, modelOptions, modelProviders } from "../../lib/config/models";
import { SelectorBase, type SelectorOption } from "./selector-base";
import { useFavorites } from "./use-favorites";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (value: ModelId) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

const STORAGE_KEY = "chat-favorite-models";

const DEFAULT_FAVORITES: ModelId[] = [
  ModelId.GPT_5_NANO,
  ModelId.DEEPSEEK_V31_FREE,
  ModelId.GEMINI_FLASH_2_5_LITE,
];

export function ModelSelector({
  value,
  onChange,
  locale,
  logger,
}: ModelSelectorProps): JSX.Element {
  const { t } = simpleT(locale);
  const [favorites, toggleFavorite] = useFavorites(
    STORAGE_KEY,
    DEFAULT_FAVORITES,
    logger,
  );
  const [addModelOpen, setAddModelOpen] = useState(false);

  // Convert models to selector options with cost information
  const options: SelectorOption<ModelId>[] = useMemo(() => {
    return modelOptions.map((model) => {
      const provider = modelProviders[model.provider];
      const costText =
        model.creditCost === 0
          ? t("app.chat.modelSelector.costFree")
          : model.creditCost === 1
            ? t("app.chat.modelSelector.costCredits", {
                count: model.creditCost,
              })
            : t("app.chat.modelSelector.costCreditsPlural", {
                count: model.creditCost,
              });

      // Build utility icons for this model - pass icon values directly
      const utilityIconsMap: Record<string, IconValue> = {};
      if (model.utilities) {
        model.utilities.forEach((utilityId) => {
          const utility = MODEL_UTILITIES[utilityId];
          if (utility) {
            utilityIconsMap[utilityId] = utility.icon;
          }
        });
      }

      return {
        id: model.id,
        name: model.name,
        description: costText,
        tooltip: t("app.chat.modelSelector.tooltip", {
          provider: provider.name,
          name: model.name,
          cost: costText,
        }),
        // Pass the original icon values, not resolved components
        icon: model.icon,
        group: provider.name,
        groupIcon: provider.icon,
        utilities: model.utilities,
        utilityIcons: utilityIconsMap,
      };
    });
  }, [t]);

  return (
    <>
      <SelectorBase
        value={value}
        onChange={onChange}
        options={options}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddNew={() => setAddModelOpen(true)}
        placeholder={t("app.chat.modelSelector.placeholder")}
        addNewLabel={t("app.chat.modelSelector.addNewLabel")}
        locale={locale}
      />

      {/* Add Custom Model Dialog */}
      <Dialog open={addModelOpen} onOpenChange={setAddModelOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("app.chat.modelSelector.addDialog.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">
                {t("app.chat.modelSelector.addDialog.fields.modelName.label")}
              </Label>
              <Input
                id="model-name"
                placeholder={t(
                  "app.chat.modelSelector.addDialog.fields.modelName.placeholder",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">
                {t("app.chat.modelSelector.addDialog.fields.provider.label")}
              </Label>
              <Input
                id="provider"
                placeholder={t(
                  "app.chat.modelSelector.addDialog.fields.provider.placeholder",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-docs">
                {t("app.chat.modelSelector.addDialog.fields.apiDocs.label")}
              </Label>
              <Input id="api-docs" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-id">
                {t("app.chat.modelSelector.addDialog.fields.modelId.label")}
              </Label>
              <Input
                id="model-id"
                placeholder={t(
                  "app.chat.modelSelector.addDialog.fields.modelId.placeholder",
                )}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddModelOpen(false)}>
                {t("app.chat.modelSelector.addDialog.cancel")}
              </Button>
              <Button onClick={() => setAddModelOpen(false)}>
                {t("app.chat.modelSelector.addDialog.add")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
