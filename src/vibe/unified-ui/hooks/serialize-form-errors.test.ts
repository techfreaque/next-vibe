import { describe, expect, it } from "bun:test";
import type { FieldErrors } from "react-hook-form";

import {
  describeFormErrors,
  flattenFormErrors,
  serializeFormErrors,
} from "./serialize-form-errors";

interface FormShape {
  email: string;
  address: { city: string; zip: string };
  items: Array<{ name: string }>;
}

/** A fake DOM input whose fiber points back at itself, like a real ref. */
interface CircularRef {
  name: string;
  self?: CircularRef;
  focus: () => void;
}

function circularRef(name: string): CircularRef {
  const ref: CircularRef = { name, focus: () => undefined };
  ref.self = ref;
  return ref;
}

function buildErrors(): FieldErrors<FormShape> {
  return {
    email: {
      type: "too_small",
      message: "Email is required",
      ref: circularRef("email"),
    },
    address: {
      city: {
        type: "invalid_type",
        message: "Expected string",
        ref: circularRef("address.city"),
      },
    },
    items: [
      undefined,
      {
        name: {
          type: "required",
          message: "Name required",
          ref: circularRef("items.1.name"),
        },
      },
    ],
  };
}

describe("serializeFormErrors", () => {
  it("does not throw on circular refs where JSON.stringify does", () => {
    const errors = buildErrors();
    expect(() => JSON.stringify(errors)).toThrow();
    expect(() => serializeFormErrors(errors)).not.toThrow();
  });

  it("keeps field paths, types and messages and drops refs", () => {
    const flat = flattenFormErrors(buildErrors());
    expect(flat).toEqual([
      { field: "email", type: "too_small", message: "Email is required" },
      {
        field: "address.city",
        type: "invalid_type",
        message: "Expected string",
      },
      { field: "items.1.name", type: "required", message: "Name required" },
    ]);
    const json = serializeFormErrors(buildErrors());
    expect(json).not.toContain("ref");
    expect(json).not.toContain("focus");
    expect(JSON.parse(json)).toEqual(flat);
  });

  it("keeps array root errors", () => {
    const errors: FieldErrors<FormShape> = {
      items: { root: { type: "too_small", message: "Add one item" } },
    };
    expect(flattenFormErrors(errors)).toEqual([
      { field: "items.root", type: "too_small", message: "Add one item" },
    ]);
  });

  it("returns an empty list for no errors", () => {
    expect(serializeFormErrors({})).toBe("[]");
    expect(describeFormErrors({})).toBe("");
  });

  it("renders a readable summary", () => {
    expect(describeFormErrors(buildErrors())).toBe(
      "email: too_small - Email is required; address.city: invalid_type - Expected string; items.1.name: required - Name required",
    );
  });
});
