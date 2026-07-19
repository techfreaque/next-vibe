# `generator.ts` — code generation

A generator scans the tree for a marker filename and emits a file under `src/generated/`. It is how the framework avoids hand-written indexes: you add a `definition.ts` or a `setup.ts`, and the registry that references it writes itself.

`vibe gen` runs them. The orchestrator is `src/vibe/core/generators/generator.ts`.

---

## The contract

One exported function, taking the shared context and returning a summary:

```ts
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";

export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const entries = collect(
    findFilesRecursively(getApiDir(), isSetupFile),
    ctx.logger,
  );
  await writeGeneratedFile(OUTPUT_FILE, render(entries));
  return { summary: `setup index (${entries.length} setup files)` };
}
```

```ts
interface GeneratorResult {
  summary: string; // one line for `vibe gen` output
  counts?: Record<string, number>; // optional structured counts
  failed?: string; // report a hard failure without throwing
}
```

`failed` is the house answer to "how do I fail when `restricted-syntax` bans `throw`" — the same reason [`SetupResult`](setup.md) has one. The orchestrator catches throws too, but `failed` is the honest signal for "I ran and the answer is no".

---

## Registering

Three edits, all required. Miss any one and the generator either never runs or never re-runs.

**1. The key** — `core/generators/shared/find-generator-inputs.ts`:

```ts
export type GeneratorKey /* … */ = "setup-index";
```

**2. Its inputs** — same file. This mirrors what your generator scans, so the cache can fingerprint them:

```ts
case "setup-index":
  return findFilesRecursively(apiDir, isSetupFile);
```

`findFilesRecursively` takes an exact filename **or a predicate**, for conventions that are a shape rather than a name (`setup.ts` _and_ `<name>.setup.ts`).

**3. The registry entry** — `core/generators/generator.ts`:

```ts
{
  key: "setup-index",
  run: generateSetupIndex,
  phase: "default",
  needs: {},
  cacheKey: "setup-index",
  output: `${GENERATED_DIR}/setup/index.ts`,
  enabled: true,
},
```

| Field      | Meaning                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phase`    | `def-scan` runs sequentially (Bun TDZ) and is for anything derived from endpoint definitions. Everything else is `default`, which runs in parallel. |
| `needs`    | `{ definitionModules: true }` if you read imported definition modules from `ctx`.                                                                   |
| `cacheKey` | The `GeneratorKey` from step 1, or `null` to never cache.                                                                                           |
| `output`   | Primary emitted file. The cache compares it against the inputs.                                                                                     |
| `enabled`  | Opt-out switch.                                                                                                                                     |

**Step 2 is the one that bites.** `cacheKey` and the `findGeneratorInputs` case are what make the gen-cache work: if the inputs mapping is wrong, your files never look changed, so `vibe gen` skips the generator forever and it only re-runs under `--force`. There is a comment in that file recording exactly this bug for `agent-docs`.

---

## Rules

- **Bootstrap-safe.** Your generator and everything it imports must depend only on _source_, never on `src/generated/*`. Otherwise generation cannot recover from an empty generated tree.
- **Validate at generate time.** If a scanned file does not satisfy its contract, `logger.warn` and skip it — but only warn when the file was plausibly _meant_ to be yours. A common filename (`setup.ts`) that matches nothing of your contract is somebody else's file; skip it silently rather than warning on every run.
- **Prefer matching source over importing it.** Importing every scanned file makes `vibe gen` depend on all of them loading cleanly. Import only when you need the module's _values_ (as `category-index` does); a registry that re-exports needs only to know the exports exist.
- **Emit deterministic output.** Sort inputs (`findFilesRecursively` already does). Byte-unstable output makes the cache useless and every diff noisy.
- **Use the shared writers** — `writeGeneratedFile`, `generateFileHeader`, `getRelativeImportPath(sourceFile, outputFile)` (source first — the argument order is easy to reverse).

---

## Verifying your work

```bash
vibe gen              # your generator must appear with a summary line
vibe gen              # run twice — the second must report "unchanged" (cache works)
vibe gen --force      # regenerate unconditionally
```

If the second run does _not_ say `unchanged`, your `output` path is wrong. If it says `unchanged` after you edited an input, your `findGeneratorInputs` case is wrong.

Note that `core/generators/setup.ts` runs the whole registry with `force: true` — setup runs precisely when the framework itself changed, and the cache asks about inputs, not about emit logic.
