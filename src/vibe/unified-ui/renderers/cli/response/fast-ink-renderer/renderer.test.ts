import { expect, mock, spyOn, test } from "bun:test";
import { createElement, type ReactElement } from "react";

import { defaultLocale } from "../../../../../core/i18n/core/config";
import { createLogger } from "../../../../../logger/create-logger";
import type { LoggerMetadata } from "../../../../../logger/types";
test("the fast renderer records a console error without counting its own log", async () => {
  // Use the renderer's Ink host tags without loading the terminal layout engine.
  mock.module("ink", () => ({
    Box: "ink-box",
    Static: "ink-static",
    Text: "ink-text",
  }));
  const { renderToString } = await import("./renderer");
  const errors: LoggerMetadata[] = [];
  const logger = createLogger(
    false,
    defaultLocale,
    (level, _message, error) => {
      if (level === "error") {
        errors.push(error);
      }
    },
  );
  // oxlint-disable-next-line no-console -- test the renderer's console interception
  const consoleError = spyOn(console, "error").mockImplementation(
    () => undefined,
  );
  const failure = new Error("test render diagnostic");
  function Content(): ReactElement {
    // oxlint-disable-next-line no-console -- exercise a console error during rendering
    console.error("Rendering diagnostic", failure);
    return createElement("ink-text", null, "rendered");
  }

  try {
    expect(renderToString(createElement(Content), logger)).toContain(
      "rendered",
    );
    expect(errors).toEqual([failure]);
  } finally {
    consoleError.mockRestore();
  }
});
