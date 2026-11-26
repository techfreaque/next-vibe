/**
 * Runs the production metadata generator in a child with a disposable cwd.
 * Never import this runner into the browser test process.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { generateEndpointsMeta } from "next-vibe/core/definition/generator/generator-endpoints-meta";
import type { GeneratorContext } from "next-vibe/core/generators/shared/shared-inputs";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

async function generateFixture(): Promise<void> {
  const project = process.argv[2];
  if (
    !project ||
    !process.cwd().startsWith(resolve(project, ".tmp", "catalog-lifecycle-")) ||
    existsSync(resolve(project, "scratchpad/DEPLOY_RUNNING"))
  ) {
    process.exit(75);
  }
  const source = resolve(process.cwd(), "fixture");
  const definition = resolve(source, "definition.ts");
  const route = resolve(source, "route.ts");
  const context: GeneratorContext = {
    logger: createEndpointLogger(false, defaultLocale),
    force: true,
    isWatcherRun: false,
    files: {
      definition: existsSync(definition) ? [definition] : [],
      route: existsSync(route) ? [route] : [],
      routeClient: [],
      task: [],
      taskRunner: [],
      seed: [],
      skill: [],
      email: [],
      promptFragment: [],
      category: [],
      graphSeed: [],
    },
    computed: { definitionModules: new Map() },
  };
  const result = await generateEndpointsMeta(context);
  if (result.failed) {
    process.exit(1);
  }
}

void generateFixture().catch(() => {
  process.exitCode = 1;
});
