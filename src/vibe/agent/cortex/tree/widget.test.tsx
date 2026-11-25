import { expect, it, mock } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import definitions from "./definition";

let response: { tree?: string; totalFiles?: number; totalDirs?: number } = {};

it("renders a chat tool card before the tree arrives and then shows its mounts", async () => {
  const context = {
    ...(await import("next-vibe/unified-ui/_shared/use-widget-context")),
  };

  void mock.module("next-vibe/unified-ui/_shared/use-widget-context", () => ({
    ...context,
    useWidgetValue: () => response,
    useWidgetTranslation: () => (key: string) => key,
    useWidgetDisabled: () => true,
    useWidgetNavigation: () => ({ canGoBack: false }),
    useWidgetLocale: () => "en-US",
  }));

  const { CortexTreeWidget } = await import("./widget");
  const render = (): string =>
    renderToStaticMarkup(<CortexTreeWidget field={definitions.GET.fields} />);
  expect(render()).not.toContain("<pre");
  response = { tree: "/documents/example", totalFiles: 1, totalDirs: 1 };
  expect(render()).toContain("/documents/example");
  expect(render()).toContain(">documents</span>");
  expect(render().match(/<button\b[^>]*type="button"/g)).toHaveLength(3);
  response = { tree: "", totalFiles: 0, totalDirs: 0 };
  expect(render()).toContain("<pre");
});
