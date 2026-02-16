# Translation Reorganization Specification

## Key Structure and Location Rules

### Single-Use Keys (Used Once)

**Rule:** Keys used in only ONE location co-locate to the nearest ancestor i18n directory.

**Example:**
- Usage file: `src/app/[locale]/chat/lib/utils/navigation.ts`
- Translation file: `src/app/[locale]/chat/i18n/en/index.ts`
- Location prefix: `app.chat`
- Key in translation file: Content from the source, NOT including file path
- Full key: `app.chat.{whatever}.{the}.{source}.{had}`

**Important:**
- We do NOT include `lib`, `utils`, `navigation.ts` or any file path in the key structure
- The key structure comes from the ORIGINAL flat translation content
- File organization (`lib/`, `utils/`, `components/`, etc.) is irrelevant to translation keys
- After flattening single-child objects recursively, old path names get removed naturally

### Shared Keys (Used Multiple Times)

**Rule:** Keys used in MULTIPLE locations go to the nearest common ancestor's i18n directory under a `common` object.

**Example:**
- Used in: `src/app/[locale]/chat/lib/utils/navigation.ts` AND `src/app/[locale]/chat/components/sidebar.tsx`
- Common ancestor: `src/app/[locale]/chat`
- Translation file: `src/app/[locale]/chat/i18n/en/index.ts`
- Key in file: `common.newPrivateChat`
- Full key: `app.chat.common.newPrivateChat`

**Important:**
- `common` namespace indicates the key is shared across multiple files
- Shared keys live at the nearest common ancestor i18n directory
- The `common.` prefix is added during reorganization

### Key Flattening

**Process:**
1. Keys are moved to co-located i18n files based on usage location
2. Location prefix (e.g., `app.chat`) is stripped from keys in the file
3. File contains just the suffix (e.g., `common.newPrivateChat` → becomes `common: { newPrivateChat: "..." }`)
4. Single-child objects are flattened recursively (e.g., `{ oldPath: { oldName: { actual: "value" } } }` → `{ actual: "value" }`)
5. This flattening removes weird old path names automatically

### Parent Aggregator Files

**Rule:** Parent directories re-export child translations to build the full translation tree.

**Example:**
- `src/app/i18n/en/index.ts` imports from `../../[locale]/i18n/en` and `../../api/i18n/en`
- Special case: `[locale]` folders are SPREAD (using `...`) to avoid `[locale]` in key paths
- Regular folders are exported as named keys (e.g., `api: apiTranslations`)

## Regeneration Workflow

### CRITICAL: Follow This Exact Procedure Every Time

**NEVER** commit regeneration files. **ONLY** commit generator fixes.

### Step 1: Before Each Regeneration

```bash
# Reset to clean state - removes all regeneration files from previous attempts
git reset --hard HEAD && git clean -fd
```

**Why:** Ensures you're regenerating from a clean, known state, not from broken/partial regenerations.

### Step 2: Run Regeneration

```bash
vibe translations:reorganize --regenerateStructure=true --dryRun=false -v > /tmp/regen-log.txt 2>&1
```

**Why:** Captures full verbose output for debugging. The `-v` flag is REQUIRED to see what the generator is doing.

### Step 3: Start Type Check in Background (DO NOT WAIT)

```bash
nohup bun x tsgo > /tmp/tsgo-errors.txt 2>&1 &
```

**Important:**
- Start this IMMEDIATELY after regeneration completes
- Do NOT wait for it (takes 15+ minutes)
- It will notify when done
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

### Issue: Keys include file paths like `lib.utils.navigation`

**Problem:** Generator is including directory structure in key names.

**Fix:** Keys should only reflect the original translation structure, not file paths. Flattening should remove these.

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
