import { randomUUID } from "node:crypto";

import { afterAll, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  JWTPublicPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { NextRequest } from "next-vibe/ui/lib/request";

import exportDefinition from "../../[id]/export/definition";
import { GET } from "../../[id]/export/route";
import { customSkills } from "../../db";
import { SkillOwnershipType, SkillStatus } from "../../enum";
import importDefinition from "./definition";
import { SkillCardImportVisibility } from "./enum";
import { scopedTranslation } from "./i18n";
import { SkillCardImportRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const context = rootlessToolExecutionContext();
const { t } = scopedTranslation.scopedT(defaultLocale);
const guest: JWTPublicPayloadType = {
  isPublic: true,
  leadId: randomUUID(),
  roles: [UserPermissionRole.PUBLIC],
};

const disposableUsers: string[] = [];
afterAll(async () => {
  for (const userId of disposableUsers) {
    await deleteTestUser(userId);
  }
});

describe("portable skill access", () => {
  it("imports privately by default and allows only the owner to export until public", async () => {
    const stamp = randomUUID();
    const owner = await createTestUser(
      `card-${stamp}@example.invalid`,
      "Public Test Name",
    );
    expect(owner.success).toBe(true);
    if (!owner.success) {
      return;
    }
    const user = owner.data.user;
    disposableUsers.push(user.id);
    const payload = JSON.stringify({
      name: `Card ${stamp}`,
      description: "A fixture for skill ownership",
      creator: "Card Artist",
      avatar: "https://example.invalid/picture.png",
    });
    const input = importDefinition.POST.requestSchema.parse({ card: payload });
    expect(input.visibility).toBe(SkillCardImportVisibility.PRIVATE);

    const imported = await sendTestRequest({
      endpoint: importDefinition.POST,
      data: input,
      user,
      toolExecutionContext: context,
    });
    expect(imported.success).toBe(true);
    if (!imported.success) {
      return;
    }
    expect(imported.data.avatarUrl).toBeNull();
    expect(imported.data.sourceUrl).toBe("");
    const [row] = await db
      .select()
      .from(customSkills)
      .where(eq(customSkills.slug, imported.data.id));
    expect(row?.ownershipType).toBe(SkillOwnershipType.USER);
    expect(row?.status).toBe(SkillStatus.DRAFT);

    const repeated = await sendTestRequest({
      endpoint: importDefinition.POST,
      data: input,
      user,
      toolExecutionContext: context,
    });
    expect(
      repeated.success && repeated.data.alreadyImported && repeated.data.id,
    ).toBe(imported.data.id);

    const other: JwtPrivatePayloadType = {
      ...user,
      id: randomUUID(),
      leadId: randomUUID(),
    };
    const exportInput = {
      endpoint: exportDefinition.GET,
      urlPathParams: { id: imported.data.id },
      toolExecutionContext: context,
    };
    const admin: JwtPrivatePayloadType = {
      ...other,
      roles: [UserPermissionRole.ADMIN],
    };
    for (const reader of [guest, other, admin]) {
      const denied = await sendTestRequest({ ...exportInput, user: reader });
      expect(denied.success).toBe(false);
      expect(!denied.success && denied.errorType).toEqual(
        ErrorResponseTypes.NOT_FOUND,
      );
    }
    const allowed = await sendTestRequest({ ...exportInput, user });
    expect(allowed.success).toBe(true);
    if (allowed.success) {
      expect(allowed.data.card).toContain("Card Artist");
      for (const secret of [
        user.id,
        user.leadId,
        owner.data.email,
        owner.data.publicName,
        "example.invalid",
        '"skillId"',
      ]) {
        expect(allowed.data.card).not.toContain(secret);
      }
    }

    const auth = await createTestSessionToken(user);
    expect(auth.success).toBe(true);
    if (auth.success) {
      const response = await GET(
        new NextRequest(
          `http://localhost/api/${defaultLocale}/vibe/agent/skills/${imported.data.id}/export`,
          { headers: { authorization: `Bearer ${auth.data}` } },
        ),
        {
          params: Promise.resolve({
            locale: defaultLocale,
            id: imported.data.id,
          }),
        },
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    }

    await db
      .update(customSkills)
      .set({
        ownershipType: SkillOwnershipType.PUBLIC,
        status: SkillStatus.PUBLISHED,
      })
      .where(eq(customSkills.slug, imported.data.id));
    const published = await sendTestRequest({ ...exportInput, user: guest });
    expect(published.success).toBe(true);
    if (published.success) {
      expect(published.data.card).toContain(`/skill/${imported.data.id}`);
    }
  });

  it("rejects an admin-only built-in even for admins and allows public built-ins", async () => {
    const admin: JwtPrivatePayloadType = {
      id: randomUUID(),
      isPublic: false,
      leadId: randomUUID(),
      roles: [UserPermissionRole.ADMIN],
    };
    const request = {
      endpoint: exportDefinition.GET,
      toolExecutionContext: context,
    };
    for (const user of [admin, guest]) {
      for (const id of ["vibe-coder", "vibe-coder__default"]) {
        const denied = await sendTestRequest({
          ...request,
          urlPathParams: { id },
          user,
        });
        expect(denied.success).toBe(false);
        expect(!denied.success && denied.errorType).toEqual(
          ErrorResponseTypes.NOT_FOUND,
        );
      }
    }
    const publicCard = await sendTestRequest({
      ...request,
      urlPathParams: { id: "storyteller" },
      user: guest,
    });
    expect(publicCard.success).toBe(true);
  });

  it("rejects guests and counts failed attempts by signed-in account before parsing", async () => {
    const attempt = (
      id: string,
      leadId = randomUUID(),
    ): ReturnType<typeof SkillCardImportRepository.importCard> =>
      SkillCardImportRepository.importCard(
        { card: "{invalid", visibility: SkillCardImportVisibility.PRIVATE },
        { id, isPublic: false, leadId, roles: [UserPermissionRole.CUSTOMER] },
        logger,
        defaultLocale,
        t,
        context,
      );
    const denied = await SkillCardImportRepository.importCard(
      { card: "{invalid", visibility: SkillCardImportVisibility.PRIVATE },
      guest,
      logger,
      defaultLocale,
      t,
      context,
    );
    expect(!denied.success && denied.errorType).toEqual(
      ErrorResponseTypes.UNAUTHORIZED,
    );

    const userId = randomUUID();
    for (let index = 0; index < 60; index++) {
      const result = await attempt(userId);
      expect(!result.success && result.errorType).toEqual(
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }
    const blocked = await attempt(userId);
    expect(!blocked.success && blocked.errorType).toEqual(
      ErrorResponseTypes.BAD_REQUEST,
    );
    const other = await attempt(randomUUID());
    expect(!other.success && other.errorType).toEqual(
      ErrorResponseTypes.VALIDATION_ERROR,
    );
  });
});
