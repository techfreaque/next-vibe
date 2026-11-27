import { describe, expect, it } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation } from "./i18n";
import { handleThreadDeleteError } from "./stale-delete";

const { t } = scopedTranslation.scopedT("en-US");

function capturingLogger(): {
  logger: EndpointLogger;
  warns: string[];
} {
  const warns: string[] = [];
  const base = createEndpointLogger(false, "en-US");
  const logger: EndpointLogger = {
    ...base,
    warn: (message: string): void => {
      warns.push(message);
    },
  };
  return { logger, warns };
}

const row = {
  threadId: "c359d3c5-9539-4aef-8bb9-dd78f83c6746",
  rootFolderId: DefaultFolderId.PRIVATE,
  folderId: null,
  list: "folder-contents" as const,
  createdAt: new Date(Date.now() - 60_000),
  updatedAt: new Date(Date.now() - 30_000),
  ownerKnown: true,
  streamingState: null,
  isActive: false,
};

describe("handleThreadDeleteError", () => {
  it("logs the stale row and reconciles the list on 404", async () => {
    const { logger, warns } = capturingLogger();
    let refetched = 0;
    handleThreadDeleteError(
      fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      }),
      row,
      logger,
      async () => {
        refetched += 1;
      },
    );
    await Promise.resolve();
    expect(refetched).toBe(1);
    expect(warns).toEqual([
      "[thread-delete] Sidebar listed a thread the server no longer has",
    ]);
  });

  it("leaves other failures to the caller", () => {
    const { logger, warns } = capturingLogger();
    let refetched = 0;
    handleThreadDeleteError(
      fail({
        message: t("delete.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      }),
      row,
      logger,
      async () => {
        refetched += 1;
      },
    );
    expect(refetched).toBe(0);
    expect(warns).toEqual([]);
  });
});
