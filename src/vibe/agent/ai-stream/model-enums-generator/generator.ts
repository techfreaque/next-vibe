/**
 * AI-stream enums domain generator (single entry).
 *
 * Regenerates the vision-model enums (vision-models.generated.ts) and the inline
 * LLM-derived media-gen enums (image/video/music model files) from the chat model
 * definitions. The pure content functions live in vision-enum-generator.ts /
 * media-gen-enum-generator.ts and are ALSO used by the model-price updater — this
 * generator just wraps them for `vibe gen`.
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { GeneratorDefinition } from "next-vibe/core/generators/shared/shared-inputs";

import { getSrcDir } from "@/env/paths";

import { updateMediaGenInlineEnum } from "./media-gen-enum-generator";
import { generateVisionEnumFileContent } from "./vision-enum-generator";

export const generator: GeneratorDefinition = {
  key: "ai-stream-enums",
  phase: "default",
  needs: {},
  cacheKey: "ai-stream-models",
  findInputs() {
    const agentDir = join(getSrcDir(), "vibe", "agent");
    return [
      join(agentDir, "ai-stream", "models.ts"),
      join(agentDir, "image-generation", "models.ts"),
      join(agentDir, "video-generation", "models.ts"),
      join(agentDir, "music-generation", "models.ts"),
    ];
  },
  async generate(ctx) {
    const { logger } = ctx;
    const agentDir = join(getSrcDir(), "vibe", "agent");

    const { chatModelDefinitions, ChatModelId } =
      (await import("../models")) as {
        chatModelDefinitions: Parameters<
          typeof generateVisionEnumFileContent
        >[0];
        ChatModelId: Record<string, string>;
      };
    const chatEnumEntries = Object.entries(ChatModelId) as Array<
      [string, string]
    >;

    // Vision enums → vision-models.generated.ts (only rewrite when changed).
    let visionChanged = false;
    const content = generateVisionEnumFileContent(
      chatModelDefinitions,
      chatEnumEntries,
    );
    const visionGenPath = join(
      agentDir,
      "ai-stream/vision-models.generated.ts",
    );
    let existingVision = "";
    try {
      existingVision = readFileSync(visionGenPath, "utf-8").toString();
    } catch {
      existingVision = "";
    }
    if (content !== existingVision) {
      writeFileSync(visionGenPath, content, "utf-8");
      visionChanged = true;
      logger.info("Vision model enums regenerated");
    }

    // Media-gen inline enums in the three generation model files.
    let mediaGenUpdated = 0;
    const targets: Array<[string, "image" | "video" | "audio"]> = [
      ["image-generation/models.ts", "image"],
      ["video-generation/models.ts", "video"],
      ["music-generation/models.ts", "audio"],
    ];
    for (const [rel, modality] of targets) {
      const changed = updateMediaGenInlineEnum(
        join(agentDir, rel),
        modality,
        chatModelDefinitions,
        chatEnumEntries,
        logger,
      );
      if (changed) {
        mediaGenUpdated++;
      }
    }

    return {
      summary: `ai-stream enums (vision ${visionChanged ? "updated" : "cached"}, ${mediaGenUpdated} media-gen updated)`,
      counts: { visionChanged: visionChanged ? 1 : 0, mediaGenUpdated },
    };
  },
};
