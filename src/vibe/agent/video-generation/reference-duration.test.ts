import { afterEach, expect, it, mock, spyOn } from "bun:test";
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

it("prices omitted Veo guide durations at eight seconds and rejects an explicit four before billing", async () => {
  const model = models.videoGenModelOptions.find(
    (option) =>
      option.id === models.VideoGenModelId.VEO_3_1_FAST &&
      option.apiProvider === ApiProvider.OPENROUTER,
  );
  if (!model) return expect(model).toBeDefined();
  spyOn(models, "getVideoGenModelById").mockReturnValue(model);
  const { t } = scopedTranslation.scopedT("en-US");
  const balance = spyOn(media, "checkMediaBalance").mockResolvedValue(
    fail({
      message: t("post.errors.modelUnavailable"),
      errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
    }),
  );
  const generate = (
    role: "reference" | "first" | "last" | undefined,
    duration?: number,
    url = "https://example.test/frame.png",
  ) =>
    VideoGenerationRepository.generateVideo(
      definition.POST.requestSchema.parse({
        prompt: "Saved duration replay",
        model: model.id,
        duration,
        frameReferences: [{ role, url }],
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
      Platform.AI,
    );
  expect(await generate("reference", 4)).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.BAD_REQUEST,
  });
  const clip =
    "/api/en-US/agent/chat/threads/files/eb3a8c4c-de39-4d30-baad-fa32f10d555e/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.mp4";
  for (const [role, url] of [
    ["first", clip],
    ["last", "data:audio/wav;base64,UklGRg=="],
  ] as const) {
    expect(await generate(role, undefined, url)).toMatchObject({
      success: false,
      errorType: ErrorResponseTypes.BAD_REQUEST,
      message: t("post.errors.inputMediaRequired"),
    });
  }
  expect(balance).not.toHaveBeenCalled();
  for (const role of ["reference", undefined, "first"] as const) {
    await generate(role);
    expect(balance.mock.lastCall?.[1]).toBe(
      models.videoClipCredits(model, role === "first" ? 4 : 8, undefined),
    );
  }
});
