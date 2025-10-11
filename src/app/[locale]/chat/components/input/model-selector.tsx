"use client";

import type { JSX } from "react";
import React, { useState } from "react";

import { ModelId, modelOptions } from "../../lib/config/models";
import { SelectorBase, type SelectorOption } from "./selector-base";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/packages/next-vibe-ui/web/ui";
import { useFavorites } from "./use-favorites";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (value: ModelId) => void;
}

const STORAGE_KEY = "chat-favorite-models";

const DEFAULT_FAVORITES: ModelId[] = [
  ModelId.GPT_5_NANO,
  ModelId.DEEPSEEK_V31_FREE,
  ModelId.GEMINI_FLASH_2_0_LITE,
];

export function ModelSelector({ value, onChange }: ModelSelectorProps): JSX.Element {
  const [favorites, toggleFavorite] = useFavorites(STORAGE_KEY, DEFAULT_FAVORITES);
  const [addModelOpen, setAddModelOpen] = useState(false);

  // Convert models to selector options
  const options: SelectorOption<ModelId>[] = modelOptions.map((model) => ({
    id: model.id,
    name: model.name,
    description: undefined,
    tooltip: `${model.provider} - ${model.name}`,
    icon:
      typeof model.icon === "string" ? (
        <span className="text-base leading-none">{model.icon}</span>
      ) : (
        <model.icon className="h-4 w-4" />
      ),
    group: model.provider,
  }));

  return (
    <>
      <SelectorBase
        value={value}
        onChange={onChange}
        options={options}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddNew={() => setAddModelOpen(true)}
        placeholder="Select Model"
        addNewLabel="Add Custom Model"
        groupByProvider={true}
      />

      {/* Add Custom Model Dialog */}
      <Dialog open={addModelOpen} onOpenChange={setAddModelOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Custom Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input id="model-name" placeholder="e.g., GPT-4 Turbo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input id="provider" placeholder="e.g., OpenAI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-docs">API Documentation URL</Label>
              <Input id="api-docs" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-id">Model ID</Label>
              <Input id="model-id" placeholder="e.g., gpt-4-turbo" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddModelOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAddModelOpen(false)}>
                Add Model
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

