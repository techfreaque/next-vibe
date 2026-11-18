import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { expect, it } from "vitest";

import { createE2EFreeGuest } from "../ai-stream/testing/e2e-credit-user";
import { recentStudioHistory } from "./history";
import { MediaStudioRepository } from "./repository";

it("persists async progress for its owner and keeps other visitors and kinds isolated", async () => {
  const guest = await createE2EFreeGuest("studio-history");
  const other = await createE2EFreeGuest("studio-history-other");
  const publicUser = (leadId: string): JwtPayloadType => ({
    isPublic: true,
    leadId,
    roles: [UserPermissionRole.PUBLIC],
  });
  const user = publicUser(guest.leadId);
  try {
    const result = await MediaStudioRepository.run({
      save: true,
      user,
      kind: "video",
      model: "test",
      title: "Blue boat",
      locale: defaultLocale,
      logger: createEndpointLogger(false, defaultLocale),
      generate: async (progress) => {
        expect((await recentStudioHistory(user, "video"))[0]?.status).toBe(
          "queued",
        );
        for (const status of ["running", "saving"] as const) {
          await progress?.(status);
          expect((await recentStudioHistory(user, "video"))[0]?.status).toBe(
            status,
          );
        }
        return success({ videoUrl: "/test/boat.mp4", creditCost: 2.6 });
      },
    });
    expect(result.success).toBe(true);
    expect(await recentStudioHistory(user)).toMatchObject([
      {
        title: "Blue boat",
        status: "completed",
        url: "/test/boat.mp4",
        credits: 2.6,
      },
    ]);
    expect(await recentStudioHistory(user, "image")).toEqual([]);
    expect(await recentStudioHistory(publicUser(other.leadId))).toEqual([]);
  } finally {
    await guest.remove();
    await other.remove();
  }
});
