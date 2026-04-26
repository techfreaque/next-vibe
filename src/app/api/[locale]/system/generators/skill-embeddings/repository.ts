/**
 * Skill Embeddings Generator
 *
 * Pre-computes embeddings for built-in skills at `vibe gen` time.
 * Writes embedding + embeddingHash to a sibling `skill.embedding.ts` file
 * so the skill.ts stays clean - committed to git.
 *
 * Only regenerates embeddings when skill content changes (SHA-256 hash check).
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

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

      // Build a map of skillId → { id, systemPrompt } from resolved data
      const skillById = new Map<string, { id: string; systemPrompt: string }>();
      for (const skill of DEFAULT_SKILLS) {
        skillById.set(skill.id, {
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
        // Extract skill id directly
        const idMatch = /\bid:\s*"([^"]*)"/.exec(content);
        const matchedSkill = idMatch ? skillById.get(idMatch[1]) : undefined;
        if (matchedSkill) {
          fileSkillMap.set(filePath, matchedSkill);
        } else {
          // ID is a constant reference - resolve via import
          const constIdMatch = /\bid:\s*([A-Z_][A-Z_0-9]*)\b/.exec(content);
          if (constIdMatch) {
            const constName = constIdMatch[1];
            const importMatch = new RegExp(
              `import\\s*\\{[^}]*\\b${constName}\\b[^}]*\\}\\s*from\\s*["']([^"']+)["']`,
            ).exec(content);
            if (importMatch) {
              const importPath = importMatch[1];
              let constFile: string;
              if (importPath.startsWith("@/")) {
                constFile = join(
                  process.cwd(),
                  "src",
                  `${importPath.slice(2)}.ts`,
                );
              } else {
                const skillDir = dirname(filePath);
                constFile = join(skillDir, `${importPath}.ts`);
              }
              try {
                const constContent = readFileSync(constFile, "utf-8");
                const valueMatch = new RegExp(
                  `${constName}\\s*=\\s*["']([^"']+)["']`,
                ).exec(constContent);
                if (valueMatch) {
                  const skill = skillById.get(valueMatch[1]);
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

        const { id: skillId, systemPrompt } = skill;
        total++;

        // Compute hash of embeddable content
        const path = `/skills/default/${skillId}.md`;
        const content = `# ${skillId}\n\n${systemPrompt}`;
        const hash = computeEmbeddingHash(path, content);

        // Check existing hash in the sibling .embedding.ts file
        const embeddingFile = join(dirname(filePath), "skill.embedding.ts");
        const existingFileContent = readFileSafe(embeddingFile);
        const existingHash = extractHash(existingFileContent);

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

        // Write to sibling skill.embedding.ts
        const embeddingStr = `[${embedding.map((v) => Number(v.toPrecision(15))).join(",")}]`;
        const newContent = buildSkillEmbeddingFile(skillId, hash, embeddingStr);
        writeFileSync(embeddingFile, newContent, "utf-8");

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

function buildSkillEmbeddingFile(
  skillId: string,
  hash: string,
  embeddingStr: string,
): string {
  return `import type { SkillEmbedding } from "../../embedding-type";

/** Generated by \`vibe gen\` - do not edit manually */
export const embedding: SkillEmbedding = {
  skillId: "${skillId}",
  embeddingHash: "${hash}",
  // prettier-ignore
  embedding: ${embeddingStr},
};
`;
}
