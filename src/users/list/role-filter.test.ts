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

import {
  SortOrder,
  UserRoleFilter,
  UserSortField,
  UserStatusFilter,
} from "../enum";
import listDefinitions from "./definition";

const endpoint = listDefinitions.GET;
const stamp = Date.now();
let customer: TestUser;

async function listIds(
  role: (typeof UserRoleFilter)[keyof typeof UserRoleFilter][],
  status: (typeof UserStatusFilter)[keyof typeof UserStatusFilter][] = [],
): Promise<string[]> {
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint,
    data: {
      searchFilters: { role, status },
      sortingOptions: {
        sortBy: UserSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
      paginationInfo: { page: 1, limit: 500 },
    },
    user: await resolveTestAdminUser(),
  });
  expect(res.success, res.success ? "" : res.message).toBe(true);
  return res.success ? res.data.response.users.map((u) => u.id) : [];
}

describe("users list filters", () => {
  beforeAll(async () => {
    const created = await createTestUser(`role-filter-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (created.success) {
      customer = created.data;
    }
  });

  afterAll(async () => {
    await deleteTestUser(customer.user.id);
  });

  it("ADMIN filter returns admins only", async () => {
    const admin = await resolveTestAdminUser();
    const ids = await listIds([UserRoleFilter.ADMIN]);
    expect(ids).toContain(admin.id);
    expect(ids).not.toContain(customer.user.id);
  });

  it("CUSTOMER filter includes customers", async () => {
    const ids = await listIds([UserRoleFilter.CUSTOMER]);
    expect(ids).toContain(customer.user.id);
  });

  it("multiple roles match any of them; ALL means no filter", async () => {
    const admin = await resolveTestAdminUser();
    const both = await listIds([UserRoleFilter.ADMIN, UserRoleFilter.CUSTOMER]);
    expect(both).toContain(admin.id);
    expect(both).toContain(customer.user.id);
    const all = await listIds([UserRoleFilter.ALL]);
    expect(all).toContain(customer.user.id);
  });

  it("status multi-select matches any selected status", async () => {
    const ids = await listIds(
      [],
      [UserStatusFilter.INACTIVE, UserStatusFilter.ACTIVE],
    );
    expect(ids).toContain(customer.user.id);
    const inactiveOnly = await listIds([], [UserStatusFilter.INACTIVE]);
    expect(inactiveOnly).not.toContain(customer.user.id);
  });
});
