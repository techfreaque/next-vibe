# Translation Reorganization Specification

## Key Structure and Location Rules

### Single-Use Keys (Used Once)

**Rule:** Keys used in only ONE location co-locate to the DEEPEST folder where they are used. The i18n directory is created at that exact location.

**Example:**
- Usage file: `src/app/[locale]/chat/lib/utils/navigation.ts`
- Translation i18n directory: `src/app/[locale]/chat/lib/utils/i18n/en/index.ts` (at the DEEPEST folder)
- Location prefix: `app.chat.lib.utils`
- Key in translation file: Content from the source with the location prefix stripped
- Full key: `app.chat.lib.utils.{whatever}.{the}.{source}.{had}`

**Important:**
- The complete folder structure IS included in both the i18n directory path AND the key prefix
- `lib/`, `utils/`, `components/`, etc. ARE part of the location and key structure
- The i18n directory is created at the deepest folder level where the key is used
- After flattening single-child objects recursively in the leaf file, old redundant path names get removed

### Shared Keys (Used Multiple Times)

**Rule:** Keys used in MULTIPLE locations go to the nearest common ancestor's i18n directory under a `common` object. The i18n directory is created at the common ancestor folder.

**Example:**
- Used in: `src/app/[locale]/chat/lib/utils/navigation.ts` AND `src/app/[locale]/chat/components/sidebar.tsx`
- Common ancestor: `src/app/[locale]/chat`
- Translation i18n directory: `src/app/[locale]/chat/i18n/en/index.ts` (at the common ancestor)
- Location prefix: `app.chat`
- Key in file: `common.newPrivateChat`
- Full key: `app.chat.common.newPrivateChat`

**Important:**
- `common` namespace indicates the key is shared across multiple files
- Shared keys live at the nearest common ancestor i18n directory (NOT the deepest folder)
- The `common.` prefix is added during reorganization
- The complete folder structure up to the common ancestor IS included in the location prefix

### Key Flattening

**Process:**
1. Keys are moved to co-located i18n files based on usage location (deepest folder for single-use, common ancestor for shared)
2. Location prefix (e.g., `app.chat.lib.utils` for single-use or `app.chat` for shared) is stripped from keys in the file
3. File contains just the suffix (e.g., `common.newPrivateChat` → becomes `common: { newPrivateChat: "..." }`)
4. Single-child objects are flattened recursively (e.g., `{ oldPath: { oldName: { actual: "value" } } }` → `{ actual: "value" }`)
5. This flattening removes weird old redundant path names automatically from the leaf file content

### Parent Aggregator Files

**Rule:** Parent directories re-export child translations to build the full translation tree.

**Example:**
- `src/app/i18n/en/index.ts` imports from `../../[locale]/i18n/en` and `../../api/i18n/en`
- **EXCEPTION:** `[locale]` folders are SPREAD (using `...`) to avoid `[locale]` in key paths
  - This is the ONLY exception to including folder names in the path
  - `[locale]` is a Next.js dynamic route parameter, not a translation scope
- Regular folders are exported as named keys (e.g., `api: apiTranslations`)

## Regeneration Workflow

### CRITICAL: Follow This Exact Procedure Every Time

**NEVER** commit regeneration files. **ONLY** commit generator fixes.

### Step 1: Before Each Regeneration

```bash
# Reset to clean state - removes all regeneration files from previous attempts
```

**Why:** Ensures you're regenerating from a clean, known state, not from broken/partial regenerations. The -fdx flag removes untracked i18n directories created by failed regenerations.

### Step 2: Run Regeneration

```bash
vibe translations:reorganize --regenerateStructure=true --dryRun=false -v > /tmp/regen-log.txt 2>&1
```

**Why:** Captures full verbose output for debugging. The `-v` flag is REQUIRED to see what the generator is doing.

### Step 3: Start Type Check in Background (DO NOT WAIT)

```bash
bunx tsgo --noEmit --incremental --tsBuildInfoFile tsconfig.tsbuildinfo --skipLibCheck --project tsconfig.json > ./.tmp/tsgo-errors.txt
```

**Important:**
- Start this IMMEDIATELY after regeneration completes
- Do NOT wait for it (takes 15+ minutes)
- It should notify when done
- Use `tsgo` NOT `tsc` (tsc is too slow)
- You can kill it early with `pkill -9 tsgo` if you find issues and need to regenerate sooner

### Step 4: Manual Verification (While Check Runs)

Verify EXACTLY **20+ sample files** by checking if keys exist in i18n files.

**What to check:**
1. Pick diverse sample files across the codebase
2. For each sample, find a usage of a translation key
3. Trace the key to the expected i18n file location
4. Verify the key exists in that file with correct structure

**How to verify:**
```bash
# Example: Check if app.chat.common.newPrivateChat exists
# 1. Find usage
grep -r "app\.chat\.common\.newPrivateChat" src/app/[locale]/chat

# 2. Check translation file
grep "newPrivateChat" src/app/[locale]/chat/i18n/en/index.ts
```

**Script template:**
```bash
#!/bin/bash
samples=(
  "src/app/[locale]/chat/i18n/en/index.ts:app.chat.common.newPrivateChat:src/app/[locale]/chat/lib/utils/navigation.ts"
  # ... 20+ more samples
)

for sample in "${samples[@]}"; do
  IFS=':' read -r file key usage <<< "$sample"
  # Check file exists
  # Check key exists in file
  # Check usage references the key
done
```

### Step 5: Analyze Results

**If you find ANY errors in your 20+ samples:**
- Kill the background check: `pkill -9 tsgo`
- Analyze the error in the regeneration log `/tmp/regen-log.txt`
- **Fix the GENERATOR code** (never modify regenerated source files)
- Go back to Step 1

**If all 20+ samples pass:**
- Wait for tsgo to complete
- Review `/tmp/tsgo-errors.txt`
- If there are errors, analyze and fix the generator
- Go back to Step 1

### Step 6: Commit Generator Fixes Only

```bash
# ONLY commit the generator changes
git add src/app/api/[locale]/system/translations/reorganize/
git commit -m "fix: <description of what you fixed>"

# NEVER add regenerated files
# They should be deleted before next regeneration anyway
```

### Step 7: Repeat Until Perfect

**Do NOT stop unless:**
- 0 errors in 20+ manual sample verifications
- 0 errors in tsgo typecheck
- All translation keys resolve correctly

## Common Issues and Fixes

### Issue: Keys missing folder structure like `lib.utils`

**Problem:** Generator is NOT including the complete directory structure in key names.

**Fix:** Keys MUST include the full folder path from app root to the deepest usage location. For single-use keys, this includes `lib/`, `utils/`, `components/`, etc. all the way to the deepest folder.

### Issue: Keys have double segments like `app.chat.lib.utils.chat.common.newPrivateChat`

**Problem:** `fixKeyMappingsWithFlattening` is incorrectly adding extra segments.

**Fix:** The function should preserve the key structure after stripping location prefix, not add new nesting.

### Issue: Shared keys don't have `common.` prefix

**Problem:** Generator not detecting keys are shared or not adding `common` namespace.

**Fix:** Check `isShared` detection logic and common namespace insertion.

## Files to Track

- Generator: `src/app/api/[locale]/system/translations/reorganize/repository/index.ts`
- File Generator: `src/app/api/[locale]/system/translations/reorganize/repository/file-generator.ts`
- This spec: `spec.md` (ALWAYS keep in context)
