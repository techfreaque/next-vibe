/**
 * Image-to-video only models (Media Studio /create/video, chat tool, API):
 * a request without a start image is rejected with a named validation error
 * before any balance check or provider call.
 */

import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";

import { ApiProvider } from "../models/models";
import * as media from "../shared/media-generation";
import definition from "./definition";
import { scopedTranslation } from "./i18n";
import * as models from "./models";
import { VideoGenerationRepository } from "./repository";

afterEach(() => mock.restore());

/** ModelsLab providerModels whose request builder needs init_image. */
const MODELSLAB_IMAGE_TO_VIDEO = new Set([
  "kling-v2-5-turbo-i2v",
  "kling-v2-1-master-i2v",
  "ltx-2-3-pro-i2v",
  "Hailuo-2.3-i2v",
  "Hailuo-2.3-Fast-i2v",
  "wan2.6-i2v",
  "wan2.6-i2v-flash",
  "seedance-1-5-pro",
  "omni-human-1.5",
  "grok-i2v",
]);

describe("image-to-video only models", () => {
  it("flags exactly the routes the ModelsLab builder rejects without an image", async () => {
    const { buildModelsLabVideoRequest } = await import("./providers/modelslab");
    for (const def of Object.values(models.videoGenModelDefinitions)) {
      for (const provider of def.providers) {
        if (provider.apiProvider !== ApiProvider.MODELSLAB) {
          continue;
        }
        const request = buildModelsLabVideoRequest({
          providerModel: provider.providerModel,
          prompt: "a lighthouse",
          durationSeconds: 5,
        });
        const needsImage = !request.ok && request.reason === "imageRequired";
        const flagged =
          "requiresFrameImage" in provider && provider.requiresFrameImage === true;
        expect({ route: provider.providerModel, flagged }).toEqual({
          route: provider.providerModel,
          flagged: needsImage,
        });
        expect(flagged).toBe(MODELSLAB_IMAGE_TO_VIDEO.has(provider.providerModel));
      }
    }
    expect(models.videoGenModelRequiresImage(models.VideoGenModelId.WAN_2_6_I2V)).toBe(true);
    expect(models.videoGenModelRequiresImage(models.VideoGenModelId.WAN_2_7_T2V)).toBe(false);
    expect(models.videoGenModelRequiresImage("not-a-model")).toBe(false);
  });

  it("rejects a missing start image before billing, and lets an image through", async () => {
    const model = models.videoGenModelOptions.find(
      (option) => option.id === models.VideoGenModelId.WAN_2_6_I2V,
    );
    if (!model) {
      return expect(model).toBeDefined();
    }
    spyOn(models, "getVideoGenModelById").mockReturnValue(model);
    const { t } = scopedTranslation.scopedT("en-US");
    const balance = spyOn(media, "checkMediaBalance").mockResolvedValue(
      fail({
        message: t("post.errors.modelUnavailable"),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      }),
    );
    const generate = (frameReferences?: { role: "first" | "last"; url: string }[]) =>
      VideoGenerationRepository.generateVideo(
        definition.POST.requestSchema.parse({
          prompt: "Animate the lighthouse",
          model: model.id,
          frameReferences,
        }),
        {
          isPublic: true,
          leadId: crypto.randomUUID(),
          roles: [UserPermissionRole.PUBLIC],
        },
        "en-US",
        createEndpointLogger(false, "en-US"),
        t,
        rootlessToolExecutionContext(),
        Platform.NEXT_API,
      );

    for (const frames of [undefined, [{ role: "last" as const, url: "https://example.test/end.png" }]]) {
      expect(await generate(frames)).toMatchObject({
        success: false,
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        message: t("post.errors.imageRequiredForModel", { model: "Wan 2.6 I2V" }),
      });
    }
    expect(balance).not.toHaveBeenCalled();

    // With a start image the request reaches the balance check.
    await generate([{ role: "first", url: "https://example.test/start.png" }]);
    expect(balance).toHaveBeenCalled();
  });
});
