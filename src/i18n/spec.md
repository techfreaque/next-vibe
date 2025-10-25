# i18n Folder Structure Specification

> **Part of NextVibe Framework** (GPL-3.0) - Type-safe internationalization system

## Overview

This document defines the standardized structure for internationalization (i18n) folders throughout the API codebase. Every API endpoint must have a corresponding i18n folder with translations for English (en), German (de), and Polish (pl).

## Core Principles

1. **Every API route has i18n**: Each directory containing a `route.ts` file must have an `i18n` folder
2. **Hierarchical imports**: Each parent imports only its direct children, not grandchildren
3. **Type safety**: German and Polish files use English types for consistency
4. **Standardized structure**: All i18n folders follow the same pattern

## Folder Structure

```
src/app/api/[locale]/v1/
├── domain/
│   ├── route.ts                    # API endpoint
│   ├── i18n/
│   │   ├── en/
│   │   │   └── index.ts           # English translations (source of truth)
│   │   ├── de/
│   │   │   └── index.ts           # German translations (typed from English)
│   │   └── pl/
│   │       └── index.ts           # Polish translations (typed from English)
│   └── subdomain/
│       ├── route.ts
│       └── i18n/
│           ├── en/index.ts
│           ├── de/index.ts
│           └── pl/index.ts
```

## File Templates

### English File (Source of Truth)

```typescript
// src/app/api/[locale]/v1/domain/i18n/en/index.ts
import { translations as subdomainTranslations } from "../../subdomain/i18n/en";

export const translations = {
  // Direct children only
  subdomain: subdomainTranslations,
};
```

### German File (Typed from English)

```typescript
// src/app/api/[locale]/v1/domain/i18n/de/index.ts
import type { translations as enTranslations } from "../en";

import { translations as subdomainTranslations } from "../../subdomain/i18n/de";

export const translations: typeof enTranslations = {
  subdomain: subdomainTranslations,
};
```

### Polish File (Typed from English)

```typescript
// src/app/api/[locale]/v1/domain/i18n/pl/index.ts
import type { translations as enTranslations } from "../en";

import { translations as subdomainTranslations } from "../../subdomain/i18n/pl";

export const translations: typeof enTranslations = {
  subdomain: subdomainTranslations,
};
```

## Universal Pattern

All i18n files follow the same pattern regardless of whether they have children or not:

### English File

```typescript
// src/app/api/[locale]/v1/domain/i18n/en/index.ts
import { translations as subdomainTranslations } from "../../subdomain/i18n/en";

export const translations = {
  // Own translations (if any)
  category: "Domain Category",
  tags: {
    domain: "Domain",
  },
  // Direct children (if any)
  subdomain: subdomainTranslations,
};
```

### German File

```typescript
// src/app/api/[locale]/v1/domain/i18n/de/index.ts
import type { translations as enTranslations } from "../en";

import { translations as subdomainTranslations } from "../../subdomain/i18n/de";

export const translations: typeof enTranslations = {
  // Own translations (if any)
  category: "Domain Kategorie",
  tags: {
    domain: "Domäne",
  },
  // Direct children (if any)
  subdomain: subdomainTranslations,
};
```

### Polish File

```typescript
// src/app/api/[locale]/v1/domain/i18n/pl/index.ts
import type { translations as enTranslations } from "../en";

import { translations as subdomainTranslations } from "../../subdomain/i18n/pl";

export const translations: typeof enTranslations = {
  // Own translations (if any)
  category: "Kategoria Domeny",
  tags: {
    domain: "Domena",
  },
  // Direct children (if any)
  subdomain: subdomainTranslations,
};
```

### Simple Example (No Children)

```typescript
// src/app/api/[locale]/v1/domain/i18n/en/index.ts
import { translations as subdomainTranslations } from "../../subdomain/i18n/en";

export const translations = {
  category: "Domain Category",
  tags: {
    endpoint: "Endpoint",
  },
};
```

## Import Rules

### ✅ Correct: Direct Children Only

```typescript
// Parent imports only direct children
import { translations as childTranslations } from "../../child/i18n/en";
import { translations as anotherChildTranslations } from "../../another-child/i18n/en";

export const translations = {
  child: childTranslations,
  anotherChild: anotherChildTranslations,
};
```

### ❌ Incorrect: Skipping Levels

```typescript
// DON'T import grandchildren directly
import { translations as grandchildTranslations } from "../../child/grandchild/i18n/en";
```

## Type Safety Rules

1. **English is source of truth**: All type definitions come from English files
2. **German/Polish use English types**: `typeof enTranslations` ensures consistency
3. **No `any` types**: All translations must be properly typed
4. **Consistent structure**: All language files must have identical structure

## Naming Conventions

- **Import aliases**: Use descriptive names ending with `Translations`
- **Export keys**: Use camelCase matching the folder name
- **File names**: Always `index.ts` in language folders
- **Folder names**: Use kebab-case matching API routes

## Examples

### Complex Domain (consultation)

```typescript
// consultation/i18n/en/index.ts
import { translations as adminTranslations } from "../../admin/i18n/en";
import { translations as availabilityTranslations } from "../../availability/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as scheduleTranslations } from "../../schedule/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  admin: adminTranslations,
  availability: availabilityTranslations,
  create: createTranslations,
  list: listTranslations,
  schedule: scheduleTranslations,
  status: statusTranslations,
};
```

### Simple Domain (onboarding)

```typescript
// onboarding/i18n/en/index.ts
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  status: statusTranslations,
};
```

## Validation Checklist

- [ ] Every `route.ts` has corresponding `i18n` folder
- [ ] All i18n folders have `en`, `de`, `pl` subfolders
- [ ] Each language folder has `index.ts` file
- [ ] English files export `const translations`
- [ ] German/Polish files use `typeof enTranslations`
- [ ] Parents import only direct children
- [ ] All imports use correct relative paths

- [ ] No TypeScript errors in any i18n file

## Migration Notes

When restructuring existing i18n files:

1. Start with English file as source of truth
2. Identify all direct children with i18n folders
3. Import each child using correct relative path
4. Create German/Polish files using English type

5. Verify no TypeScript errors remain

This specification ensures consistent, maintainable, and type-safe internationalization across the entire API codebase.
