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

import viewDefinitions from "../view/definition";
import listDefinitions from "./definition";
import { AccountStateFilter, ListSortOrder, RoleFilter, UserListSortField } from "./enum";

const endpoint = listDefinitions.GET;
const stamp = Date.now();
let customer: TestUser;

async function listIds(
  role: (typeof RoleFilter)[keyof typeof RoleFilter][],
  accountState: (typeof AccountStateFilter)[keyof typeof AccountStateFilter][] = [],
  search?: string,
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
      search: search ?? (role.length === 0 ? "role-filter-" : undefined),
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
    const eitherRole = [RoleFilter.ADMIN, RoleFilter.CUSTOMER];
    const matchingAdmin = await listIds(eitherRole, [], admin.id);
    const matchingCustomer = await listIds(eitherRole, [], customer.user.id);
    expect(matchingAdmin).toContain(admin.id);
    expect(matchingCustomer).toContain(customer.user.id);
    const all = await listIds([]);
    expect(all).toContain(customer.user.id);
  });

  it("account state multi-select matches any selected state", async () => {
    const ids = await listIds([], [AccountStateFilter.INACTIVE, AccountStateFilter.ACTIVE]);
    expect(ids).toContain(customer.user.id);
    const inactiveOnly = await listIds([], [AccountStateFilter.INACTIVE]);
    expect(inactiveOnly).not.toContain(customer.user.id);
  });

  it("finds the user by ID prefix", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: endpoint.requestSchema.parse({
        search: customer.user.id.slice(0, 8),
      }),
      user: await resolveTestAdminUser(),
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.users.map((u) => u.id)).toContain(customer.user.id);
      expect(res.data.summary.totalCount).toBeGreaterThan(0);
    }
  });

  it("finds an account by email and opens the same user", async () => {
    const user = await resolveTestAdminUser();
    const found = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: endpoint.requestSchema.parse({ search: customer.email }),
      user,
    });
    expect(found.success).toBe(true);
    if (!found.success) {
      return;
    }
    expect(found.data.users.map((row) => row.id)).toEqual([customer.user.id]);
    const account = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: viewDefinitions.GET,
      data: { userId: customer.user.id },
      user,
    });
    expect(account.success, account.success ? "" : account.message).toBe(true);
    if (account.success) {
      expect(account.data.basicInfo.id).toBe(customer.user.id);
      expect(account.data.basicInfo.email).toBe(customer.email);
      expect(account.data.payments).toEqual([]);
      expect(account.data.subscriptions).toEqual([]);
    }
  });

  it("treats punctuation in an email query literally", async () => {
    const found = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: endpoint.requestSchema.parse({
        search: customer.email.replace("role-filter", "role_filter"),
      }),
      user: await resolveTestAdminUser(),
    });
    expect(found.success).toBe(true);
    if (found.success) {
      expect(found.data.summary.totalCount).toBe(0);
    }
  });

  it("keeps account search and detail admin-only", async () => {
    const [search, detail] = await Promise.all([
      sendTestRequest({
        toolExecutionContext: undefined,
        endpoint,
        data: endpoint.requestSchema.parse({ search: customer.email }),
        user: customer.user,
      }),
      sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: viewDefinitions.GET,
        data: { userId: customer.user.id },
        user: customer.user,
      }),
    ]);
    expect(search.success).toBe(false);
    expect(detail.success).toBe(false);
  });
});
