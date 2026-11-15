import { describe, expect, it } from "bun:test";

import type { TranslatedKeyType } from "../../core/i18n/core/scoped-translation";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { settleMutationResult } from "./mutation-executor";

// oxlint-disable-next-line restricted/restricted-syntax -- test fixture text
const notFoundMessage = "Message Not Found" as TranslatedKeyType;
// oxlint-disable-next-line restricted/restricted-syntax -- test fixture text
const unexpectedMessage = "unexpected" as TranslatedKeyType;

const notFound: ErrorResponseType = fail({
  message: notFoundMessage,
  errorType: ErrorResponseTypes.NOT_FOUND,
});

const toUnexpected = (parsedError: Error): ErrorResponseType =>
  fail({
    message: unexpectedMessage,
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
    cause: fail({
      // oxlint-disable-next-line restricted/restricted-syntax -- test fixture text
      message: parsedError.message as TranslatedKeyType,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }),
  });

describe("settleMutationResult (useApiMutation mutateAsync contract)", () => {
  it("passes a success through unchanged", async () => {
    const result = await settleMutationResult(
      (): Promise<ResponseType<{ id: string }>> =>
        Promise.resolve(success({ id: "a" })),
      toUnexpected,
    );
    expect(result).toEqual(success({ id: "a" }));
  });

  it("resolves (does not reject) with the ErrorResponseType React Query rejected with", async () => {
    const result = await settleMutationResult(
      (): Promise<ResponseType<{ id: string }>> => Promise.reject(notFound),
      toUnexpected,
    );
    expect(result).toBe(notFound);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType.errorCode).toBe(404);
    }
  });

  it("turns any other rejection into a fail() via onUnexpected", async () => {
    const result = await settleMutationResult(
      (): Promise<ResponseType<{ id: string }>> =>
        Promise.reject(new Error("boom")),
      toUnexpected,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe(unexpectedMessage);
      expect(String(result.cause?.message)).toBe("boom");
    }
  });
});
