import { Glob } from "bun";
import { expect, test } from "bun:test";

test("Spanish translations contain plain text instead of HTML entities", async () => {
  const files = new Glob("src/**/i18n/es/index.ts");
  const offenders: string[] = [];
  for await (const file of files.scan(".")) {
    const text = await Bun.file(file).text();
    if (/&(?:amp|apos|gt|lt|nbsp|quot|#\d+|#x[\da-f]+);/i.test(text)) {
      offenders.push(file);
    }
  }
  expect(offenders).toEqual([]);
});
