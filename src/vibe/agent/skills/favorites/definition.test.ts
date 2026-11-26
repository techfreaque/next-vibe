import { expect, it } from "bun:test";

import { ChatModelId } from "../../ai-stream/models";
import favoritesDefinition from "./definition";

it("keeps the favorites list when a newer deployment sends an unknown model", () => {
  const card = {
    id: "coder",
    skillId: "coder",
    customVariantName: null,
    modelId: ChatModelId.GPT_6_2_SOL,
    voiceId: null,
    position: 0,
    icon: "sparkles",
    name: "Coder",
    tagline: null,
    activeBadge: null,
    description: null,
    modelIcon: "sparkles",
    modelInfo: "GPT 6.2 Sol",
    modelProvider: "OpenAI",
  };
  const rowId = "34971a82-d50e-462f-9847-f347dc7cdde7";
  const favorites = [{ ...card, rowId, modelId: "future-chat-model" }, card];
  const response = {
    totalCount: null,
    matchedCount: null,
    currentPage: null,
    totalPages: null,
    hint: null,
    favorites,
  };

  const schema = favoritesDefinition.GET.responseSchema;
  const parsed = schema.safeParse(response);
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.favorites.map((favorite) => favorite.rowId)).toEqual([
      rowId,
      undefined,
    ]);
    expect(parsed.data.favorites.map(({ modelId, modelInfo }) => ({
      modelId,
      modelInfo,
    }))).toEqual([
      { modelId: null, modelInfo: card.modelInfo },
      { modelId: card.modelId, modelInfo: card.modelInfo },
    ]);
  }
  expect(
    schema.safeParse({
      ...response,
      favorites: [{ ...card, modelId: 42 }],
    }).success,
  ).toBe(false);

  const event = favoritesDefinition.GET.events?.[
    "favorite-created"
  ].payloadType.safeParse({ skillId: card.skillId, favorites });
  expect(event?.success).toBe(true);
  if (event?.success) {
    expect(event.data.favorites.map(({ modelId }) => modelId)).toEqual([
      null,
      card.modelId,
    ]);
  }
});
