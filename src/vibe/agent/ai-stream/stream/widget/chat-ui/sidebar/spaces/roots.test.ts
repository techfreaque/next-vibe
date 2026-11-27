import { describe, expect, test } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { UserRole } from "next-vibe/identity/roles/enum";

import { spaceEntries, visibleRoots } from "./roots";

describe("chat space visibility", () => {
  const id = "118466b7-88c9-4656-ac15-d5dcc92046f2";
  test("guests see both accessible spaces", () => {
    expect(
      visibleRoots({ isPublic: true, leadId: id, roles: [UserRole.PUBLIC] }),
    ).toEqual([DefaultFolderId.INCOGNITO, DefaultFolderId.PUBLIC]);
  });
  test("members see their own background tasks", () => {
    expect(
      visibleRoots({
        isPublic: false,
        leadId: id,
        id,
        roles: [UserRole.CUSTOMER],
      }),
    ).toEqual([
      DefaultFolderId.PRIVATE,
      DefaultFolderId.INCOGNITO,
      DefaultFolderId.SHARED,
      DefaultFolderId.PUBLIC,
      DefaultFolderId.BACKGROUND,
    ]);
  });
  test("admins also see all root folders", () => {
    expect(
      visibleRoots({
        isPublic: false,
        leadId: id,
        id,
        roles: [UserRole.ADMIN],
      }).toSorted(),
    ).toEqual(Object.values(DefaultFolderId).toSorted());
  });
});

describe("space entries", () => {
  const id = "118466b7-88c9-4656-ac15-d5dcc92046f2";
  test("guests see account-only spaces as locked", () => {
    expect(
      spaceEntries({ isPublic: true, leadId: id, roles: [UserRole.PUBLIC] }),
    ).toEqual([
      { id: DefaultFolderId.PRIVATE, locked: true },
      { id: DefaultFolderId.INCOGNITO, locked: false },
      { id: DefaultFolderId.SHARED, locked: true },
      { id: DefaultFolderId.PUBLIC, locked: false },
    ]);
  });
  test("members see their permitted root spaces with nothing locked", () => {
    const entries = spaceEntries({
      isPublic: false,
      leadId: id,
      id,
      roles: [UserRole.CUSTOMER],
    });
    expect(entries.map((entry) => entry.id)).toEqual([
      DefaultFolderId.PRIVATE,
      DefaultFolderId.INCOGNITO,
      DefaultFolderId.SHARED,
      DefaultFolderId.PUBLIC,
      DefaultFolderId.BACKGROUND,
    ]);
    expect(entries.every((entry) => !entry.locked)).toBe(true);
  });
});
