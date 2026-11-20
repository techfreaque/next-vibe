import { expect, test } from "bun:test";

import { applyQueryFormInitialState } from "./query-form-initial-state";

test("explicit route inputs replace stored fields and keep saved siblings", () => {
  expect(
    applyQueryFormInitialState(
      {
        statusFilters: { search: "old@example.com", match: "verified" },
        page: 5,
        pageSize: 25,
        roles: ["admin"],
      },
      { statusFilters: { search: "new@example.com" }, page: 1, roles: [] },
    ),
  ).toEqual({
    statusFilters: { search: "new@example.com", match: "verified" },
    page: 1,
    pageSize: 25,
    roles: [],
  });
});

test("explicit empty values can clear saved filters", () => {
  expect(
    applyQueryFormInitialState({ search: "old", page: 2 }, { search: "" }),
  ).toEqual({
    search: "",
    page: 2,
  });
});
