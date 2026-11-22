import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getImageGenModelById,
  ImageGenModelId,
} from "next-vibe/agent/image-generation/models";
import { getModelPrice } from "next-vibe/agent/models/models";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import {
  listUserMediaModels,
  resolveV1SpeechVoice,
  resolveV1TranscriptionModel,
} from "@/v1/shared/media-models";

import type { CreateKind } from "./create-kinds";
import type { StudioModel } from "./studio-types";

export async function studioModelLists(
  user: JwtPayloadType,
  kinds: readonly CreateKind[],
): Promise<Map<CreateKind, StudioModel[]>> {
  const availability = await getEnvAvailability();
  const modelsByKind = new Map<CreateKind, Map<string, StudioModel>>(
    kinds.map((kind) => [kind, new Map()]),
  );
  for (const entry of listUserMediaModels(user, availability)) {
    const kind =
      entry.modality === "transcription" ? "transcribe" : entry.modality;
    const models = modelsByKind.get(kind);
    if (models === undefined || models.has(entry.id)) {
      continue;
    }
    const isTokenPriced =
      kind === "image" && entry.pricing.credits_per_image === null;
    const id = isTokenPriced
      ? Object.values(ImageGenModelId).find((value) => value === entry.id)
      : undefined;
    const image = id && getImageGenModelById(id);
    const rate =
      Object.values(entry.pricing)[0] ?? (image ? getModelPrice(image) : 0);
    const speech =
      kind === "speech"
        ? resolveV1SpeechVoice(entry.id, undefined, user, availability)
        : undefined;
    const stt =
      kind === "transcribe"
        ? resolveV1TranscriptionModel(entry.id, user, availability)
        : undefined;
    models.set(entry.id, {
      id: entry.id,
      name: entry.name,
      content: entry.content,
      rate,
      isTokenPriced,
      requiresImage:
        entry.inputs.includes("image") && !entry.inputs.includes("text"),
      providerRate:
        speech?.creditCostPerCharacter ?? stt?.creditCostPerSecond ?? 0,
    });
  }
  return new Map(
    [...modelsByKind].map(([kind, models]) => [
      kind,
      [...models.values()].toSorted(
        (a, b) => a.rate - b.rate || a.name.localeCompare(b.name),
      ),
    ]),
  );
}

export async function studioModels(
  user: JwtPayloadType,
  kind: CreateKind,
): Promise<StudioModel[]> {
  return (await studioModelLists(user, [kind])).get(kind) ?? [];
}
