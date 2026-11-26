import { describe, expect, it } from "bun:test";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";

import { isBalanceCutStreamError } from "./balance-cut";

describe("isBalanceCutStreamError", () => {
  it("recognizes the budget-cut row finalize writes (plain text, 402 in streamError)", () => {
    expect(
      isBalanceCutStreamError({
        metadata: {
          streamError: {
            key: ErrorResponseTypes.PAYMENT_REQUIRED.errorKey,
            status: 402,
          },
        },
      }),
    ).toBe(true);
  });

  it("leaves provider failures and rows without stream errors alone", () => {
    expect(
      isBalanceCutStreamError({
        metadata: {
          streamError: {
            key: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR.errorKey,
            status: 500,
          },
        },
      }),
    ).toBe(false);
    expect(isBalanceCutStreamError({ metadata: {} })).toBe(false);
  });
});
