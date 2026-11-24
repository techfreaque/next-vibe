import { describe, expect, it } from "bun:test";

import {
  ImageGenModelId,
  imageGenModelDefinitions,
  imageGenModelOptions,
} from "../../image-generation/models";
import {
  MusicGenModelId,
  musicGenModelDefinitions,
} from "../../music-generation/models";
import { sttModelDefinitions } from "../../speech-to-text/models";
import {
  TtsModelId,
  ttsModelDefinitions,
} from "../../text-to-speech/models";
import { videoGenModelDefinitions } from "../../video-generation/models";
import { ApiProvider, type ModelDefinition } from "../models";
import {
  CommercialUse,
  type CommercialUseInfo,
  CommercialUseReason,
} from "./enum";

const allDefinitions: [string, ModelDefinition][] = [
  ...Object.entries(imageGenModelDefinitions),
  ...Object.entries(videoGenModelDefinitions),
  ...Object.entries(musicGenModelDefinitions),
  ...Object.entries(ttsModelDefinitions),
  ...Object.entries(sttModelDefinitions),
];

describe("media model commercial-use status", () => {
  it("every media model definition states its commercial-use status", () => {
    const missing = allDefinitions
      .filter(([, def]) => def.commercialUse === undefined)
      .map(([id]) => id);
    expect(missing).toEqual([]);
  });

  it("marks the models restricted by a published term", () => {
    const restricted = allDefinitions
      .filter(([, def]) => def.commercialUse?.status === CommercialUse.RESTRICTED)
      .map(([id]) => id)
      .toSorted();
    expect(restricted).toEqual(
      [
        MusicGenModelId.MUSICGEN_STEREO,
        MusicGenModelId.ELEVENLABS_MUSIC,
        ImageGenModelId.RIVERFLOW_V2_PRO,
        ImageGenModelId.RIVERFLOW_V2_FAST,
        ImageGenModelId.RIVERFLOW_V2_MAX_PREVIEW,
        ImageGenModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
        ImageGenModelId.RIVERFLOW_V2_FAST_PREVIEW,
        TtsModelId.VOXTRAL_PAUL,
        ImageGenModelId.LUSTIFY_V8,
      ].toSorted(),
    );
  });

  it("never marks a Venice-only model as allowed", () => {
    const veniceOnlyAllowed = allDefinitions
      .filter(
        ([, def]) =>
          def.providers.every((p) => p.apiProvider === ApiProvider.VENICE_AI) &&
          def.commercialUse?.status === CommercialUse.ALLOWED,
      )
      .map(([id]) => id);
    expect(veniceOnlyAllowed).toEqual([]);
  });

  it("allowed reasons are only license or provider terms", () => {
    const allowedReasons: readonly CommercialUseInfo["reason"][] = [
      CommercialUseReason.OPEN_LICENSE,
      CommercialUseReason.PROVIDER_TERMS,
    ];
    for (const [, def] of allDefinitions) {
      if (def.commercialUse?.status === CommercialUse.ALLOWED) {
        expect(allowedReasons).toContain(def.commercialUse.reason);
      }
    }
  });

  it("carries the status through to the model options", () => {
    expect(
      imageGenModelOptions.every((option) => option.commercialUse !== undefined),
    ).toBe(true);
  });
});
