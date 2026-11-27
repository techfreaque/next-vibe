import { afterEach, expect, it, mock, spyOn } from "bun:test";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { buildStorageFilePath } from "../chat/storage/storage-url";
import { ChatFileRepository } from "../chat/threads/files/[threadId]/[filename]/repository";
import { scopedTranslation } from "./i18n";
import { ViewImageRepository } from "./repository";

afterEach(() => mock.restore());

it("reports failed storage resolution without logging the image URL", async () => {
  const locale = "en-US";
  const { t } = scopedTranslation.scopedT(locale);
  const logger = createEndpointLogger(false, locale);
  const warn = spyOn(logger, "warn").mockImplementation(() => undefined);
  const user: JWTPublicPayloadType = {
    isPublic: true,
    leadId: crypto.randomUUID(),
    roles: [UserPermissionRole.PUBLIC],
  };
  const context = rootlessToolExecutionContext();
  const threadId = crypto.randomUUID();
  context.threadId = threadId;
  const url = `${buildStorageFilePath(threadId, "sample.jpg")}?download=fixture-name`;
  const read = spyOn(ChatFileRepository, "getFile").mockResolvedValue({
    buffer: Buffer.alloc(0),
    contentType: "text/plain",
  });

  expect(
    await ViewImageRepository.viewImage({ url }, user, t, locale, logger, context),
  ).toMatchObject({ success: false, errorType: ErrorResponseTypes.NOT_FOUND });
  expect(read).toHaveBeenCalledTimes(1);
  expect(warn).toHaveBeenCalledWith(
    "[ViewImage] Image not found or fetch failed",
    {
      stage: "reference-resolution",
      sourceKind: "thread-storage",
      suppliedExtension: "jpg",
      sameThread: true,
      resolvedMediaType: undefined,
    },
  );
  expect(JSON.stringify(warn.mock.calls)).not.toContain("fixture-name");
});
