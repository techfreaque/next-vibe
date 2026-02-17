# Translation Reorganization Specification

## Key Structure Rules

### Single-Use Keys
Co-locate at the **deepest folder** where used. The complete folder path — including `lib/`, `utils/`, `components/`, etc. — is included in both the i18n directory path and the key prefix.

- Usage: `src/app/[locale]/chat/lib/utils/navigation.ts`
- i18n file: `src/app/[locale]/chat/lib/utils/i18n/en/index.ts`
- Location prefix: `app.chat.lib.utils`
- Full key: `app.chat.lib.utils.<suffix>`

### Shared Keys (Used in Multiple Locations)
Go to the **nearest common ancestor** under a `common` object (NOT the deepest folder). The `common.` prefix is added during reorganization.

- Used in: `src/app/[locale]/chat/lib/utils/navigation.ts` + `src/app/[locale]/chat/components/sidebar.tsx`
- Common ancestor: `src/app/[locale]/chat`
- i18n file: `src/app/[locale]/chat/i18n/en/index.ts`
- Location prefix: `app.chat`
- Full key: `app.chat.common.newPrivateChat`

### Key Flattening

**Rule:** In leaf i18n files only, after writing all keys, recursively flatten any object that has exactly one child. Repeat until no more single-child objects remain.

**This is the ONLY mechanism for removing old redundant namespace names.** The generator must NOT try to strip or deduplicate path segments during key calculation. Just:
1. Strip the location prefix from the full key to get the suffix
2. For shared keys, prepend `common.` to the suffix
3. Write the suffix as-is into the leaf file
4. After writing, flatten all single-child objects recursively

**Example:**
```
Old key:      app.admin.common.loading
Location:     app/[locale]/admin   →  prefix: app.admin
Suffix:       common.loading        (after stripping app.admin.)
In file:      { common: { loading: "Loading..." } }   ← no flattening needed here (2 children possible)
Full key:     app.admin.common.loading  ✓
```

```
Old key:      app.story.nav.user.login
Location:     app/[locale]/story/_components/nav  →  prefix: app.story._components.nav
Suffix after strip:     story.nav.user.login  (old namespace junk)
In file:      { story: { nav: { user: { login: "..." } } } }
After flatten (story→nav→user are single-child): { login: "..." }
Full key:     app.story._components.nav.login  ✓
```

**Source file keys must use the POST-flatten key path**, not the pre-flatten suffix. The generator updates source files AFTER flattening.

### Parent Aggregator Files
Parent directories re-export child translations to build the full tree. `[locale]` is the **only** folder that gets spread (`...`); all other folders export as named keys.

```ts
// src/app/i18n/en/index.ts
import { translations as localeTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";
export const translations = {
  ...localeTranslations,   // [locale] → spread (only exception)
  api: apiTranslations,    // regular folder → named key
};
```

---

## Naming Rules

### camelCase Conversion

| Input | Example | Output | Note |
|---|---|---|---|
| kebab-case | `speech-to-text` | `speechToText` | Hyphens always converted |
| internal snake_case | `not_found` | `notFound` | Underscore between alphanumeric chars converted |
| leading underscore | `_components` | `_components` | **Never converted** — Next.js private folder prefix |
| `[locale]` | `[locale]` | *(skipped)* | Only param folder that gets spread |
| all other `[param]` | `[id]`, `[...slug]` | `[id]`, `[...slug]` | Kept verbatim, never modified |

**Summary:** convert hyphens and internal `_` to camelCase; preserve leading `_`; `[locale]` is the only folder excluded from key paths; all other `[param]` folders (`[id]`, `[...slug]`, `[threadId]`, etc.) are included verbatim and never modified or camelCased.

---

## Regeneration Workflow

**NEVER commit regenerated files. ONLY commit generator fixes.**

**1. Reset** — removes all regeneration files from previous attempts, including untracked i18n dirs:
```bash
git checkout HEAD -- src/ && git clean -fdx src/
```

**2. Regenerate** — `-v` flag is REQUIRED to capture what the generator is doing:
```bash
vibe translations:reorganize --regenerateStructure=true --dryRun=false -v > /tmp/regen-log.txt 2>&1
```

**3. Start type check in background immediately** (do NOT wait — takes 15+ min):
```bash
bunx tsgo --noEmit --incremental --tsBuildInfoFile tsconfig.tsbuildinfo --skipLibCheck --project tsconfig.json > ./.tmp/tsgo-errors.txt &
```
Kill early with `pkill -9 tsgo` if you need to re-run. Use `tsgo`, not `tsc`.

**4. Manual verification** — while check runs, verify **20+ sample files**:
- Pick diverse files across the codebase
- For each: find a translation key usage, trace it to the expected i18n file, verify the key exists with correct structure

```bash
# Example: verify app.chat.common.newPrivateChat
grep -r "app\.chat\.common\.newPrivateChat" src/app/\[locale\]/chat   # find usage
grep "newPrivateChat" src/app/\[locale\]/chat/i18n/en/index.ts        # verify in file
```

**5. Analyze results:**
- Any sample fails → `pkill -9 tsgo`, fix the **generator code** (never modify regenerated source files), go to step 1
- All samples pass → wait for tsgo, review `.tmp/tsgo-errors.txt`, fix generator if needed, go to step 1

**6. Commit generator fixes only:**
```bash
git add src/app/api/[locale]/system/translations/reorganize/
git commit -m "fix: <description>"
# NEVER add regenerated files — they get deleted before next regeneration anyway
```

**7. Repeat** until 0 errors in 20+ manual samples AND 0 tsgo errors.

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Keys missing `lib.utils` etc. | Generator not including full directory structure | Keys must include full folder path to deepest usage location |
| Double segments like `app.chat.lib.utils.chat.common.X` | `fixKeyMappingsWithFlattening` adding extra segments | Preserve key structure after stripping location prefix, don't add new nesting |
| Shared keys missing `common.` prefix | `isShared` detection or common insertion broken | Check shared detection logic and common namespace insertion |

---

## Files (ALWAYS keep in context)

- Generator: `src/app/api/[locale]/system/translations/reorganize/repository/index.ts`
- File Generator: `src/app/api/[locale]/system/translations/reorganize/repository/file-generator.ts`
- This spec: `src/app/api/[locale]/system/translations/reorganize/spec.md`
