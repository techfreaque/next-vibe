/**
 * Cortex Seeds Embeddings Generator
 *
 * Pre-computes embeddings for all cortex seed items (memory templates,
 * document templates, admin memories) at `vibe gen` time.
 *
 * Each item's embedding is written to its sibling `.embedding.ts` file.
 * Hash is computed from (path + content). Skips if hash unchanged.
 */

import "server-only";

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  type ResponseType as BaseResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

interface CortexTemplatesEmbeddingsResponseType {
  success: boolean;
  message: string;
  templatesProcessed: number;
  embeddingsGenerated: number;
  embeddingsSkipped: number;
  duration: number;
}

export class CortexTemplatesEmbeddingsGeneratorRepository {
  static async generateCortexTemplateEmbeddings(
    logger: EndpointLogger,
  ): Promise<BaseResponseType<CortexTemplatesEmbeddingsResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(formatGenerator("start cortex-seeds-embeddings", "🗂️"));

      const { computeEmbeddingHash, generateEmbedding } =
        await import("@/app/api/[locale]/agent/cortex/embeddings/service");

      const { getAllTemplates } =
        await import("@/app/api/[locale]/agent/cortex/seeds/templates");
      const { defaultLocale } = await import("@/i18n/core/config");
      const ALL_SEEDS = getAllTemplates(defaultLocale).map((item) => ({
        item,
      }));

      const seedsDir = join(
        process.cwd(),
        "src",
        "app",
        "api",
        "[locale]",
        "agent",
        "cortex",
        "seeds",
      );

      // Scan all seed .ts files (excluding index, types, .embedding.ts)
      const seedFiles = scanSeedFiles(seedsDir);

      // Build map: item id → absolute path of the .ts seed file
      const idToSeedFile = new Map<string, string>();
      for (const filePath of seedFiles) {
        const content = readFileSync(filePath, "utf-8");
        const idMatch = /id:\s*["']([^"']+)["']/.exec(content);
        if (idMatch) {
          idToSeedFile.set(idMatch[1], filePath);
        }
      }

      let generated = 0;
      let skipped = 0;
      const total = ALL_SEEDS.length;

      for (const { item } of ALL_SEEDS) {
        const seedFile = idToSeedFile.get(item.id);
        if (!seedFile) {
          logger.warn(`  skipped (no file found for id): ${item.id}`);
          skipped++;
          continue;
        }

        const embeddingFile = seedFile.replace(/\.ts$/, ".embedding.ts");
        const hash = computeEmbeddingHash(item.path, item.content);

        // Check existing hash
        const existingContent = readFileSafe(embeddingFile);
        const existingHash = extractHash(existingContent);
        if (existingHash === hash) {
          skipped++;
          continue;
        }

        // Generate embedding
        const textToEmbed = `${item.path}\n\n${item.content}`;
        const embedding = await generateEmbedding(textToEmbed);

        if (!embedding) {
          logger.warn(`  skipped (API unavailable): ${item.id}`);
          skipped++;
          continue;
        }

        // Determine correct relative import path to types.ts
        // e.g. seeds/memories/identity/name.embedding.ts → ../../types (depth=3, prefix=../../)
        const relPath = embeddingFile.replace(`${seedsDir}/`, "");
        const depth = relPath.split("/").length - 1;
        const relPrefix = "../".repeat(depth);

        const embeddingStr = `[${embedding.map((v) => Number(v.toPrecision(15))).join(",")}]`;
        const newContent = buildSeedEmbeddingFile(
          item.path,
          hash,
          embeddingStr,
          `${relPrefix}types`,
        );
        writeFileSync(embeddingFile, newContent, "utf-8");

        generated++;
        logger.debug(`  embedded: ${item.id}`);
      }

      const duration = Date.now() - startTime;
      const message = `${formatGenerator("Generated cortex-seeds-embeddings", "🗂️")} ${formatCount(total, "seed")} (${generated} embedded, ${skipped} cached) in ${formatDuration(duration)}`;

      logger.info(message);

      return success({
        success: true,
        message,
        templatesProcessed: total,
        embeddingsGenerated: generated,
        embeddingsSkipped: skipped,
        duration,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      logger.error("Cortex seeds embeddings generation failed", errorMessage);

      return success({
        success: false,
        message: `Cortex seeds embeddings generation failed: ${errorMessage.message}`,
        templatesProcessed: 0,
        embeddingsGenerated: 0,
        embeddingsSkipped: 0,
        duration: Date.now() - startTime,
      });
    }
  }
}

/** Recursively find all seed .ts files, excluding embedding/index/types */
function scanSeedFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanSeedFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".embedding.ts") &&
      entry.name !== "index.ts" &&
      entry.name !== "types.ts"
    ) {
      results.push(fullPath);
    }
  }
  return results.toSorted();
}

function readFileSafe(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

function extractHash(fileContent: string): string | null {
  const match = /embeddingHash:\s*["']([a-f0-9]+)["']/.exec(fileContent);
  return match?.[1] ?? null;
}

function buildSeedEmbeddingFile(
  path: string,
  hash: string,
  embeddingStr: string,
  typesImportPath: string,
): string {
  return `import type { CortexSeedEmbedding } from "${typesImportPath}";

/** Generated by \`vibe gen\` — do not edit manually */
export const embedding: CortexSeedEmbedding = {
  path: "${path}",
  embeddingHash: "${hash}",
  // prettier-ignore
  embedding: ${embeddingStr},
};
`;
}
