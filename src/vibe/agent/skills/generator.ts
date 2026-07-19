/**
 * Skills Index Generator (domain-co-located).
 *
 * Scans all skill.ts files and generates src/generated/skills/index.ts — static
 * imports of every skill constant + COMPANION_SKILLS / DEFAULT_SKILLS arrays.
 * Byte-identical to the former tooling/generators/skills-index. Skill file list
 * comes from the shared GeneratorContext; each skill.ts is imported here to read
 * its real id.
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import type {
  GeneratorContext,
  GeneratorDefinition,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  toImportUrl,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";
import { parseError } from "next-vibe/core/utils/parse-error";

import { GENERATED_DIR, getApiDir, getSrcDir } from "@/env/paths";

const OUTPUT_FILE = `${GENERATED_DIR}/skills/index.ts`;

/** Skill IDs that go into COMPANION_SKILLS (order matters). */
const COMPANION_SKILL_IDS = ["thea", "hermes"] as const;

interface SkillEntry {
  exportName: string;
  skillId: string;
  absPath: string;
  isCompanion: boolean;
  /** Resolved systemPrompt captured at scan time — fed to embeddings in-memory. */
  systemPrompt: string;
}

async function extractSkills(
  skillFiles: string[],
  logger: GeneratorContext["logger"],
): Promise<SkillEntry[]> {
  const skills: SkillEntry[] = [];

  for (const skillFile of skillFiles) {
    try {
      const content = readFileSync(skillFile, "utf-8");

      const exportMatch = /export const (\w+): Skill\s*=/.exec(content);
      if (!exportMatch) {
        logger.warn(
          `Could not parse skill file ${basename(skillFile)} - skipping`,
        );
        continue;
      }

      const exportName = exportMatch[1];
      const mod = (await import(toImportUrl(skillFile))) as Record<
        string,
        { id?: string; systemPrompt?: string }
      >;
      const skillId = mod[exportName]?.id;

      if (!skillId) {
        logger.warn(
          `Could not parse skill file ${basename(skillFile)} - skipping`,
        );
        continue;
      }

      const isCompanion = (COMPANION_SKILL_IDS as readonly string[]).includes(
        skillId,
      );

      skills.push({
        exportName,
        skillId,
        absPath: skillFile,
        isCompanion,
        systemPrompt: mod[exportName]?.systemPrompt ?? "",
      });
    } catch (error) {
      logger.warn(
        `Could not read skill file ${skillFile}: ${parseError(error).message}`,
      );
    }
  }

  return skills.toSorted((a, b) => {
    const companions: readonly string[] = COMPANION_SKILL_IDS;
    const aCompIdx = companions.indexOf(a.skillId);
    const bCompIdx = companions.indexOf(b.skillId);
    if (aCompIdx !== -1 && bCompIdx !== -1) {
      return aCompIdx - bCompIdx;
    }
    if (aCompIdx !== -1) {
      return -1;
    }
    if (bCompIdx !== -1) {
      return 1;
    }
    return a.skillId.localeCompare(b.skillId);
  });
}

function generateContent(skills: SkillEntry[], outputFile: string): string {
  const companions = skills.filter((s) => s.isCompanion);
  const nonCompanions = skills.filter((s) => !s.isCompanion);

  const absOutputFile = `${process.cwd()}/${outputFile}`;

  const header = generateFileHeader(
    "AUTO-GENERATED SKILLS INDEX",
    "generators/skills-index",
    {
      "Skills found": skills.length,
      "Companion skills": companions.map((s) => s.skillId).join(", "),
    },
  );

  const imports = skills
    .map(
      (s) =>
        `import { ${s.exportName} } from "${getRelativeImportPath(s.absPath, absOutputFile)}";`,
    )
    .join("\n");

  const embeddingImports = skills
    .map((s) => {
      const embeddingPath = s.absPath.replace(
        /skill\.ts$/,
        "skill.embedding.ts",
      );
      return `import { embedding as ${s.exportName}Embedding } from "${getRelativeImportPath(embeddingPath, absOutputFile)}";`;
    })
    .join("\n");

  const companionNames = companions.map((s) => s.exportName);
  const companionSingleLine = `export const COMPANION_SKILLS: Skill[] = [${companionNames.join(", ")}];`;
  const companionList =
    companionSingleLine.length <= 80
      ? companionNames.join(", ")
      : companions.map((s) => `  ${s.exportName},`).join("\n");

  const skillIdList = skills.map((s) => `  "${s.skillId}",`).join("\n");

  const embeddingList = skills
    .map((s) => `  ${s.exportName}Embedding,`)
    .join("\n");

  return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { Skill } from "next-vibe/agent/skills/config";
import type { SkillEmbedding } from "next-vibe/agent/skills/embedding-type";

${imports}

${embeddingImports}

export const COMPANION_SKILLS: Skill[] = [${companionSingleLine.length <= 80 ? companionList : `\n${companionList}\n`}];

export const DEFAULT_SKILL_IDS = [
${skillIdList}
] as const;

export type DefaultSkillId = (typeof DEFAULT_SKILL_IDS)[number];

export const DEFAULT_SKILLS: Skill[] = [
  ...COMPANION_SKILLS,
${nonCompanions.map((s) => `  ${s.exportName},`).join("\n")}
];

export const DEFAULT_SKILL_EMBEDDINGS: (SkillEmbedding | undefined)[] = [
${embeddingList}
];
`;
}

/**
 * Generate the skills index. Consumes shared skill file list; writes one file.
 * Returns the resolved skills so the embeddings pass can consume them in-memory
 * (no re-import of the just-written generated index).
 */
async function generateSkillsIndex(
  ctx: GeneratorContext,
): Promise<{ result: GeneratorResult; skills: SkillEntry[] }> {
  const skills = await extractSkills(ctx.files.skill, ctx.logger);
  const content = generateContent(skills, OUTPUT_FILE);
  await writeGeneratedFile(OUTPUT_FILE, content);

  return {
    result: {
      summary: `skills index (${skills.length} skills)`,
      counts: { skills: skills.length },
    },
    skills,
  };
}

// ─── Skill embeddings (runs after the index, which it reads) ────────────────

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
  return `import type { SkillEmbedding } from "next-vibe/agent/skills/embedding-type";

/** Generated by \`vibe gen\` - do not edit manually */
export const embedding: SkillEmbedding = {
  skillId: "${skillId}",
  embeddingHash: "${hash}",
  // prettier-ignore
  embedding: ${embeddingStr},
};
`;
}

async function generateSkillEmbeddings(
  ctx: GeneratorContext,
  skills: readonly SkillEntry[],
): Promise<{ total: number; generated: number; skipped: number }> {
  const { logger } = ctx;

  const { computeEmbeddingHash, generateEmbedding } =
    await import("next-vibe/agent/cortex/embeddings/service");
  // Build-time skill embedding generation — no stream; thread-less root runs live.
  const { rootlessToolExecutionContext } =
    await import("next-vibe/agent/chat/config");
  const rootCtx = rootlessToolExecutionContext();

  const skillFiles = ctx.files.skill;

  // Resolved skills come straight from the index pass (in-memory) — no re-import of
  // the just-written @/generated/skills/index, so a single run always sees fresh data.
  const skillById = new Map<string, { id: string; systemPrompt: string }>();
  for (const skill of skills) {
    skillById.set(skill.skillId, {
      id: skill.skillId,
      systemPrompt: skill.systemPrompt,
    });
  }

  const fileSkillMap = new Map<string, { id: string; systemPrompt: string }>();
  for (const filePath of skillFiles) {
    const content = readFileSync(filePath, "utf-8");
    const exportMatch = /export const (\w+): Skill\s*=/.exec(content);
    if (!exportMatch) {
      continue;
    }
    const idMatch = /\bid:\s*"([^"]*)"/.exec(content);
    const matchedSkill = idMatch ? skillById.get(idMatch[1]) : undefined;
    if (matchedSkill) {
      fileSkillMap.set(filePath, matchedSkill);
    } else {
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
            constFile = join(getSrcDir(), `${importPath.slice(2)}.ts`);
          } else {
            constFile = join(dirname(filePath), `${importPath}.ts`);
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

    const path = `/skills/default/${skillId}.md`;
    const content = `# ${skillId}\n\n${systemPrompt}`;
    const hash = computeEmbeddingHash(path, content);

    const embeddingFile = join(dirname(filePath), "skill.embedding.ts");
    const existingHash = extractHash(readFileSafe(embeddingFile));

    if (existingHash === hash) {
      skipped++;
      continue;
    }

    const textToEmbed = `${path}\n\n${content}`;
    const embedding = await generateEmbedding(textToEmbed, rootCtx);

    if (!embedding) {
      logger.warn(`  skipped (API unavailable): ${skillId}`);
      skipped++;
      continue;
    }

    const embeddingStr = `[${embedding.map((v) => Number(v.toPrecision(15))).join(",")}]`;
    writeFileSync(
      embeddingFile,
      buildSkillEmbeddingFile(skillId, hash, embeddingStr),
      "utf-8",
    );

    generated++;
    logger.debug(`  embedded: ${skillId}`);
  }

  return { total, generated, skipped };
}

export const generator: GeneratorDefinition = {
  key: "skills",
  phase: "default",
  needs: {},
  cacheKey: "skills-index",
  findInputs(live) {
    if (live) {
      return [...live.defaultSkillFiles].toSorted();
    }
    return findFilesRecursively(getApiDir(), "skill.ts");
  },
  async generate(ctx) {
    const { result: index, skills } = await generateSkillsIndex(ctx);
    const emb = await generateSkillEmbeddings(ctx, skills);
    return {
      summary: `${index.summary}; embeddings (${emb.generated} embedded, ${emb.skipped} cached)`,
      counts: {
        ...index.counts,
        embedded: emb.generated,
        cached: emb.skipped,
      },
    };
  },
};
