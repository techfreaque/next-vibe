import { describe, expect, it } from "bun:test";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";

import type { ImageGenerationPostResponseOutput } from "./definition";

import { imageGenerationKey, runOncePerKey } from "./in-flight";

const base = {
  threadId: "thread-1",
  callerId: "user-1",
  model: "seedream-5.5",
  prompt: "A Coca-Cola can",
  size: "post.size.square1024",
  aspectRatio: undefined,
  inputMediaUrl: undefined,
};

describe("one image generation per identical in-flight request", () => {
  it("joins a parallel identical call: one provider run, one charge", async () => {
    let runs = 0;
    const generate = async (): Promise<
      ResponseType<ImageGenerationPostResponseOutput>
    > => {
      runs += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return success({ imageUrl: "/file.png", creditCost: 2.6 });
    };
    const join = (
      shared: ResponseType<ImageGenerationPostResponseOutput>,
    ): ResponseType<ImageGenerationPostResponseOutput> =>
      shared.success ? success({ ...shared.data, creditCost: 0 }) : shared;

    const key = imageGenerationKey(base);
    const [first, second] = await Promise.all([
      runOncePerKey(key, generate, join),
      runOncePerKey(key, generate, join),
    ]);
    expect(runs).toBe(1);
    expect(first.success && first.data.creditCost).toBe(2.6);
    expect(second.success && second.data.creditCost).toBe(0);
    expect(second.success && second.data.imageUrl).toBe("/file.png");

    // Finished: a later identical request ("again") generates anew.
    await runOncePerKey(key, generate, join);
    expect(runs).toBe(2);
  });

  it("never dedupes standalone calls or different requests", () => {
    expect(imageGenerationKey({ ...base, threadId: undefined })).toBeNull();
    expect(imageGenerationKey(base)).not.toBe(
      imageGenerationKey({ ...base, prompt: "A Pepsi can" }),
    );
    expect(imageGenerationKey(base)).not.toBe(
      imageGenerationKey({ ...base, aspectRatio: "16:9" }),
    );
    expect(imageGenerationKey(base)).not.toBe(
      imageGenerationKey({ ...base, callerId: "user-2" }),
    );
  });
});
