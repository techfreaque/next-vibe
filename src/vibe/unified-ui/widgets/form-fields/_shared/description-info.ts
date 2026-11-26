/** Filler words that never make a description informative on their own. */
const FILLER_WORDS: ReadonlySet<string> = new Set([
  "a",
  "an",
  "and",
  "enter",
  "for",
  "id",
  "is",
  "name",
  "of",
  "optional",
  "or",
  "select",
  "the",
  "this",
  "to",
  "value",
  "your",
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * A description only earns an icon when it says more than the label:
 * "The new name for this instance" under "New instance name" does not,
 * "Leave blank to keep your existing key" does.
 */
export function descriptionAddsInfo(
  description: string,
  label: string | undefined,
): boolean {
  const labelWords = new Set(label ? words(label) : []);
  const extra = words(description).filter(
    (word) => !labelWords.has(word) && !FILLER_WORDS.has(word),
  );
  return extra.length >= 2;
}
