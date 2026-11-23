import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

type LoaderCallback = (error: Error | null, output?: string) => void;
type ReadSource = (
  file: string,
  encoding: "utf8",
  done: LoaderCallback,
) => void;

interface LoaderContext {
  context: string;
  resourcePath: string;
  fs: { readFile: ReadSource };
  addDependency: (file: string) => void;
  async: () => LoaderCallback;
  getResolve: () => (context: string, request: string) => Promise<string>;
}

type Loader = (this: LoaderContext, source: string) => void;

const loader: Loader = createRequire(import.meta.url)(
  "./rsc-definition-client-import-loader.cjs",
);
const skillDir = join(import.meta.dir, "../../agent/skills/[id]");
const helpers = `
import { createEndpoint as endpoint } from "next-vibe/core/definition/create-i18n";
import { lazyWidget as widget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject as fields } from "next-vibe/unified-ui/_shared/utils";
import React from "react";
`;
const widgetImport = 'import("./widget")';
const factory = `const W = widget(() => ${widgetImport}.then(m => ({ default: m.SkillViewContainer })));`;
const endpoint = "endpoint({ fields: fields({ render: W }) });";

function runLoader(
  source: string,
  readSource: ReadSource = readFile,
  dependencies: string[] = [],
): Promise<string> {
  return new Promise((resolve, reject) => {
    loader.call(
      {
        context: skillDir,
        resourcePath: join(skillDir, "definition.ts"),
        fs: { readFile: readSource },
        addDependency: (file) => dependencies.push(file),
        async: () => (error, output) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(output ?? "");
        },
        getResolve: () => (from, request) =>
          Promise.resolve(Bun.resolveSync(request, from)),
      },
      source,
    );
  });
}

describe("RSC endpoint imports", () => {
  test("stubs endpoint widget factories but preserves the same import during RSC rendering", async () => {
    const render = `export async function ServerPage() { const { SkillViewContainer } = await ${widgetImport}; return React.createElement(SkillViewContainer); }`;
    const source = helpers + factory + endpoint + render;
    expect(await runLoader(source)).toBe(
      source.replace(widgetImport, "Promise.resolve({})"),
    );
  });

  test("preserves factories shared with RSC callers and lookalike helpers", async () => {
    const source =
      helpers +
      factory +
      endpoint +
      `
export { W };
export const Standalone = React.lazy(() => import("./widget"));
function other(widget) { const W = widget(() => import("./widget")); ${endpoint} }
const config = { events: { refresh: { onEvent: () => import("./widget") } } };
`;
    expect(await runLoader(source)).toBe(source);
  });

  test("recognizes the untranslated core endpoint constructor", async () => {
    const source =
      helpers.replace("definition/create-i18n", "definition/create") +
      factory +
      endpoint;
    expect(await runLoader(source)).toBe(
      source.replace(widgetImport, "Promise.resolve({})"),
    );
  });

  test("recognizes inline React.lazy widgets and the framework client callback slots", async () => {
    const source =
      helpers +
      `
endpoint({
  fields: fields({ render: React.lazy(() => import /* comment */ ("./widget")) }),
  events: { refresh: { onEvent: async () => { await import("./widget"); } } },
  options: { mutationOptions: { onSuccess: () => import("./widget"), onError: () => import("./widget") } },
  other: { onEvent: () => import("./widget") },
});`;
    expect(await runLoader(source)).toBe(
      source
        .replace('import /* comment */ ("./widget")', "Promise.resolve({})")
        .replace('await import("./widget")', "await Promise.resolve({})")
        .replace(
          'onSuccess: () => import("./widget")',
          "onSuccess: () => Promise.resolve({})",
        )
        .replace(
          'onError: () => import("./widget")',
          "onError: () => Promise.resolve({})",
        ),
    );
  });

  test("edits only import expressions, including inside a client-only factory", async () => {
    const examples = [
      'const example = \x60import("./widget")\x60;',
      "const quoted = 'import(\"./widget\")';",
      '/* import("./widget") */',
      'type T = typeof import("./widget");',
    ].join("\n");
    const source =
      helpers +
      `const W = widget(() => { ${examples} return ${widgetImport}; });` +
      endpoint;
    expect(await runLoader(source)).toBe(
      source.replace(`return ${widgetImport}`, "return Promise.resolve({})"),
    );
  });

  test("reclassifies an edited dependency in the same process and respects the directive prologue", async () => {
    const source = helpers + factory + endpoint;
    const dependencies: string[] = [];
    let target = '"use strict"; "use client"; export const X = 1;';
    const read: ReadSource = (_file, _encoding, done) => done(null, target);
    expect(await runLoader(source, read, dependencies)).not.toContain(
      widgetImport,
    );
    target = '"use client" + " expression"; export const X = 1;';
    expect(await runLoader(source, read, dependencies)).toBe(source);
    target = "/*" + "x".repeat(4500) + '*/ "use client";';
    expect(await runLoader(source, read, dependencies)).not.toContain(
      widgetImport,
    );
    expect(dependencies).toEqual(
      Array<string>(3).fill(Bun.resolveSync("./widget", skillDir)),
    );
  });

  test("keeps server modules and unresolved imports in an eligible slot", async () => {
    const source =
      helpers +
      factory.replace(
        widgetImport,
        'Promise.all([import("../definition"), import("./missing")])',
      ) +
      endpoint;
    expect(await runLoader(source)).toBe(source);
  });
});
