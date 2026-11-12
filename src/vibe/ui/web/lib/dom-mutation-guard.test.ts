import { describe, expect, it } from "bun:test";

import {
  getDomEnvironmentHints,
  planInsertBefore,
  planRemoveChild,
} from "./dom-mutation-guard";

/** Minimal tree node - the planners only walk `parentNode`. */
interface FakeNode {
  name: string;
  parentNode: FakeNode | null;
}

function node(name: string, parentNode: FakeNode | null = null): FakeNode {
  return { name, parentNode };
}

describe("planInsertBefore", () => {
  it("passes real children through untouched", () => {
    const root = node("div");
    const ref = node("#text", root);
    expect(planInsertBefore(root, ref)).toEqual({
      resolution: null,
      reference: ref,
    });
    expect(planInsertBefore(root, null)).toEqual({
      resolution: null,
      reference: null,
    });
  });

  it("inserts before the translator wrapper that now holds the reference", () => {
    // Google Translate: <div><font><font>#text</font></font></div>
    const root = node("div");
    const outer = node("font", root);
    const inner = node("font", outer);
    const text = node("#text", inner);
    const plan = planInsertBefore(root, text);
    expect(plan.resolution).toBe("insertedBeforeWrapper");
    expect(plan.reference).toBe(outer);
  });

  it("appends when the reference left the parent entirely", () => {
    const root = node("div");
    const elsewhere = node("section");
    expect(planInsertBefore(root, node("#text", elsewhere))).toEqual({
      resolution: "appended",
      reference: null,
    });
    expect(planInsertBefore(root, node("#text"))).toEqual({
      resolution: "appended",
      reference: null,
    });
  });
});

describe("planRemoveChild", () => {
  it("passes real children through untouched", () => {
    const root = node("div");
    expect(planRemoveChild(root, node("#text", root))).toEqual({
      resolution: null,
      removeFrom: root,
    });
  });

  it("removes a wrapped child from its real parent", () => {
    const root = node("div");
    const font = node("font", root);
    const plan = planRemoveChild(root, node("#text", font));
    expect(plan.resolution).toBe("removedFromWrapper");
    expect(plan.removeFrom).toBe(font);
  });

  it("removes a child that was moved under a foreign parent", () => {
    const root = node("div");
    const foreign = node("section");
    const plan = planRemoveChild(root, node("#text", foreign));
    expect(plan.resolution).toBe("removedFromForeignParent");
    expect(plan.removeFrom).toBe(foreign);
  });

  it("no-ops an already detached child", () => {
    expect(planRemoveChild(node("div"), node("#text"))).toEqual({
      resolution: "alreadyDetached",
      removeFrom: null,
    });
  });
});

describe("getDomEnvironmentHints", () => {
  it("returns empty hints without a DOM", () => {
    expect(getDomEnvironmentHints()).toEqual({
      htmlLang: null,
      translatedClass: false,
      fontWrapperCount: 0,
      extensionMarkers: "",
      referrer: null,
    });
  });
});
