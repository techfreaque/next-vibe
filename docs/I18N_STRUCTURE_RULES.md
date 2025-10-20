# i18n Structure Rules - MANDATORY

**Status:** CRITICAL - NO EXCEPTIONS ALLOWED

---

## ⚡ CRITICAL: NO CACHE - IMMEDIATE FEEDBACK

**THERE IS NO CACHE FOR TYPES OR TRANSLATIONS!**

When you:

- ✅ Add a translation key to the i18n files
- ✅ Fix a translation path in the code
- ✅ Update any translation-related code

**The errors disappear IMMEDIATELY** when you run `vibe check`.

You do **NOT** need to:

- ❌ Regenerate types
- ❌ Restart the dev server
- ❌ Clear any cache
- ❌ Wait for anything
- ❌ Run any build commands

**The type system is LIVE and reflects changes INSTANTLY.**

### If you still see errors after fixing

It means ONE of these is true:

1. ❌ The key is still **missing** from the i18n file
2. ❌ The path in the code is still **incorrect**
3. ❌ There's a **typo** in either the key or the path
4. ❌ The key exists but the **structure doesn't match** (e.g., `error.title` vs `errors.title`)

**Fix the actual issue - the error will vanish immediately!**

---

## 🏗️ The ONLY Allowed Structure

```
any-directory/
├── i18n/
│   ├── en/
│   │   └── index.ts    ← ONLY THIS FILE, NOTHING ELSE
│   ├── de/
│   │   └── index.ts    ← ONLY THIS FILE, NOTHING ELSE
│   └── pl/
│       └── index.ts    ← ONLY THIS FILE, NOTHING ELSE
```

---

## ✅ Rules (NO EXCEPTIONS)

1. **Each directory level** has its own `i18n/` folder
2. **Inside `i18n/`** there are ONLY 3 folders: `en/`, `de/`, `pl/`
3. **Inside each language folder** there is ONLY ONE file: `index.ts`
4. **NO other .ts files** are allowed in language folders
5. **NO subdirectories** are allowed in language folders
6. **Parent `index.ts`** imports from child `index.ts` files

---

## 📚 Real Examples from Codebase

### Example 1: API Structure

```typescript
// Parent: src/app/api/[locale]/v1/i18n/en/index.ts
import { translations as coreTranslations } from "../../core/i18n/en";

export const translations = {
  core: coreTranslations,
};

// Child: src/app/api/[locale]/v1/core/i18n/en/index.ts
import { translations as leadsTranslations } from "../../leads/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";

export const translations = {
  leads: leadsTranslations,
  user: userTranslations,
};
```

### Example 2: Admin Emails Structure

```typescript
// Parent: src/app/[locale]/admin/emails/i18n/en/index.ts
import { translations as imapTranslations } from "../../imap/i18n/en";
import { translations as smtpTranslations } from "../../smtp/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";

export const translations = {
  imap: imapTranslations,
  smtp: smtpTranslations,
  list: listTranslations,
  
  // Direct translations for this level
  emails: {
    nav: {
      overview: "Overview",
      campaigns: "Email List",
    },
  },
};
```

---

## ❌ Common Mistakes to AVOID

### ❌ WRONG: Multiple files in language folder

```
i18n/
├── en/
│   ├── index.ts
│   ├── email.ts        ← WRONG! Delete this
│   ├── emails.ts       ← WRONG! Delete this
│   └── imap.ts         ← WRONG! Delete this
```

### ❌ WRONG: Subdirectories in language folder

```
i18n/
├── en/
│   ├── index.ts
│   ├── email/          ← WRONG! Delete this folder
│   └── emails/         ← WRONG! Delete this folder
```

### ❌ WRONG: Importing from non-existent files

```typescript
// WRONG! These files don't exist
import { translations as emailTranslations } from "./email";
import { translations as emailsTranslations } from "./emails";
```

---

## ✅ How to Fix Violations

### Step 1: Identify Violations

```bash
# Find all files in language folders (should only be index.ts)
find src -path "*/i18n/en/*" -type f
find src -path "*/i18n/de/*" -type f
find src -path "*/i18n/pl/*" -type f

# Find all subdirectories in language folders (should be none)
find src -path "*/i18n/en/*" -type d
find src -path "*/i18n/de/*" -type d
find src -path "*/i18n/pl/*" -type d
```

### Step 2: Delete Extra Files

```bash
# Delete all files except index.ts
cd src/app/[locale]/admin/emails/i18n/en/
rm -f !(index.ts)  # Keep only index.ts

# Delete all subdirectories
rm -rf */
```

### Step 3: Fix Imports

```typescript
// Before (WRONG)
import { translations as emailTranslations } from "./email";
import { translations as emailsTranslations } from "./emails";

export const translations = {
  email: emailTranslations,
  emails: emailsTranslations,
};

// After (CORRECT)
import { translations as imapTranslations } from "../../imap/i18n/en";

export const translations = {
  imap: imapTranslations,
  
  // Define translations inline
  emails: {
    nav: {
      overview: "Overview",
    },
  },
};
```

### Step 4: Verify

```bash
# Run vibe check to ensure 0 errors
vibe check src/app/[locale]/admin/emails
```

---

## 🎯 Key Takeaways

1. **ONE file per language folder**: Only `index.ts`, nothing else
2. **NO subdirectories**: Language folders are flat
3. **Parent imports from child**: Hierarchical structure through imports
4. **Delete violations immediately**: Don't leave extra files around
5. **Run vibe check**: Verify structure after any changes

---

## 📝 Checklist for Every i18n Folder

- [ ] Only 3 folders exist: `en/`, `de/`, `pl/`
- [ ] Each folder has ONLY `index.ts`
- [ ] No other .ts files in language folders
- [ ] No subdirectories in language folders
- [ ] Parent correctly imports from children
- [ ] All imports point to existing files
- [ ] `vibe check` passes with 0 errors

---

## 🚨 When in Doubt

**Ask yourself:**

1. Is there more than one file in the language folder? → **DELETE extras**
2. Are there subdirectories in the language folder? → **DELETE them**
3. Are imports pointing to non-existent files? → **FIX imports**
4. Does `vibe check` pass? → **If not, fix structure first**

**Remember:** This structure is MANDATORY. No exceptions, no special cases, no "but what if...". Follow the rules strictly.

---

## 🔑 Translation Key Patterns - CRITICAL

### ⚡ THE GOLDEN RULE: Keys Map EXACTLY to Folder Paths

**Translation keys map EXACTLY to the folder structure.**

**ONLY ONE EXCEPTION: The `[locale]` folder is SPREAD (removed from the path).**

**NO OTHER EXCEPTIONS! NO SHORTCUTS! NO ALIASES!**

### Path-to-Key Mapping - THE FORMULA

```
File path: src/app/[locale]/story/_components/i18n/en/index.ts
              └─┬─┘ └─┬──┘ └──┬─┘ └────┬────┘ └──────┬──────┘
                │     │       │        │             │
                │     │       │        │             └─ Remove this
                │     │       │        └─ Keep this
                │     │       └─ Keep this
                │     └── REMOVE THIS (spread)
                └─ Keep this

Result: app.story._components.{yourKey}
```

### Step-by-Step Process

1. **Start with file path**: `src/app/[locale]/story/_components/i18n/en/index.ts`
2. **Remove `src/`**: `app/[locale]/story/_components/i18n/en/index.ts`
3. **Remove `[locale]`**: `app/story/_components/i18n/en/index.ts`
4. **Remove `/i18n/en/index.ts`**: `app/story/_components`
5. **Replace `/` with `.`**: `app.story._components`
6. **Add object path from i18n file**: `app.story._components.{yourObjectPath}`

### Real Examples

```typescript
// Example 1: Story hero component
File: src/app/[locale]/story/_components/i18n/en/index.ts
Object in file: { hero: { title: "..." } }
Key: app.story._components.hero.title
     ^^^  ^^^^^  ^^^^^^^^^^^  ^^^^  ^^^^^
     app  story  _components  hero  title
     └─ ALL folders in path (except [locale])

// Example 2: API user errors
File: src/app/api/[locale]/v1/core/user/i18n/en/index.ts
Object in file: { errors: { notFound: { title: "..." } } }
Key: app.api.v1.core.user.errors.notFound.title
     ^^^  ^^^ ^^  ^^^^  ^^^^  ^^^^^^  ^^^^^^^^  ^^^^^
     app  api v1  core  user  errors  notFound  title
     └─ ALL folders in path (except [locale])

// Example 3: Admin leads table
File: src/app/[locale]/admin/leads/list/i18n/en/index.ts
Object in file: { table: { columns: { email: "..." } } }
Key: app.admin.leads.list.table.columns.email
     ^^^  ^^^^^  ^^^^^  ^^^^  ^^^^^  ^^^^^^^  ^^^^^
     app  admin  leads  list  table  columns  email
     └─ ALL folders in path (except [locale])
```

### ❌ WRONG - Common Mistakes

```typescript
// ❌ WRONG: Missing folder segments
t("app.story.hero.title")
// Missing _components! Should be: app.story._components.hero.title

// ❌ WRONG: Including [locale]
t("app.locale.story._components.hero.title")
// [locale] should be removed! Should be: app.story._components.hero.title

// ❌ WRONG: Using aliases
t("app.site._components.hero.title")
// Folder is "story" not "site"! Should be: app.story._components.hero.title

// ❌ WRONG: Skipping folders
t("app.api.user.errors")
// Missing v1.core! Should be: app.api.v1.core.user.errors
```

### 🚨 IF PARENT I18N FILES USE WRONG NAMES - FIX THEM

**DO NOT use aliases or shortcuts in parent i18n files!**

```typescript
// ❌ WRONG - Using alias
export const translations = {
  site: siteTranslations,  // ← WRONG! Folder is "story" not "site"
};

// ✅ CORRECT - Match folder name exactly
export const translations = {
  story: storyTranslations,  // ← CORRECT! Matches folder name
};
```

**If you find wrong names in parent i18n files:**

1. ❌ DO NOT use the wrong name in your keys
2. ✅ FIX the parent i18n file to match the folder name
3. ✅ Update all keys that use the wrong name

### 🔍 Debugging Process

**If you get type errors:**

```
Argument of type '"app.story.privacyPolicy.title"' is not assignable...
```

**Follow these steps:**

1. **Find the i18n file path**

   ```bash
   # Where is this translation defined?
   find src -name "index.ts" -path "*/i18n/en/*" | grep privacy
   # Result: src/app/[locale]/story/_components/i18n/en/index.ts
   ```

2. **Build the key from the path**

   ```
   src/app/[locale]/story/_components/i18n/en/index.ts
   Remove src/: app/[locale]/story/_components/i18n/en/index.ts
   Remove [locale]: app/story/_components/i18n/en/index.ts
   Remove /i18n/en/index.ts: app/story/_components
   Replace / with .: app.story._components
   ```

3. **Check the object structure in the i18n file**

   ```typescript
   // In src/app/[locale]/story/_components/i18n/en/index.ts
   export const translations = {
     privacyPolicy: {  // ← Object is at root level
       title: "...",
     }
   };
   ```

4. **Build the complete key**

   ```
   Path: app.story._components
   Object: privacyPolicy.title
   Full key: app.story._components.privacyPolicy.title
   ```

5. **Verify in parent i18n files**

   ```bash
   # Check if parent files spread or nest this
   cat src/app/[locale]/story/i18n/en/index.ts
   ```

   ```typescript
   // If parent spreads:
   export const translations = {
     ..._componentsTranslations,  // ← Spreads to root
   };
   // Then key is: app.story.privacyPolicy.title

   // If parent nests:
   export const translations = {
     _components: _componentsTranslations,  // ← Nested under _components
   };
   // Then key is: app.story._components.privacyPolicy.title
   ```

### Path Construction Rules - NO EXCEPTIONS

1. **Always start with `app.`**
2. **Include EVERY folder in the path** (except `[locale]`)
3. **Remove ONLY `[locale]`** - nothing else
4. **Match folder names EXACTLY** (including underscores, case, etc.)
5. **NO aliases, NO shortcuts, NO exceptions**
6. **If parent i18n uses wrong names → FIX THE PARENT**

---

## 📋 Translation File Patterns

### English (en/index.ts) - NO `as const`

```typescript
// ✅ CORRECT - English WITHOUT as const
export const translations = {
  navigation: {
    dashboard: "Dashboard",
    users: "Users",
  },
  errors: {
    notFound: "Not found",
    serverError: "Server error",
  },
};
```

### German/Polish (de/index.ts, pl/index.ts) - WITH `typeof`

```typescript
// ✅ CORRECT - German/Polish WITH typeof
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  navigation: {
    dashboard: "Dashboard",
    users: "Benutzer",
  },
  errors: {
    notFound: "Nicht gefunden",
    serverError: "Serverfehler",
  },
};
```

### Common Mistakes

```typescript
// ❌ WRONG - English with as const
export const translations = {
  navigation: {
    dashboard: "Dashboard",
  },
} as const;  // ← DELETE THIS

// ❌ WRONG - German/Polish without typeof
export const translations = {
  navigation: {
    dashboard: "Dashboard",
  },
};  // ← MISSING: typeof enTranslations

// ❌ WRONG - German/Polish with as const
export const translations: typeof enTranslations = {
  navigation: {
    dashboard: "Dashboard",
  },
} as const;  // ← DELETE THIS
```

---

## 🔄 Complete Migration Workflow

### Step 1: Check BEFORE

```bash
# Always run vibe check BEFORE making changes
vibe check src/app/[locale]/admin/leads
```

Note the error count and types.

### Step 2: Check for Violations

```bash
# Find files that violate the structure
find src/app/[locale]/admin/leads/i18n/en -name "*.ts" ! -name "index.ts"
```

### Step 3: Fix Structure Violations

If violations exist:

```bash
# Option A: Delete nested folders (if subdirectories have their own i18n)
cd src/app/[locale]/admin/leads/i18n/en
rm -rf leads/ leadsErrors/

# Option B: Consolidate content (if no subdirectory i18n)
# Manually merge all .ts files into index.ts, then delete extras
```

### Step 4: Update Translation Keys in Code

```typescript
// Find all translation usage in components
grep -r "t(\"" src/app/[locale]/admin/leads/

// Update to use full paths
// Before: t("leads.list.title")
// After:  t("app.admin.leads.list.title")
```

### Step 5: Add Missing Keys to i18n Files

```typescript
// en/index.ts
export const translations = {
  list: {
    title: "Leads List",
    columns: {
      email: "Email",
      name: "Name",
    },
  },
};

// de/index.ts
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Leads-Liste",
    columns: {
      email: "E-Mail",
      name: "Name",
    },
  },
};

// pl/index.ts
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Lista Leadów",
    columns: {
      email: "E-mail",
      name: "Nazwa",
    },
  },
};
```

### Step 6: Check AFTER

```bash
# Verify the fix worked
vibe check src/app/[locale]/admin/leads
```

Compare error count with BEFORE. Should be reduced or zero.

---

## 🎯 Folder-by-Folder Migration Strategy

### Priority Order

1. **Fix structure violations first** (nested folders/files)
2. **Add missing translation keys** (to i18n files)
3. **Update component code** (to use full paths)
4. **Verify with vibe check** (before and after)

### Template for Each Folder

```bash
# 1. BEFORE
echo "=== BEFORE: {folder} ==="
vibe check {folder} 2>&1 | tail -15

# 2. Check violations
find {folder}/i18n/en -name "*.ts" ! -name "index.ts"

# 3. Fix violations
# ... make changes ...

# 4. AFTER
echo "=== AFTER: {folder} ==="
vibe check {folder} 2>&1 | tail -15
```

---

## 🚨 Critical Rules Summary

### File Structure

- ✅ ONE `index.ts` per language folder
- ❌ NO other .ts files
- ❌ NO subdirectories in language folders

### Translation Patterns

- ✅ English: `export const translations = { ... }`
- ✅ German/Polish: `export const translations: typeof enTranslations = { ... }`
- ❌ NEVER use `as const` in any translation file

### Translation Keys

- ✅ Full path: `app.admin.leads.list.title`
- ❌ Partial path: `leads.list.title`
- ✅ camelCase: `notFound`
- ❌ snake_case: `not_found`

### Workflow

- ✅ Always vibe check BEFORE
- ✅ Fix structure violations first
- ✅ Add missing keys to all 3 languages
- ✅ Always vibe check AFTER

---

## 📖 Quick Reference

### Check for violations

```bash
find src/app/[locale] -path "*/i18n/en/*" -name "*.ts" ! -name "index.ts"
```

### Delete violations

```bash
cd {folder}/i18n/en && rm -rf !(index.ts) */
cd {folder}/i18n/de && rm -rf !(index.ts) */
cd {folder}/i18n/pl && rm -rf !(index.ts) */
```

### Verify structure

```bash
vibe check {folder}
```
