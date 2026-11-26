import { expect, test } from "bun:test";

import { applyQueryFormInitialState } from "./query-form-initial-state";
import {
  getQueryFormResponseDefaults,
  restoreSavedQueryForm,
} from "./query-form-reconciliation";

test("a saved filter cannot replace edits made while the form was restoring", async () => {
  const saved = Promise.withResolvers<string>();
  let values = { search: "restored@example.com", page: 2 };
  const applied: string[] = [];

  const restore = restoreSavedQueryForm({
    readSaved: () => saved.promise,
    getValues: () => values,
    isCurrent: () => true,
    apply: (value) => {
      applied.push(value);
    },
  });

  values = { search: "new@example.com", page: 1 };
  saved.resolve('{"search":"previous@example.com","page":4}');
  await restore;

  expect(applied).toEqual([]);
});

test("an untouched form keeps saved defaults and explicit route parameters", async () => {
  const saved = Promise.withResolvers<string>();
  const initialState = { search: "restored@example.com" };
  const savedValues = { search: "previous@example.com", page: 2, limit: 40 };
  const savedJson = JSON.stringify(savedValues);
  let values = { ...initialState, page: 1, limit: 25 };
  const restore = restoreSavedQueryForm({
    readSaved: () => saved.promise,
    getValues: () => values,
    isCurrent: () => true,
    apply: (value) => {
      expect(value).toBe(savedJson);
      values = applyQueryFormInitialState(savedValues, initialState);
    },
  });
  saved.resolve(savedJson);
  await restore;

  expect(values).toEqual({
    search: "restored@example.com",
    page: 2,
    limit: 40,
  });
});

test("a replaced form cannot apply a pending restore", async () => {
  const saved = Promise.withResolvers<string>();
  let current = true;
  const applied: string[] = [];
  const restore = restoreSavedQueryForm({
    readSaved: () => saved.promise,
    getValues: () => ({ search: "restored@example.com" }),
    isCurrent: () => current,
    apply: (value) => {
      applied.push(value);
    },
  });

  current = false;
  saved.resolve('{"search":"previous@example.com"}');
  await restore;

  expect(applied).toEqual([]);
});

test("a directory response cannot resubmit the hidden form's older search", () => {
  const submitted = { search: "no-match@example.com", page: 1 };
  const hiddenForm = { search: "restored@example.com", page: 1 };
  const withResponse = { ...hiddenForm, limit: 25 };

  expect(
    getQueryFormResponseDefaults(submitted, hiddenForm, withResponse),
  ).toBeUndefined();
});

test("a response merging no missing request fields does not reset the form", () => {
  const query = { search: "no-match@example.com", page: 1 };
  expect(
    getQueryFormResponseDefaults(query, query, { ...query, page: 2 }),
  ).toBeUndefined();
});

test("a current response may fill missing request fields without changing edits", () => {
  const query = { page: 1 };
  const withResponse = { page: 2, accountId: "fixture-account" };
  expect(getQueryFormResponseDefaults(query, query, withResponse)).toEqual({
    page: 1,
    accountId: "fixture-account",
  });
});
