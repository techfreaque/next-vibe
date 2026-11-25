/**
 * Skill → Character Card V2 mapping (pure, shared by repository and tests).
 *
 * The skill's system prompt goes into `description`: Tavern-format apps
 * (SillyTavern, RisuAI, Chub) always put the description into the prompt,
 * while a card `system_prompt` is ignored unless the user opts in.
 */

/** Character Card V2 (`chara_card_v2`), the fields every Tavern app reads. */
export interface CharacterCardV2 {
  spec: "chara_card_v2";
  spec_version: "2.0";
  data: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    first_mes: string;
    mes_example: string;
    creator_notes: string;
    system_prompt: string;
    post_history_instructions: string;
    alternate_greetings: string[];
    tags: string[];
    creator: string;
    character_version: string;
    extensions: {
      unbottled: {
        skillUrl: string | null;
      };
    };
  };
}

export interface SkillCardSource {
  name: string;
  tagline: string | null;
  description: string | null;
  systemPrompt: string | null;
  /** Translated category label, exported as a tag. */
  categoryLabel: string;
  /** Who made the original (imported character) or published the skill. */
  creatorName: string | null;
  /** Public skill page, only for skills anyone can open. */
  skillUrl: string | null;
}

const DEFAULT_CREATOR = "unbottled.ai";

/** Build the card. `skillPageLine` is the localized "Skill page: <url>". */
export function buildCharacterCard(
  source: SkillCardSource,
  skillPageLine: string | null,
): CharacterCardV2 {
  const notes = [source.tagline, source.description, skillPageLine]
    .map((part) => part?.trim() ?? "")
    .filter(
      (part, index, all) => part.length > 0 && all.indexOf(part) === index,
    );

  return {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      name: source.name,
      description: source.systemPrompt?.trim() || source.description || "",
      personality: "",
      scenario: "",
      first_mes: "",
      mes_example: "",
      creator_notes: notes.join("\n\n"),
      system_prompt: "",
      post_history_instructions: "",
      alternate_greetings: [],
      tags: [source.categoryLabel, DEFAULT_CREATOR],
      creator: source.creatorName ?? DEFAULT_CREATOR,
      character_version: "1.0",
      extensions: {
        unbottled: {
          skillUrl: source.skillUrl,
        },
      },
    },
  };
}

/** Safe, readable download name: "seraphina.card.json". */
export function cardFileName(name: string, skillId: string): string {
  const base =
    name
      .normalize("NFKD")
      .replaceAll(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "")
      .slice(0, 60) ||
    skillId.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-") ||
    "character";
  return `${base}.card.json`;
}
