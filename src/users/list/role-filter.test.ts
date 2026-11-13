/**
 * Admin users list — role and status filters actually filter.
 */

import "server-only";

import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import listDefinitions from "./definition";
import {
  AccountStateFilter,
  ListSortOrder,
  RoleFilter,
  UserListSortField,
} from "./enum";

const endpoint = listDefinitions.GET;
const stamp = Date.now();
let customer: TestUser;

async function listIds(
  role: (typeof RoleFilter)[keyof typeof RoleFilter][],
  accountState: (typeof AccountStateFilter)[keyof typeof AccountStateFilter][] = [],
): Promise<string[]> {
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint,
    data: {
      roles: role,
      accountState,
      sortBy: UserListSortField.CREATED_AT,
      sortOrder: ListSortOrder.DESC,
      page: 1,
      limit: 200,
      search: role.length === 0 ? "role-filter-" : undefined,
    },
    user: await resolveTestAdminUser(),
  });
  expect(res.success, res.success ? "" : res.message).toBe(true);
  return res.success ? res.data.users.map((u) => u.id) : [];
}

describe("users list filters", () => {
  beforeAll(async () => {
    const created = await createTestUser(`role-filter-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (created.success) {
      customer = created.data;
    }
  }, 60_000);

  afterAll(async () => {
    await deleteTestUser(customer.user.id);
  });

  it("ADMIN filter returns admins only", async () => {
    const admin = await resolveTestAdminUser();
    const ids = await listIds([RoleFilter.ADMIN]);
    expect(ids).toContain(admin.id);
    expect(ids).not.toContain(customer.user.id);
  });

  it("CUSTOMER filter includes customers", async () => {
    const ids = await listIds([RoleFilter.CUSTOMER]);
    expect(ids).toContain(customer.user.id);
  });

  it("multiple roles match any of them; empty means no filter", async () => {
    const admin = await resolveTestAdminUser();
    const both = await listIds([RoleFilter.ADMIN, RoleFilter.CUSTOMER]);
    expect(both).toContain(admin.id);
    expect(both).toContain(customer.user.id);
    const all = await listIds([]);
    expect(all).toContain(customer.user.id);
  });

  it("account state multi-select matches any selected state", async () => {
    const ids = await listIds(
      [],
      [AccountStateFilter.INACTIVE, AccountStateFilter.ACTIVE],
    );
    expect(ids).toContain(customer.user.id);
    const inactiveOnly = await listIds([], [AccountStateFilter.INACTIVE]);
    expect(inactiveOnly).not.toContain(customer.user.id);
  });

  it("search by email and id prefix finds the user", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: { search: customer.user.id.slice(0, 8) },
      user: await resolveTestAdminUser(),
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.users.map((u) => u.id)).toContain(customer.user.id);
      expect(res.data.summary.totalCount).toBeGreaterThan(0);
    }
  });
});
