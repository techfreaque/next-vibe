import { expect, test } from "bun:test";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { listUserMediaModels } from "@/v1/shared/media-models";

import { CREATE_KINDS } from "./create-kinds";
import { studioSummaries } from "./studio-data";
import { studioModels } from "./studio-models";

test("studio hub counts every visible modality and uses the same cheapest model as its tool", async () => {
  const user: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-4000-8000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };
  const eligible = listUserMediaModels(user, await getEnvAvailability());
  const summaries = await studioSummaries(user);
  expect(summaries.map((summary) => summary.kind)).toEqual([...CREATE_KINDS]);
  for (const { kind, count, cheapest } of summaries) {
    const eligibleIds = new Set(
      eligible
        .filter(
          (entry) =>
            entry.modality === (kind === "transcribe" ? "transcription" : kind),
        )
        .map((entry) => entry.id),
    );
    const models = await studioModels(user, kind);
    expect(new Set(models.map((model) => model.id))).toEqual(eligibleIds);
    expect(count).toBe(eligibleIds.size);
    expect(cheapest).toEqual(
      models.find((model) => !model.requiresImage && !isUncensoredContent(model.content)) ??
        models[0],
    );
  }
});
