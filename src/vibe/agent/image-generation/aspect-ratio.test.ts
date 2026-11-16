import { describe, expect, it } from "bun:test";

import {
  aspectRatioToImageSize,
  describeAspectRatio,
  parseAspectRatio,
  snapAspectRatio,
} from "./aspect-ratio";
import { ImageSize } from "./enum";

describe("image aspect ratios", () => {
  it("parses W:H and rejects junk", () => {
    expect(parseAspectRatio("16:9")).toBeCloseTo(16 / 9);
    expect(parseAspectRatio("9:19.5")).toBeCloseTo(9 / 19.5);
    expect(parseAspectRatio("wide")).toBeNull();
    expect(parseAspectRatio("0:9")).toBeNull();
  });

  it("keeps a supported ratio and snaps an unsupported one to the closest", () => {
    const modelsLab = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    expect(snapAspectRatio("16:9", modelsLab)).toBe("16:9");
    expect(snapAspectRatio("21:9", modelsLab)).toBe("16:9");
    expect(snapAspectRatio("2:3", modelsLab)).toBe("3:4");
    // gpt-5-image only does 1:1 / 3:2 / 2:3
    expect(snapAspectRatio("16:9", ["1:1", "3:2", "2:3"])).toBe("3:2");
    // No list: the model takes any ratio
    expect(snapAspectRatio("21:9", undefined)).toBe("21:9");
    expect(snapAspectRatio("21:9", [])).toBe("21:9");
  });

  it("maps a ratio to the nearest size preset for size-based providers", () => {
    expect(aspectRatioToImageSize("16:9")).toBe(ImageSize.LANDSCAPE_1792);
    expect(aspectRatioToImageSize("21:9")).toBe(ImageSize.LANDSCAPE_1792);
    expect(aspectRatioToImageSize("9:16")).toBe(ImageSize.PORTRAIT_1792);
    expect(aspectRatioToImageSize("1:1")).toBe(ImageSize.SQUARE_1024);
    // 4:3 sits closer to 7:4 than to 1:1 on a log scale
    expect(aspectRatioToImageSize("4:3")).toBe(ImageSize.LANDSCAPE_1792);
    // A model limited to square gets square
    expect(aspectRatioToImageSize("16:9", [ImageSize.SQUARE_1024])).toBe(
      ImageSize.SQUARE_1024,
    );
  });

  it("describes real pixel sizes honestly", () => {
    expect(describeAspectRatio(2048, 2048)).toBe("1:1");
    expect(describeAspectRatio(2048, 1152)).toBe("16:9");
    expect(describeAspectRatio(1792, 1024)).toBe("7:4");
    expect(describeAspectRatio(1024, 1792)).toBe("4:7");
    expect(describeAspectRatio(1000, 300)).toBe("10:3");
  });
});
