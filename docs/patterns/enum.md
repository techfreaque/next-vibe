# Enum Patterns

> **Part of NextVibe Framework** (GPL-3.0) - Type-safe enums with scoped i18n translation keys

**Golden Rule: All enums use `createEnumOptions(scopedTranslation, {...})`, export `enum`/`options`/`Value`/`DB`, use short scoped translation keys, and use `text()` with enum constraint in Drizzle (never `pgEnum`).**

---

## Complete Pattern

```typescript
// enum.ts
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n"; // value import (not type-only)

export const {
  enum: ConsultationStatus,
  options: ConsultationStatusOptions,
  Value: ConsultationStatusValue,
} = createEnumOptions(scopedTranslation, {
  // ← pass scopedTranslation as first arg (validates keys at compile time)
  PENDING: "enums.consultationStatus.pending", // SHORT scoped key
  SCHEDULED: "enums.consultationStatus.scheduled",
  COMPLETED: "enums.consultationStatus.completed",
  CANCELLED: "enums.consultationStatus.cancelled",
});

// DB array for Drizzle — manual, explicit, as const
export const ConsultationStatusDB = [
  ConsultationStatus.PENDING,
  ConsultationStatus.SCHEDULED,
  ConsultationStatus.COMPLETED,
  ConsultationStatus.CANCELLED,
] as const;
```

**Passing `scopedTranslation` as first argument** validates that every enum label string is a valid key in the module's scoped translation schema at compile time.

---

## Required Exports

Every enum exports exactly 4 things:

| Export    | Purpose                   | Example                      |
| --------- | ------------------------- | ---------------------------- |
| `enum`    | Value comparisons         | `ConsultationStatus.PENDING` |
| `options` | UI dropdowns/selects      | `ConsultationStatusOptions`  |
| `Value`   | TypeScript type           | `ConsultationStatusValue`    |
| `DB`      | Drizzle text() constraint | `ConsultationStatusDB`       |

---

## Translation Keys

Keys are SHORT and scoped — always `"enums.{enumName}.{value}"`:

```typescript
// ✅ CORRECT — short scoped key
"enums.consultationStatus.pending";
"enums.leadStatus.new";
"enums.userRole.admin";

// ❌ WRONG — old global format, never use
"app.api.consultation.enums.consultationStatus.pending";
```

Translations must exist in all 3 languages BEFORE creating the enum:

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

// i18n/pl/index.ts — same pattern with typeof enTranslations
```

---

## Database Integration

Use `text()` with enum constraint — **never `pgEnum`** (translation keys exceed PostgreSQL's 63-byte label limit):

```typescript
// db.ts
import { ConsultationStatus, ConsultationStatusDB } from "./enum";

export const consultations = pgTable("consultations", {
  // ✅ text() with enum constraint
  status: text("status", { enum: ConsultationStatusDB })
    .notNull()
    .default(ConsultationStatus.PENDING),
});

// ❌ NEVER pgEnum
// export const statusEnum = pgEnum("status", ConsultationStatusDB);
```

---

## Usage

```typescript
// In definition.ts — use Options for fields, z.enum() for validation
import { ConsultationStatus, ConsultationStatusOptions } from "./enum";

status: requestField({
  options: ConsultationStatusOptions,  // ← for UI
  // ...
}, z.enum(ConsultationStatus).optional()),

// In examples — use enum values
status: ConsultationStatus.PENDING,

// In repository.ts — use Value type, enum values for comparisons
import { ConsultationStatus, ConsultationStatusValue } from "./enum";

async function getByStatus(status: ConsultationStatusValue) {
  return db.select().from(consultations).where(eq(consultations.status, status));
}

await db.update(consultations).set({ status: ConsultationStatus.COMPLETED });
```

---

## Anti-Patterns

```typescript
// ❌ Missing scopedTranslation — TypeScript can't validate keys
createEnumOptions({ ACTIVE: "enums.status.active" });
// ✅
createEnumOptions(scopedTranslation, { ACTIVE: "enums.status.active" });

// ❌ Old global key format
PENDING: "app.api.module.enums.status.pending";
// ✅ Short scoped key
PENDING: "enums.status.pending";

// ❌ Regular TS enum
enum Status {
  PENDING = "pending",
}
// ✅ createEnumOptions

// ❌ Hardcoded strings
if (status === "pending") {
}
// ✅ Enum values
if (status === Status.PENDING) {
}

// ❌ pgEnum
pgEnum("status", StatusDB);
// ✅ text() with enum constraint
text("status", { enum: StatusDB });

// ❌ Object.values() for DB arrays
export const StatusDB = Object.values(Status);
// ✅ Explicit manual array
export const StatusDB = [Status.PENDING, Status.ACTIVE] as const;
```

---

## Migration Steps

1. **Create translations first** — add `enums.{name}.{value}` keys to en/de/pl `index.ts`
2. **Create enum** with `createEnumOptions<ModuleTranslationKey>({...})`
3. **Export DB array** manually with `as const`
4. **Replace all usage** — hardcoded strings → enum values, string arrays → Options
5. **Update db.ts** — `pgEnum` → `text("col", { enum: DB })`
6. **Run vibe check** — 0 errors before done

---

## Related Documentation

- [i18n Patterns](i18n.md) - Setting up scoped translations
- [Definition Patterns](definition.md) - Using enums in endpoint definitions
