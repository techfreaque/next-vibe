import { describe, expect, it, mock } from "bun:test";

import ledgerDefinition from "@/chart-of-accounts/ledger/[accountId]/definition";

import type { TranslatedKeyType } from "../../core/i18n/core/scoped-translation";
import type { ErrorResponseType, ResponseType } from "../../core/route/response.schema";
import { ErrorResponseTypes, fail, success } from "../../core/route/response.schema";
import { executeMutation, settleMutationResult } from "./mutation-executor";

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
      (): Promise<ResponseType<{ id: string }>> => Promise.resolve(success({ id: "a" })),
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
      (): Promise<ResponseType<{ id: string }>> => Promise.reject(new Error("boom")),
      toUnexpected,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe(unexpectedMessage);
      expect(String(result.cause?.message)).toBe("boom");
    }
  });
});

it("reports an onError callback failure without invoking the callback twice", async () => {
  void mock.module("./call-api", () => ({
    callApi: () => Promise.resolve(notFound),
  }));
  const onError = mock(() => Promise.reject(new Error("callback fixture")));
  const error = mock(() => undefined);
  const result = await executeMutation({
    endpoint: ledgerDefinition.GET,
    logger: {
      isDebugEnabled: false,
      error,
      warn: () => undefined,
      info: () => undefined,
      debug: () => undefined,
      vibe: () => undefined,
    },
    requestData: { page: 1, pageSize: 20 },
    pathParams: { accountId: "00000000-0000-4000-8000-0000000000aa" },
    locale: "en-GLOBAL",
    user: {
      isPublic: false,
      id: "00000000-0000-4000-8000-000000000001",
      leadId: "00000000-0000-4000-8000-000000000002",
      roles: [],
    },
    options: { onError },
  });

  expect(result.success).toBe(false);
  expect(onError).toHaveBeenCalledTimes(1);
  expect(error).toHaveBeenCalledWith(
    "Mutation failed",
    expect.any(Error),
    expect.objectContaining({ phase: "on-error", status: 500 }),
  );
});
