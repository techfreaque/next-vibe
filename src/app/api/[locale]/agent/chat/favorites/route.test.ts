/**
 * Favorites Test Suite — Endpoint Validation + CRUD Integration
 *
 * Part A: Auto-generated tests for all favorite endpoints (schema, auth, examples).
 * Part B: Sequential CRUD integration tests using the admin user.
 *         Creates favorites, reads/updates/reorders/deletes them.
 *         All IDs in responses must be slugs, never UUIDs.
 */

// Testing infrastructure - test descriptions are for developers, not end users

import { and, eq, like } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { testEndpoint } from "@/app/api/[locale]/system/check/testing/testing-suite";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

import { chatFavorites } from "./db";
import { isUuid } from "../slugify";
import { ModelSelectionType, IntelligenceLevel } from "../skills/enum";

// ── Definition imports ───────────────────────────────────────────────────────

import favoritesListEndpoint from "./definition";
import favoriteCreateEndpoint from "./create/definition";
import favoriteSingleEndpoint from "./[id]/definition";
import favoriteReorderEndpoint from "./reorder/definition";

// ── Part A: Auto-generated endpoint tests ────────────────────────────────────

testEndpoint(favoritesListEndpoint.GET);
testEndpoint(favoriteCreateEndpoint.POST);
testEndpoint(favoriteSingleEndpoint.GET);
testEndpoint(favoriteSingleEndpoint.PATCH);
testEndpoint(favoriteSingleEndpoint.DELETE);
testEndpoint(favoriteReorderEndpoint.POST);

// ── Part B: CRUD Integration Tests ───────────────────────────────────────────

const TEST_TIMEOUT = 60_000;

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

/** Assert a string is a slug (lowercase, dashes, digits — never a UUID). */
function expectSlug(value: string, label: string): void {
  expect(isUuid(value), `${label} should not be a UUID: ${value}`).toBe(false);
  expect(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(value),
    `${label} should be a valid slug: ${value}`,
  ).toBe(true);
}

/** Assert a skillId is slug-based (may contain __ for variants but never a UUID). */
function expectSlugSkillId(value: string, label: string): void {
  // A merged skillId can be "slug" or "slug__variant"
  const parts = value.split("__");
  expectSlug(parts[0], `${label} (base)`);
  if (parts[1]) {
    // Variant part can be any string but should not be a UUID
    expect(isUuid(parts[1]), `${label} variant should not be a UUID: ${parts[1]}`).toBe(false);
  }
}

describe("Favorites CRUD Integration", () => {
  let adminUser: JwtPrivatePayloadType;
  let createdFavSlug1: string;
  let createdFavSlug2: string;
  /** Track slugs we created so afterAll can clean up even on partial failures */
  const createdSlugs: string[] = [];

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    adminUser = resolved;

    // Clean up any leftover test favorites from previous runs
    // Test favorites are created with "thea" skill → slugs start with "thea"
    // We clean up by looking for test-specific slugs we track
    await db
      .delete(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, adminUser.id),
          like(chatFavorites.slug, "test-fav-route-%"),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    // Final cleanup — delete by slug
    for (const slug of createdSlugs) {
      await db
        .delete(chatFavorites)
        .where(
          and(
            eq(chatFavorites.userId, adminUser.id),
            eq(chatFavorites.slug, slug),
          ),
        );
    }
    // Also clean up by pattern
    await db
      .delete(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, adminUser.id),
          like(chatFavorites.slug, "test-fav-route-%"),
        ),
      );
  });

  // Sequential suite: each test builds on the previous
  let suiteFailed = false;
  function fit(
    name: string,
    fn: () => Promise<void>,
    timeout?: number,
  ): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax
          throw err;
        }
      },
      timeout ?? TEST_TIMEOUT,
    );
  }

  // ── F1: Create favorite with default skill ──────────────────────────────
  fit("F1: create favorite returns slug-based id", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteCreateEndpoint.POST,
      data: {
        skillId: "thea",
        customVariantName: "Test Fav Route 1",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
      user: adminUser,
    });

    expect(response.success, `Create failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.id).toBeTruthy();
    expectSlug(response.data.id, "created favorite id");
    createdFavSlug1 = response.data.id;
    createdSlugs.push(createdFavSlug1);
  });

  // ── F2: GET favorite by slug ────────────────────────────────────────────
  fit("F2: get favorite by slug returns full config", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteSingleEndpoint.GET,
      urlPathParams: { id: createdFavSlug1 },
      user: adminUser,
    });

    expect(response.success, `GET failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    expectSlugSkillId(response.data.skillId, "favorite.skillId");
    expect(response.data.customVariantName).toBe("Test Fav Route 1");
    expect(response.data.modelSelection).toBeTruthy();
  });

  // ── F3: List favorites — created favorite appears ───────────────────────
  fit("F3: list favorites includes created favorite with slug IDs", async () => {
    const response = await sendTestRequest({
      endpoint: favoritesListEndpoint.GET,
      data: {},
      user: adminUser,
    });

    expect(response.success, `List failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    const found = response.data.favorites.find(
      (f: Record<string, unknown>) => f.id === createdFavSlug1,
    );
    expect(found, "Created favorite not found in list").toBeTruthy();
    if (!found) {
      return;
    }

    expectSlug(found.id, "listed favorite.id");
    expectSlugSkillId(found.skillId, "listed favorite.skillId");
    expect(typeof found.position).toBe("number");
  });

  // ── F4: Create second favorite ──────────────────────────────────────────
  fit("F4: create second favorite returns different slug", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteCreateEndpoint.POST,
      data: {
        skillId: "thea",
        customVariantName: "Test Fav Route 2",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.SMART,
            max: IntelligenceLevel.SMART,
          },
        },
      },
      user: adminUser,
    });

    expect(response.success, `Create 2 failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expectSlug(response.data.id, "second favorite id");
    createdFavSlug2 = response.data.id;
    createdSlugs.push(createdFavSlug2);

    // Should be different from first
    expect(createdFavSlug2).not.toBe(createdFavSlug1);
  });

  // ── F5: Reorder favorites ──────────────────────────────────────────────
  fit("F5: reorder favorites updates positions", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteReorderEndpoint.POST,
      data: {
        positions: [
          { id: createdFavSlug2, position: 0 },
          { id: createdFavSlug1, position: 1 },
        ],
      },
      user: adminUser,
    });

    expect(response.success, `Reorder failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.success).toBe(true);
  });

  // ── F6: List after reorder — verify order ──────────────────────────────
  fit("F6: list after reorder reflects new positions", async () => {
    const response = await sendTestRequest({
      endpoint: favoritesListEndpoint.GET,
      data: {},
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }

    const fav1 = response.data.favorites.find(
      (f: Record<string, unknown>) => f.id === createdFavSlug1,
    );
    const fav2 = response.data.favorites.find(
      (f: Record<string, unknown>) => f.id === createdFavSlug2,
    );

    if (fav1 && fav2) {
      expect(
        fav2.position,
        "Fav2 should be at lower position after reorder",
      ).toBeLessThan(fav1.position);
    }
  });

  // ── F7: Update favorite ────────────────────────────────────────────────
  fit("F7: update favorite changes model selection", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteSingleEndpoint.PATCH,
      urlPathParams: { id: createdFavSlug1 },
      data: {
        customVariantName: "Test Fav Route 1 Updated",
        modelSelection: {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange: {
            min: IntelligenceLevel.BRILLIANT,
            max: IntelligenceLevel.BRILLIANT,
          },
        },
      },
      user: adminUser,
    });

    expect(response.success, `Update failed: ${response.message}`).toBe(true);
  });

  // ── F8: GET after update — verify changes ──────────────────────────────
  // PATCH may regenerate the slug when customVariantName changes,
  // so we re-discover the slug from the list endpoint.
  fit("F8: get after update reflects changes", async () => {
    // Re-discover slug via list since PATCH may have changed it
    const listResponse = await sendTestRequest({
      endpoint: favoritesListEndpoint.GET,
      data: {},
      user: adminUser,
    });
    expect(listResponse.success, `F8 list failed: ${listResponse.message}`).toBe(true);
    if (!listResponse.success) {
      return;
    }

    const updatedFav = listResponse.data.favorites.find(
      (f: Record<string, unknown>) => f.customVariantName === "Test Fav Route 1 Updated",
    );
    expect(updatedFav, "Updated favorite not found in list").toBeTruthy();
    if (!updatedFav) {
      return;
    }

    // Update the tracked slug if it changed
    if (updatedFav.id !== createdFavSlug1) {
      createdSlugs.push(updatedFav.id);
      createdFavSlug1 = updatedFav.id;
    }

    expectSlug(updatedFav.id, "updated favorite.id");
    expectSlugSkillId(updatedFav.skillId, "updated favorite.skillId");
  });

  // ── F9: Delete first favorite ──────────────────────────────────────────
  fit("F9: delete favorite succeeds", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteSingleEndpoint.DELETE,
      urlPathParams: { id: createdFavSlug1 },
      user: adminUser,
    });

    expect(response.success, `Delete failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    // Response should have skillId as slug
    expectSlugSkillId(response.data.skillId, "deleted favorite.skillId");
  });

  // ── F10: GET deleted favorite → not found ──────────────────────────────
  fit("F10: get deleted favorite returns not found", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteSingleEndpoint.GET,
      urlPathParams: { id: createdFavSlug1 },
      user: adminUser,
    });

    expect(response.success).toBe(false);
    expect(response.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  // ── F11: Delete second favorite ────────────────────────────────────────
  fit("F11: delete second favorite succeeds", async () => {
    const response = await sendTestRequest({
      endpoint: favoriteSingleEndpoint.DELETE,
      urlPathParams: { id: createdFavSlug2 },
      user: adminUser,
    });

    expect(response.success, `Delete 2 failed: ${response.message}`).toBe(true);
  });

  // ── F12: List after deletion — both gone ───────────────────────────────
  fit("F12: list after deletion shows no test favorites", async () => {
    const response = await sendTestRequest({
      endpoint: favoritesListEndpoint.GET,
      data: {},
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }

    const testFavs = response.data.favorites.filter(
      (f: Record<string, unknown>) =>
        f.id === createdFavSlug1 || f.id === createdFavSlug2,
    );
    expect(testFavs.length).toBe(0);
  });
});
