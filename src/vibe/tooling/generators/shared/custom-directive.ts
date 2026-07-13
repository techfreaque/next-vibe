import { existsSync, readFileSync } from "node:fs";

/**
 * Returns true if the file contains a "use custom" or "use-custom" directive
 * in its first 10 lines. Used to protect manually customized generated files
 * from being auto-staged or overwritten.
 */
export function hasCustomDirective(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  try {
    const content = readFileSync(filePath, "utf-8");
    return content
      .split("\n")
      .slice(0, 10)
      .some((line) => {
        const t = line.trim().replace(/;$/, "");
        return (
          t === '"use custom"' ||
          t === "'use custom'" ||
          t === '"use-custom"' ||
          t === "'use-custom'"
        );
      });
  } catch {
    return false;
  }
}
