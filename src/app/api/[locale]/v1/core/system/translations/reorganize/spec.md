# Translation Reorganization System

## Overview

Transform the current section-based translation structure (`src/i18n/en/sections/*`) to a location-based structure that follows the application's folder hierarchy. The system will reorganize translations to be co-located with their usage while maintaining the centralized index structure.

Additionally, the system should optionally support removal of unused translations during regeneration, to keep translation files clean and relevant.

## Goals

1. **Folder-level organization**: Create flat structure with keys based on folder hierarchy
2. **Location-based co-location**: Move translations to match usage locations (`src/app/[locale]/(site)/imprint/i18n/en/index.ts`)
3. **Smart key optimization**: Remove intermediate keys used only once, move multi-use keys to common ancestors
4. **Flat key structure**: Use dot-notation keys like `"app.(site).imprint.printButton"`
5. **Code transformation**: Update translation keys in code to match new folder-based structure
6. **Clean migration**: Delete old files after successful transformation
7. **Optional unused translation removal**: When enabled, remove translation keys that are not referenced anywhere in the codebase during regeneration

## Current Structure (NOT Optimized)

### Main Translation Index (`src/i18n/en/index.ts`)

```typescript
import { apiTranslations } from "../../app/api/[locale]/i18n/en/api";
import { adminTranslations } from "./sections/admin";
import { analyticsTranslations } from "./sections/analytics";
// ... 40+ section imports from ./sections/*

const translations = {
  admin: adminTranslations,
  analytics: analyticsTranslations,
  api: apiTranslations,
  // ... more sections
};
```

**Status**: Main index structure should stay as-is, but section imports need to be replaced.

### Current Section Structure (NOT Optimized)

**Section Files** (`src/i18n/en/sections/*`):

- 40+ section files like `admin.ts`, `analytics.ts`, `auth/`, `billing.ts`, etc.
- Nested directory structure with hundreds of translation files
- Examples: `sections/onboarding/consultation.ts`, `sections/common/buttons.ts`

**Problem**: Section-based organization instead of location-based co-location with usage.

## Target Architecture (Examples)

### Target API Structure (`src/app/api/[locale]/v1/i18n/en/api.ts`)

```typescript
import { agentStatusApi } from "../../agent/i18n/en/api";
import { consultationTranslations } from "../../consultation/i18n/en/api";
import { coreTranslations } from "../../core/i18n/en/api";

export const apiV1Translations = {
  agent: agentStatusApi,
  consultation: consultationTranslations,
  core: coreTranslations,
  // ... more API modules
} as const;
```

**Target Individual Module** (`src/app/api/[locale]/v1/core/contact/i18n/en/api.ts`):

```typescript
export const api = {
  title: "Contact Form Submission",
  form: {
    fields: {
      name: { label: "Full Name" },
    },
  },
};
```

**Note**: These structures are examples of the TARGET architecture that should be followed.

## Transformation Strategy

### Key Transformation Rules

1. **Folder-level organization**: Keys based on folder hierarchy only
   - Target: `"app.(site).imprint"` ✅
   - NOT file level: `"app.(site).imprint.printButton"` ❌ (unless single key)

2. **Smart key optimization**:
   - **Single key**: If `"app.(site).imprint.printButton"` is the only key, keep it
   - **Flatten single-use**: If `"app.(site).imprint.buttons.printButton"` has only one child → `"app.(site).imprint.printButton"`
   - **Keep multi-use**: If `buttons` has multiple children, preserve structure

3. **Multi-location handling**: Move to common ancestor
   - Key used in multiple places → `"app.printButton"`

4. **Special folder handling**:
   - `(site)` → preserved as `(site)`
   - `[locale]` → skipped in key path
   - `_components` → transformed to `components`

### Implementation Requirements

- **Code updates**: Update all translation key references via string replacement
- **File management**: Delete old files after backup, generate only where needed
- **Content preservation**: Never remove or simplify existing translations
- **Main index**: Keep structure intact, replace section imports with location-based imports

- **Optional unused translation removal**: Provide an option to remove translation keys that are not referenced in the codebase during regeneration. This should be configurable, and when enabled, only translation keys that are actually used in the codebase will be preserved in the regenerated files.

### File Format Requirements

- **File naming**: Always `index.ts` files
- **Structure**: Flat keys with nested imports for child directories
- **Exports**: `export const translations`
- **Types**: Non-English files import types from English
