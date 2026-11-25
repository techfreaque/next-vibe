/**
 * Model Changelog generator (`vibe gen`).
 *
 * Walks the committed git history of the model registry files and writes
 * src/generated/model-changelog/index.ts: every dated added / legacy /
 * restored / repriced / tier / removed event. The public /models/changelog
 * page, the model pages and the RSS feed read that file at runtime.
 *
 * Inputs include the git ref files, so every new commit re-runs it. Without
 * git (Docker builds from `git archive`) it keeps the committed file.
 */

import "server-only";

import { join } from "node:path";

import type {
  GeneratorDefinition,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  generateFileHeader,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";

import { GENERATED_DIR, getProjectRoot } from "@/env/paths";

import {
  collectModelChangelogFromGit,
  gitRefInputs,
  MODEL_REGISTRY_FILES,
  TRACKING_START_COMMIT,
} from "./git-history";
import type { ModelChangelogEvent } from "./types";

const OUTPUT_FILE = `${GENERATED_DIR}/model-changelog/index.ts`;

function str(value: string): string {
  return JSON.stringify(value);
}

/** Prettier-stable object literal for one event. */
function renderEvent(event: ModelChangelogEvent): string {
  const lines = [
    `    date: ${str(event.date)},`,
    `    commit: ${str(event.commit)},`,
    `    type: ${str(event.type)},`,
    `    modelId: ${str(event.modelId)},`,
    `    modelType: ${str(event.modelType)},`,
    `    name: ${str(event.name)},`,
    `    content: ${str(event.content)},`,
  ];
  if (event.fromContent !== undefined) {
    lines.push(`    fromContent: ${str(event.fromContent)},`);
  }
  if (event.successorId !== undefined) {
    lines.push(`    successorId: ${str(event.successorId)},`);
  }
  if (event.successorName !== undefined) {
    lines.push(`    successorName: ${str(event.successorName)},`);
  }
  if (event.priceChanges !== undefined) {
    lines.push(`    priceChanges: [`);
    for (const change of event.priceChanges) {
      lines.push(
        `      { metric: ${str(change.metric)}, from: ${change.from}, to: ${change.to} },`,
      );
    }
    lines.push(`    ],`);
  }
  return [`  {`, ...lines, `  },`].join("\n");
}

function renderFile(
  events: readonly ModelChangelogEvent[],
  trackingStart: string,
): string {
  const header = generateFileHeader(
    "Model Changelog History",
    "model-changelog generator (src/vibe/agent/models/model-changelog/generator.ts)",
    {
      command: "vibe gen",
      source: `git history of the model registry files since ${TRACKING_START_COMMIT}`,
      events: events.length,
    },
  );
  return [
    header,
    ``,
    `import type { ModelChangelogEvent } from "next-vibe/agent/models/model-changelog/types";`,
    ``,
    `/** Commit date the history starts from; earlier models have no "added" entry. */`,
    `export const MODEL_CHANGELOG_TRACKING_START = ${str(trackingStart)};`,
    ``,
    `/** Newest first. */`,
    `export const MODEL_CHANGELOG_EVENTS: readonly ModelChangelogEvent[] = [`,
    ...events.map(renderEvent),
    `];`,
    ``,
  ].join("\n");
}

export const generator: GeneratorDefinition = {
  key: "model-changelog",
  phase: "default",
  needs: {},
  cacheKey: "model-changelog",
  output: OUTPUT_FILE,
  findInputs() {
    const root = getProjectRoot();
    const ownDir = join(root, "src/vibe/agent/models/model-changelog");
    return [
      join(ownDir, "generator.ts"),
      join(ownDir, "git-history.ts"),
      join(ownDir, "extract.ts"),
      ...MODEL_REGISTRY_FILES.map(([path]) => join(root, path)),
      ...gitRefInputs(root),
    ];
  },
  async generate(ctx): Promise<GeneratorResult> {
    const root = getProjectRoot();
    const result = collectModelChangelogFromGit(root);
    if (!result.available) {
      ctx.logger.info("model-changelog: no git history, kept committed file");
      return {
        summary: "model changelog (no git, kept)",
        counts: { events: 0, commits: 0 },
      };
    }
    await writeGeneratedFile(
      join(root, OUTPUT_FILE),
      renderFile(result.events, result.trackingStart),
    );
    return {
      summary: `model changelog (${result.events.length} events from ${result.commits} commits)`,
      counts: { events: result.events.length, commits: result.commits },
    };
  },
};
