# Enum Patterns

> **Part of NextVibe Framework** (GPL-3.0) - Centralized enum system with translation keys
>
> **For Developers & AI:** Opinionated patterns for type-safe, translatable enums

**Golden Rule: All enums use `createEnumOptions`, export `enum`/`options`/`Value`/`DB`, use translation keys (never hardcoded strings), and integrate with Drizzle ORM via text() with enum constraints.**

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Enum File Structure](#enum-file-structure)
3. [Translation Key Patterns](#translation-key-patterns)
4. [Usage Patterns](#usage-patterns)
5. [Database Integration](#database-integration)
6. [Anti-Patterns](#anti-patterns)
7. [Migration Guide](#migration-guide)
8. [Validation Workflow](#validation-workflow)

---

## Core Concepts

### createEnumOptions

**Import:** `@/app/api/[locale]/system/unified-interface/shared/field/enum`

**Returns:**

- `enum` - Object with keys (for comparisons: `Status.PENDING`)
- `options` - Array for UI components (dropdowns, selects)
- `Value` - TypeScript type for type safety

**Critical Rule:** Enum values MUST be valid translation keys from i18n files

### The Process

**Always follow this order:**

1. Create translation keys FIRST (all 3 languages: en, de, pl)
2. Create enum using `createEnumOptions`
3. Export `DB` array for database use
4. Run `vibe check`

**Never** create enums before translations exist - vibe check will fail.

---

## Enum File Structure

### Complete Pattern

```typescript
// enum.ts
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Consultation Status Enum
 * Defines the possible states of a consultation booking
 */
export const {
  enum: ConsultationStatus,
  options: ConsultationStatusOptions,
  Value: ConsultationStatusValue,
} = createEnumOptions({
  PENDING: "app.api.consultation.enums.consultationStatus.pending",
  SCHEDULED: "app.api.consultation.enums.consultationStatus.scheduled",
  COMPLETED: "app.api.consultation.enums.consultationStatus.completed",
  CANCELLED: "app.api.consultation.enums.consultationStatus.cancelled",
});

/**
 * Database enum array for Drizzle ORM
 * Used with text() + enum constraint in db.ts
 */
export const ConsultationStatusDB = [
  ConsultationStatus.PENDING,
  ConsultationStatus.SCHEDULED,
  ConsultationStatus.COMPLETED,
  ConsultationStatus.CANCELLED,
] as const;
```

### Required Exports

Every enum must export exactly 4 things:

| Export    | Type        | Purpose           | Naming          |
| --------- | ----------- | ----------------- | --------------- |
| `enum`    | Object      | Value comparisons | `{Name}`        |
| `options` | Array       | UI components     | `{Name}Options` |
| `Value`   | Type        | Type annotations  | `{Name}Value`   |
| `DB`      | Const array | Database schemas  | `{Name}DB`      |

### Naming Conventions

```typescript
// ✅ CORRECT - Destructuring pattern
export const {
  enum: LeadStatus,              // PascalCase
  options: LeadStatusOptions,    // PascalCase + Options
  Value: LeadStatusValue,        // PascalCase + Value
} = createEnumOptions({
  NEW: "...",                    // SCREAMING_SNAKE_CASE for keys
});

export const LeadStatusDB = [...] as const;  // PascalCase + DB

// ❌ WRONG - Variable assignment
const enumVar = createEnumOptions({...});
export const Status = enumVar.enum;         // Don't do this

// ❌ WRONG - Inconsistent naming
export const { enum: status, ... }          // Must be PascalCase
export const StatusOpts = [...];             // Must end with Options
```

---

## Translation Key Patterns

### Pattern Structure

```
app.api.{domain}.{subdomain}.enums.{enumName}.{value}
```

**Examples:**

```typescript
"app.api.consultation.enums.consultationStatus.pending";
"app.api.leads.enums.leadStatus.new";
"app.api.user.enums.userRole.admin";
```

### Creating Translations

**Must create in ALL 3 languages:**

```typescript
// i18n/en/index.ts
export const translations = {
  enums: {
    consultationStatus: {
      pending: "Pending",
      scheduled: "Scheduled",
      completed: "Completed",
      cancelled: "Cancelled",
    },
  },
};

// i18n/de/index.ts
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    consultationStatus: {
      pending: "Ausstehend",
      scheduled: "Geplant",
      completed: "Abgeschlossen",
      cancelled: "Abgesagt",
    },
  },
};

// i18n/pl/index.ts
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    consultationStatus: {
      pending: "Oczekujący",
      scheduled: "Zaplanowany",
      completed: "Zakończony",
      cancelled: "Anulowany",
    },
  },
};
```

**Critical:** German and Polish MUST use `typeof enTranslations` for type safety.

### Translation File Structure

```
consultation/
├── enum.ts
└── i18n/
    ├── de/
    │   └── index.ts  # WITH typeof enTranslations
    ├── en/
    │   └── index.ts  # Base translations
    └── pl/
        └── index.ts  # WITH typeof enTranslations
```

---

## Usage Patterns

### In definition.ts

```typescript
import {
  WidgetType,
  FieldDataType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { requestResponseField } from "@/app/api/[locale]/system/unified-interface/shared/field";
import { z } from "zod";
import { ConsultationStatus, ConsultationStatusOptions } from "./enum";

export const createConsultationRequest = objectField({
  // Field definition - use Options for UI
  status: requestResponseField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.SELECT,
      options: ConsultationStatusOptions, // ✅ Use Options
    },
    z.enum(ConsultationStatus).optional(), // ✅ Use z.enum(EnumName)
  ),
});

// Examples - use enum values
export const examples = {
  requests: {
    default: {
      status: ConsultationStatus.PENDING, // ✅ Use enum value
    },
  },
};
```

**Key Points:**

- Import enum object (NOT schemas)
- Use `z.enum(EnumName)` for validation
- Use `EnumOptions` for field options
- Use enum values (`Enum.VALUE`) in examples

### In repository.ts

```typescript
import { db } from "@/app/api/[locale]/system/db";
import { eq } from "drizzle-orm";
import { consultations } from "./db";
import { ConsultationStatus, ConsultationStatusValue } from "./enum";

// Use EnumValue for type annotations
export async function getByStatus(status: ConsultationStatusValue): Promise<Consultation[]> {
  return await db.select().from(consultations).where(eq(consultations.status, status));
}

// Use enum values for comparisons
export async function markCompleted(id: string): Promise<void> {
  await db
    .update(consultations)
    .set({ status: ConsultationStatus.COMPLETED }) // ✅ Enum value
    .where(eq(consultations.id, id));
}

// Filtering logic
export function filterByStatus(items: Consultation[], status: ConsultationStatusValue) {
  return items.filter((item) => item.status === status);
}
```

### In Components

```typescript
import { ConsultationStatus, ConsultationStatusOptions, ConsultationStatusValue } from "../enum";

// Type annotations use EnumValue
interface ConsultationCardProps {
  status: ConsultationStatusValue;
  onStatusChange: (status: ConsultationStatusValue) => void;
}

export function ConsultationCard({ status, onStatusChange }: ConsultationCardProps) {
  // Comparisons use enum values
  const isPending = status === ConsultationStatus.PENDING;
  const canCancel = status !== ConsultationStatus.COMPLETED;

  return (
    <Div>
      {isPending && <Badge variant="warning">Pending</Badge>}

      {/* Dropdowns use Options */}
      <Select
        options={ConsultationStatusOptions}
        value={status}
        onChange={onStatusChange}
      />
    </Div>
  );
}
```

### In Pages

```typescript
import { ConsultationStatus } from "../enum";

export default function ConsultationsPage({ searchParams }: PageProps) {
  // Default values use enum values
  const status = searchParams.status || ConsultationStatus.PENDING;

  // Comparisons use enum values
  if (status === ConsultationStatus.COMPLETED) {
    // Show completed consultations
  }

  return <ConsultationList status={status} />;
}
```

---

## Database Integration

### In db.ts

```typescript
// db.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { ConsultationStatus, ConsultationStatusDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),

  // ✅ CORRECT - text() with enum constraint
  status: text("status", { enum: ConsultationStatusDB })
    .notNull()
    .default(ConsultationStatus.PENDING), // Use enum value for default

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas
export const insertConsultationSchema = createInsertSchema(consultations);
export const selectConsultationSchema = createSelectSchema(consultations);

// Types
export type Consultation = z.infer<typeof selectConsultationSchema>;
export type NewConsultation = z.infer<typeof insertConsultationSchema>;
```

**Why text() instead of pgEnum()?**

PostgreSQL enum labels have a 63-byte limit. Translation keys like `app.api.consultation.enums.consultationStatus.pending` exceed this. Using `text()` with `{ enum: EnumDB }` provides the same type safety while avoiding the database limitation.

### Anti-Pattern: pgEnum

```typescript
// ❌ WRONG - Don't use pgEnum
import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ConsultationStatusDB); // NO!

export const consultations = pgTable("consultations", {
  status: statusEnum("status"), // NO!
});

// ✅ CORRECT - Use text() with enum constraint
export const consultations = pgTable("consultations", {
  status: text("status", { enum: ConsultationStatusDB })
    .notNull()
    .default(ConsultationStatus.PENDING),
});
```

---

## Anti-Patterns

### ❌ FORBIDDEN Patterns

```typescript
// ❌ Regular TypeScript enum
enum Status {
  PENDING = "pending",
  COMPLETED = "completed",
}

// ❌ Hardcoded string arrays
const statusOptions = ["pending", "completed", "cancelled"];

// ❌ String literal types
type Status = "pending" | "completed";

// ❌ Hardcoded string comparisons
if (status === "pending") {
}

// ❌ Hardcoded options in fields
Field.Enum(["option1", "option2", "option3"]);

// ❌ Schema imports
import { GenderSchema } from "./enum";
z.object({ gender: GenderSchema });

// ❌ Object.values() for DB arrays
export const StatusDB = Object.values(Status);

// ❌ Hardcoded defaults in database
status: text("status").default("pending");

// ❌ pgEnum usage
export const statusEnum = pgEnum("status", StatusDB);
```

### ✅ CORRECT Patterns

```typescript
// ✅ createEnumOptions
import { Status, StatusOptions, StatusValue } from "./enum";

// ✅ Enum value comparisons
if (status === Status.PENDING) {
}

// ✅ Options for UI
Field.Enum(StatusOptions);

// ✅ z.enum() for validation
z.enum(Gender);

// ✅ Manual DB arrays
export const StatusDB = [Status.PENDING, Status.COMPLETED] as const;

// ✅ Enum value defaults
status: text("status", { enum: StatusDB }).default(Status.PENDING);

// ✅ text() with enum constraint
status: text("status", { enum: StatusDB });
```

---

## Migration Guide

### Process for Each Violation

**Step 1: Create Translation Keys FIRST**

```typescript
// i18n/en/index.ts
export const translations = {
  enums: {
    theme: {
      light: "Light",
      dark: "Dark",
      auto: "Auto",
    },
  },
};

// i18n/de/index.ts
import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  enums: {
    theme: {
      light: "Hell",
      dark: "Dunkel",
      auto: "Automatisch",
    },
  },
};

// i18n/pl/index.ts
import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  enums: {
    theme: {
      light: "Jasny",
      dark: "Ciemny",
      auto: "Automatyczny",
    },
  },
};
```

**Step 2: Create enum.ts**

```typescript
// enum.ts
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export const {
  enum: Theme,
  options: ThemeOptions,
  Value: ThemeValue,
} = createEnumOptions({
  LIGHT: "app.api.user.enums.theme.light",
  DARK: "app.api.user.enums.theme.dark",
  AUTO: "app.api.user.enums.theme.auto",
});

export const ThemeDB = [Theme.LIGHT, Theme.DARK, Theme.AUTO] as const;
```

**Step 3: Replace ALL Hardcoded Usage**

```typescript
// Before
if (theme === "light") {
}
const options = ["light", "dark"];
type Theme = "light" | "dark";

// After
import { Theme, ThemeOptions, ThemeValue } from "./enum";

if (theme === Theme.LIGHT) {
}
const options = ThemeOptions;
type ThemeType = ThemeValue;
```

**Step 4: Update Database Schema**

```typescript
// Before
enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export const themeEnum = pgEnum("theme", ["light", "dark"]);
export const users = pgTable("users", {
  theme: themeEnum("theme").default("light"),
});

// After
import { Theme, ThemeDB } from "./enum";
export const users = pgTable("users", {
  theme: text("theme", { enum: ThemeDB }).notNull().default(Theme.LIGHT),
});
```

**Step 5: Run Vibe Check**

```bash
vibe check src/app/api/[locale]/{domain}/{subdomain}
```

### Common Migrations

#### Convert TypeScript Enum

```typescript
// Before
enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// After
export const {
  enum: UserRole,
  options: UserRoleOptions,
  Value: UserRoleValue,
} = createEnumOptions({
  ADMIN: "app.api.user.enums.userRole.admin",
  USER: "app.api.user.enums.userRole.user",
});

export const UserRoleDB = [UserRole.ADMIN, UserRole.USER] as const;
```

#### Fix Import Statements

```typescript
// Before
import { UserRoleValue } from "./definition";
import { StatusSchema } from "./enum";

// After
import { UserRole, UserRoleValue } from "./enum";
import { Status } from "./enum"; // Import enum object, not schema
```

#### Update Database Defaults

```typescript
// Before
status: text("status").default("pending");
status: pgEnum("status", ["PENDING"]).default("PENDING");

// After
import { Status, StatusDB } from "./enum";
status: text("status", { enum: StatusDB }).default(Status.PENDING);
```

---

## Validation Workflow

### For AI Agents & Automated Validation

#### 1. Initial Vibe Check (MANDATORY)

```bash
vibe check src/app/api/[locale]/{domain}/{subdomain}
```

Fix critical errors before proceeding.

#### 2. Analyze & Find Violations

Search for:

- Hardcoded string arrays: `["pending", "completed"]`
- Manual type definitions: `type Status = "pending" | "completed"`
- Regular TypeScript enums: `enum Status { ... }`
- Hardcoded comparisons: `status === "pending"`
- Missing translation keys

Check:

- `{subdomain}/enum.ts` existence
- `{subdomain}/i18n/en/index.ts` for translations
- All 3 language files (en, de, pl)

#### 3. Create Enums & Fix Violations

**Fix Strategy:**

1. Create translation keys in i18n files FIRST (all 3 languages)
2. Create enum.ts with createEnumOptions pattern
3. Replace ALL hardcoded usage with enum values
4. Update database schemas to use text() with enum constraints
5. Run vibe check after each operation

Document progress: "Created 2 enum files → Added 15 translation keys → Removed 8 hardcoded strings → 0 errors"

#### 4. After EVERY Modification

```bash
vibe check src/app/api/[locale]/{domain}/{subdomain}
```

#### 5. Final Validation (MANDATORY)

```bash
# Must pass with 0 errors
vibe check src/app/api/[locale]/{domain}/{subdomain}
```

**Requirements:**

- ✅ All enums use createEnumOptions
- ✅ All enum values are translation keys
- ✅ No hardcoded strings remain
- ✅ Consistent naming (Enum, EnumOptions, EnumValue, EnumDB)
- ✅ z.enum() used in definitions (not schema exports)
- ✅ Database uses text() with enum constraints (NOT pgEnum)
- ✅ Defaults use enum values (NOT strings)
- ✅ All 3 language files exist with proper typeof

### Scope Restrictions

**NEVER** apply validation to:

- `src/app/api/[locale]/system/unified-interface` - System code

**ONLY** work within:

- `src/app/api/[locale]/*` (excluding unified-interface)
- Work at SUBDOMAIN level only - never entire domains

### Common Errors & Fixes

| Error                                                     | Cause               | Fix                                     |
| --------------------------------------------------------- | ------------------- | --------------------------------------- |
| `Cannot find name 'EnumName'`                             | Missing import      | Add `import { EnumName } from "./enum"` |
| `Type '"custom.key"' is not assignable to TranslationKey` | Translation missing | Add translation to i18n files first     |
| `Property 'VALUE' does not exist`                         | Wrong enum usage    | Check imports and enum structure        |
| `Type 'string' is not assignable to EnumValue`            | Hardcoded string    | Use enum value instead                  |

---

## Quick Checklist

Before committing enum code:

- [ ] All enums created with `createEnumOptions`
- [ ] Translation keys exist in ALL 3 languages (en, de, pl)
- [ ] German/Polish i18n files use `typeof enTranslations`
- [ ] Four exports: `enum`, `options`, `Value`, `DB`
- [ ] Naming follows convention (PascalCase + suffix)
- [ ] No hardcoded strings anywhere
- [ ] No regular TypeScript enums
- [ ] `z.enum(EnumName)` used in definitions
- [ ] Database uses `text()` with `{ enum: EnumDB }`
- [ ] Defaults use enum values (`Enum.VALUE`)
- [ ] NO `pgEnum()` usage
- [ ] `vibe check` passes with 0 errors

---

## See Also

- [Database Patterns](database.md) - Database enum integration
- [Definition Patterns](definition.md) - Using enums in API definitions
