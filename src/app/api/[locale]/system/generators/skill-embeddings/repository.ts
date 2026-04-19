/**
 * Skill Embeddings Generator
 *
 * Pre-computes embeddings for built-in skills at `vibe gen` time.
 * Writes embedding + embeddingHash directly into each skill.ts file
 * so the file is the single source of truth — committed to git.
 *
 * Only regenerates embeddings when skill content changes (SHA-256 hash check).
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
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

import { findFilesRecursively } from "../shared/utils";

interface SkillEmbeddingsResponseType {
  success: boolean;
  message: string;
  skillsProcessed: number;
  embeddingsGenerated: number;
  embeddingsSkipped: number;
  duration: number;
}

export class SkillEmbeddingsGeneratorRepository {
  static async generateSkillEmbeddings(
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SkillEmbeddingsResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(formatGenerator("start skill-embeddings", "🌱"));

      const { computeEmbeddingHash, generateEmbedding } =
        await import("@/app/api/[locale]/agent/cortex/embeddings/service");

      // Load resolved skill data (has systemPrompt values resolved from variables)
      const { DEFAULT_SKILLS } =
        await import("@/app/api/[locale]/system/generated/skills-index");

      // Discover all skill.ts files to get filesystem paths
      const apiDir = join(process.cwd(), "src", "app", "api", "[locale]");
      const skillFiles = findFilesRecursively(apiDir, "skill.ts");

      // Build a map of export name → { skillId, systemPrompt } from resolved data
      const skillByExportName = new Map<
        string,
        { id: string; systemPrompt: string }
      >();
      for (const skill of DEFAULT_SKILLS) {
        skillByExportName.set(skill.id, {
          id: skill.id,
          systemPrompt: skill.systemPrompt,
        });
      }

      // Build file → skill mapping using the same export-name regex as skills-index
      const fileSkillMap = new Map<
        string,
        { id: string; systemPrompt: string }
      >();
      for (const filePath of skillFiles) {
        const content = readFileSync(filePath, "utf-8");
        const exportMatch = /export const (\w+): Skill\s*=/.exec(content);
        if (!exportMatch) {
          continue;
        }
        // Extract skill id the same way as skills-index generator
        const idMatch = /\bid:\s*"([^"]*)"/.exec(content);
        const matchedSkill = idMatch
          ? skillByExportName.get(idMatch[1])
          : undefined;
        if (matchedSkill) {
          fileSkillMap.set(filePath, matchedSkill);
        } else {
          // ID is a constant reference (e.g. `id: SKILL_CREATOR_ID`)
          // Resolve by finding the constant's import and reading its value
          const constIdMatch = /\bid:\s*([A-Z_][A-Z_0-9]*)\b/.exec(content);
          if (constIdMatch) {
            const constName = constIdMatch[1];
            // Find the import path for this constant
            const importMatch = new RegExp(
              `import\\s*\\{[^}]*\\b${constName}\\b[^}]*\\}\\s*from\\s*["']([^"']+)["']`,
            ).exec(content);
            if (importMatch) {
              const importPath = importMatch[1];
              // Resolve import path — handle @/ alias and relative paths
              let constFile: string;
              if (importPath.startsWith("@/")) {
                constFile = join(
                  process.cwd(),
                  "src",
                  `${importPath.slice(2)}.ts`,
                );
              } else {
                const skillDir = filePath.slice(
                  0,
                  filePath.lastIndexOf("/") + 1,
                );
                constFile = join(skillDir, `${importPath}.ts`);
              }
              try {
                const constContent = readFileSync(constFile, "utf-8");
                const valueMatch = new RegExp(
                  `${constName}\\s*=\\s*["']([^"']+)["']`,
                ).exec(constContent);
                if (valueMatch) {
                  const skill = skillByExportName.get(valueMatch[1]);
                  if (skill) {
                    fileSkillMap.set(filePath, skill);
                  }
                }
              } catch {
                // Constant file not found, skip
              }
            }
          }
        }
      }

      let generated = 0;
      let skipped = 0;
      let total = 0;

      for (const filePath of skillFiles) {
        const skill = fileSkillMap.get(filePath);
        if (!skill) {
          continue;
        }

        const fileContent = readFileSync(filePath, "utf-8");
        const { id: skillId, systemPrompt } = skill;
        total++;

        // Compute hash of embeddable content
        const path = `/skills/default/${skillId}.md`;
        const content = `# ${skillId}\n\n${systemPrompt}`;
        const hash = computeEmbeddingHash(path, content);

        // Check existing embeddingHash in file
        const existingHash = extractEmbeddingHash(fileContent);
        if (existingHash === hash) {
          skipped++;
          continue;
        }

        // Generate new embedding
        const textToEmbed = `${path}\n\n${content}`;
        const embedding = await generateEmbedding(textToEmbed);

        if (!embedding) {
          logger.warn(`  skipped (API unavailable): ${skillId}`);
          skipped++;
          continue;
        }

        // Write embedding + hash back into the skill.ts file
        const updated = writeEmbeddingToFile(fileContent, hash, embedding);
        writeFileSync(filePath, updated, "utf-8");

        generated++;
        logger.debug(`  embedded: ${skillId}`);
      }

      const duration = Date.now() - startTime;
      const message = `${formatGenerator(`Generated skill-embeddings`, "🌱")} ${formatCount(total, "skill")} (${generated} embedded, ${skipped} cached) in ${formatDuration(duration)}`;

      logger.info(message);

      return success({
        success: true,
        message,
        skillsProcessed: total,
        embeddingsGenerated: generated,
        embeddingsSkipped: skipped,
        duration,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      logger.error("Skill embeddings generation failed", errorMessage);

      return success({
        success: false,
        message: `Skill embeddings generation failed: ${errorMessage.message}`,
        skillsProcessed: 0,
        embeddingsGenerated: 0,
        embeddingsSkipped: 0,
        duration: Date.now() - startTime,
      });
    }
  }
}

/**
 * Extract the existing embeddingHash value from a skill.ts file.
 */
function extractEmbeddingHash(fileContent: string): string | null {
  const match = /embeddingHash:\s*\n?\s*["']([a-f0-9]+)["']/.exec(fileContent);
  return match?.[1] ?? null;
}

/**
 * Write/replace embedding and embeddingHash fields in a skill.ts file.
 * Inserts before the closing `};` of the skill export.
 */
function writeEmbeddingToFile(
  fileContent: string,
  hash: string,
  embedding: number[],
): string {
  // Remove existing embedding/embeddingHash (may span multiple lines due to prettier)
  let cleaned = fileContent
    .replace(/\s*embeddingHash:\s*\n?\s*["'][^"']*["'],?\n?/g, "")
    .replace(/\s*\/\/ prettier-ignore\n/g, "")
    .replace(/\s*embedding:\s*\[[\s\S]*?\],?\n?/g, "")
    // Clean up any double blank lines from removal
    .replace(/\n{3,}/g, "\n\n");

  // Serialize embedding as compact array — limit precision to avoid no-loss-of-precision lint errors
  const embeddingStr = `[${embedding.map((v) => Number(v.toPrecision(15))).join(",")}]`;

  // Find the last `};` which closes the skill export
  const closingIdx = cleaned.lastIndexOf("};");
  if (closingIdx === -1) {
    return cleaned;
  }

  // Ensure there's a newline before the closing `};`
  const before = cleaned.slice(0, closingIdx);
  const after = cleaned.slice(closingIdx);
  const needsNewline = !before.endsWith("\n");
  const insertion = `${needsNewline ? "\n" : ""}  embeddingHash: "${hash}",\n  // prettier-ignore\n  embedding: ${embeddingStr},\n`;

  return `${before}${insertion}${after}`;
}
