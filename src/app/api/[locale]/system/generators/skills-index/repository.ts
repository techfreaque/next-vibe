/**
 * Skills Index Generator Repository
 *
 * Scans all skill.ts files anywhere under src/app/api/[locale]/ and generates
 * a static-import skills-index.ts that re-exports all skill constants and
 * assembles DEFAULT_SKILLS / COMPANION_SKILLS arrays.
 *
 * config.ts imports from the generated file instead of 50+ individual files.
 */

import "server-only";

import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsSkillsIndexT } from "./i18n";

interface SkillsIndexRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface SkillsIndexResponseType {
  success: boolean;
  message: string;
  skillsFound: number;
  duration: number;
  outputFile?: string;
}

/** A discovered skill entry */
interface SkillEntry {
  /** The exported variable name, e.g. "coderSkill" */
  exportName: string;
  /** The skill id, e.g. "coder" */
  skillId: string;
  /** Absolute filesystem path to skill.ts */
  absPath: string;
  /** Whether this is a companion skill (thea / hermes) */
  isCompanion: boolean;
}

export class SkillsIndexGeneratorRepository {
  /** Skill IDs that go into COMPANION_SKILLS (order matters) */
  private static readonly COMPANION_SKILL_IDS = ["thea", "hermes"] as const;
  static async generateSkillsIndex(
    data: SkillsIndexRequestType,
    logger: EndpointLogger,
    t: GeneratorsSkillsIndexT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<SkillsIndexResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting skills index generation: ${data.outputFile}`);

      // ── 1. Discover skill.ts files ─────────────────────────────────────
      let skillFiles: string[];

      if (liveIndex?.defaultSkillFiles) {
        logger.debug("Using live index for skill file discovery");
        skillFiles = [...liveIndex.defaultSkillFiles];
      } else {
        const apiDir = join(process.cwd(), "src", "app", "api", "[locale]");
        skillFiles = findFilesRecursively(apiDir, "skill.ts");
        logger.debug(`Found ${skillFiles.length} skill.ts files`);
      }

      // ── 2. Parse each skill.ts and extract the export name + skill id ──
      const skills = SkillsIndexGeneratorRepository.extractSkills(
        skillFiles,
        logger,
      );

      logger.debug(
        `Extracted ${skills.length} skills: ${skills.map((s) => s.skillId).join(", ")}`,
      );

      // ── 3. Generate file content ───────────────────────────────────────
      const content = SkillsIndexGeneratorRepository.generateContent(
        skills,
        data.outputFile,
      );

      // ── 4. Write file ──────────────────────────────────────────────────
      await writeGeneratedFile(data.outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated skills index with ${formatCount(skills.length, "skill")} in ${formatDuration(duration)}`,
          "🎭",
        ),
      );

      return success({
        success: true,
        message: t("post.success.title"),
        skillsFound: skills.length,
        duration,
        outputFile: data.dryRun ? undefined : data.outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Skills index generation failed", {
        error: parseError(error),
      });
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
          duration,
        },
      });
    }
  }

  private static extractSkills(
    skillFiles: string[],
    logger: EndpointLogger,
  ): SkillEntry[] {
    const skills: SkillEntry[] = [];

    for (const skillFile of skillFiles) {
      try {
        const content = readFileSync(skillFile, "utf-8");

        // Match: export const <exportName>: Skill = { id: "<skillId>",
        const exportMatch = /export const (\w+): Skill\s*=/.exec(content);
        const idMatch = /\bid:\s*["']([^"']+)["']/.exec(content);

        if (!exportMatch || !idMatch) {
          logger.warn(
            `Could not parse skill file ${basename(skillFile)} — skipping`,
          );
          continue;
        }

        const exportName = exportMatch[1];
        const skillId = idMatch[1];
        const isCompanion = (
          SkillsIndexGeneratorRepository.COMPANION_SKILL_IDS as readonly string[]
        ).includes(skillId);

        skills.push({ exportName, skillId, absPath: skillFile, isCompanion });
      } catch (error) {
        logger.warn(
          `Could not read skill file ${skillFile}: ${parseError(error).message}`,
        );
      }
    }

    // Stable sort: companions first (in defined order), then alphabetical by id
    return skills.toSorted((a, b) => {
      const companions: readonly string[] =
        SkillsIndexGeneratorRepository.COMPANION_SKILL_IDS;
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

  private static generateContent(
    skills: SkillEntry[],
    outputFile: string,
  ): string {
    const companions = skills.filter((s) => s.isCompanion);
    const nonCompanions = skills.filter((s) => !s.isCompanion);

    // outputFile is relative like "src/app/.../generated/skills-index.ts"
    // convert to absolute for getRelativeImportPath
    // Use template string to prevent Turbopack from statically tracing paths
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

    const companionList = companions
      .map((s) => `  ${s.exportName},`)
      .join("\n");

    const skillIdList = skills.map((s) => `  "${s.skillId}",`).join("\n");

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { Skill } from "@/app/api/[locale]/agent/chat/skills/config";

${imports}

export const COMPANION_SKILLS: Skill[] = [
${companionList}
];

export const DEFAULT_SKILL_IDS = [
${skillIdList}
] as const;

export type DefaultSkillId = (typeof DEFAULT_SKILL_IDS)[number];

export const DEFAULT_SKILLS: Skill[] = [
  ...COMPANION_SKILLS,
${nonCompanions.map((s) => `  ${s.exportName},`).join("\n")}
];
`;
  }
}
