# Database Patterns

> **Part of NextVibe Framework** (GPL-3.0) - Drizzle ORM patterns and database architecture
>
> **For Developers & AI:** Opinionated patterns for database schemas, enums, and migrations

**Golden Rule: Use `db.ts` for database schemas.**

---

## Table of Contents

1. [File Organization](#file-organization)
2. [Database Schema Structure](#database-schema-structure)
3. [Enum Integration](#enum-integration)
4. [Relations](#relations)
5. [Querying Data](#querying-data)
6. [Migration Patterns](#migration-patterns)
7. [Common Patterns](#common-patterns)
8. [Anti-Patterns](#anti-patterns)
9. [Validation Workflow](#validation-workflow)

---

## File Organization

### The Recursive Pattern

**Key Principle:** `db.ts` and `enum.ts` files live **at the level where they're needed**, not necessarily at every folder level.

### Pattern 1: Flat Structure

For simple endpoints without sub-resources:

```
contact/
├── db.ts              # Database tables
├── enum.ts            # Enums
├── definition.ts      # API validation
├── repository.ts      # Database operations
├── route.ts           # Route handler
├── email.tsx          # Email template (if needed)
├── hooks.ts           # Client hooks (if needed)
├── seeds.ts           # Seed data (if needed)
└── i18n/              # Translations
```

**Real Example:** `src/app/api/[locale]/contact/`

### Pattern 2: Hierarchical Structure

For complex domains with sub-resources:

```
leads/
├── db.ts              # Main tables (leads, emailCampaigns, etc.)
├── enum.ts            # Domain-wide enums
├── repository.ts      # Core domain operations
├── seeds.ts
├── list/
│   ├── definition.ts  # List endpoint validation
│   ├── repository.ts  # List-specific queries
│   ├── route.ts
│   └── hooks.ts
├── import/
│   ├── db.ts          # Import-specific tables (if needed)
│   ├── definition.ts
│   ├── repository.ts
│   └── route.ts
└── campaigns/
    └── campaign-starter/
        └── campaign-starter-config/
            ├── db.ts   # Campaign config tables
            └── ...
```

**Real Example:** `src/app/api/[locale]/leads/`

### Pattern 3: Nested Schemas

For sub-resources with their own database concerns:

```
chat/
├── db.ts              # Chat tables (folders, threads, messages)
├── enum.ts            # Chat enums
├── repository.ts
├── skills/
│   ├── db.ts          # Custom skills table (separate concern)
│   ├── definition.ts
│   ├── repository.ts
│   └── route.ts
├── threads/
│   ├── definition.ts  # No db.ts - uses parent chat/db.ts
│   ├── repository.ts
│   └── [threadId]/
│       └── permissions/
│           ├── definition.ts
│           ├── repository.ts
│           └── route.ts
└── folders/
    └── [id]/
        └── permissions/
            └── ...
```

**Real Example:** `src/app/api/[locale]/agent/chat/`

**Decision Guide:**

- Need new database tables? → Create `db.ts` at that level
- Reusing parent tables? → No `db.ts` needed, import from parent
- Need domain-specific enums? → Create `enum.ts` at that level
- Reusing parent enums? → Import from parent `enum.ts`

### File Responsibilities

**db.ts (Database Layer):**

- Drizzle table definitions (`pgTable`)
- Text columns with enum constraints (NOT `pgEnum`)
- Zod insert/select schemas (`createInsertSchema`, `createSelectSchema`)
- Table relations (`relations`)
- Database-specific types and exports
- Type interfaces for JSONB columns

**enum.ts (Enum Definitions):**

- Application enums using `createEnumOptions`
- Database enum arrays (`EnumNameDB` as const arrays)
- Export enum objects, options, values, and DB arrays

**definition.ts (API Validation):**

- Request/response schemas using field functions
- API-level validation logic
- NO database schemas

**repository.ts (Data Access):**

- Database operations (queries, mutations)
- Business logic
- Imports tables from `db.ts`

---

## Database Schema Structure

### Basic Table Definition

```typescript
/**
 * Leads Database Schema
 * Drizzle ORM schema definitions for lead management
 */

import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

// Import types and enums
import { users } from "../user/db";
import { LeadStatus, LeadStatusDB, LeadSourceDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name"),

  // Enum fields - use text() with enum constraint
  status: text("status", { enum: LeadStatusDB })
    .notNull()
    .default(LeadStatus.NEW),
  source: text("source", { enum: LeadSourceDB }),

  // Foreign key
  convertedUserId: uuid("converted_user_id").references(() => users.id),

  // Metadata
  metadata: jsonb("metadata")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),

  // Timestamps (always include these)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const selectLeadSchema = createSelectSchema(leads);
export const insertLeadSchema = createInsertSchema(leads);

// Types
export type Lead = z.infer<typeof selectLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
```

**Key Points:**

- Always use `text("field", { enum: EnumDB })` for enum fields
- Never use `pgEnum()` - translation keys exceed PostgreSQL's 63-byte limit
- Always include `createdAt` and `updatedAt` timestamps
- Use `createInsertSchema` and `createSelectSchema` for Zod schemas
- Export both schema types (`Select*` and `Insert*`)

### Column Types Reference

```typescript
// Common imports
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// UUID primary key (standard pattern)
id: uuid("id").primaryKey().defaultRandom();

// Text columns
name: text("name").notNull();
description: text("description"); // nullable

// Varchar with length
email: varchar("email", { length: 255 }).notNull().unique();

// Integer
count: integer("count").default(0);
emailsSent: integer("emails_sent").notNull().default(0);

// Boolean
isActive: boolean("is_active").default(true);
published: boolean("published").default(false).notNull();

// JSONB (typed)
metadata: jsonb("metadata").$type<Record<string, unknown>>().default({});

// Timestamps
createdAt: timestamp("created_at").defaultNow().notNull();
updatedAt: timestamp("updated_at").defaultNow().notNull();
deletedAt: timestamp("deleted_at"); // soft delete

// Enum (text with constraint)
status: text("status", { enum: StatusDB }).notNull().default(Status.ACTIVE);

// Foreign key
userId: uuid("user_id")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" });

// Self-referencing foreign key (requires AnyPgColumn)
parentId: uuid("parent_id").references((): AnyPgColumn => chatFolders.id, {
  onDelete: "cascade",
});
```

### JSONB Type Safety

```typescript
// Define interface for JSONB structure
interface ThreadMetadata {
  temperature?: number;
  maxTokens?: number;
  customSettings?: {
    key: string;
    value: string | number | boolean;
  }[];
}

// Use in table definition
metadata: jsonb("metadata").$type<ThreadMetadata>().default({});
```

---

## Enum Integration

### Step 1: Define Enum in enum.ts

```typescript
// enum.ts
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

/**
 * Lead Status Enum
 * Defines the possible states of a lead
 */
export const {
  enum: LeadStatus,
  options: LeadStatusOptions,
  Value: LeadStatusValue,
} = createEnumOptions(scopedTranslation, {
  // ← pass scopedTranslation, use short scoped keys
  NEW: "enums.leadStatus.new",
  PENDING: "enums.leadStatus.pending",
  CAMPAIGN_RUNNING: "enums.leadStatus.campaignRunning",
  SIGNED_UP: "enums.leadStatus.signedUp",
  BOUNCED: "enums.leadStatus.bounced",
  INVALID: "enums.leadStatus.invalid",
});

/**
 * Database enum array for Drizzle — explicit, as const
 */
export const LeadStatusDB = [
  LeadStatus.NEW,
  LeadStatus.PENDING,
  LeadStatus.CAMPAIGN_RUNNING,
  LeadStatus.SIGNED_UP,
  LeadStatus.BOUNCED,
  LeadStatus.INVALID,
] as const;
```

### Step 2: Use in db.ts

```typescript
// db.ts
import { LeadStatus, LeadStatusDB } from "./enum";

// Use text() with enum constraint - NOT pgEnum()
export const leads = pgTable("leads", {
  status: text("status", { enum: LeadStatusDB })
    .notNull()
    .default(LeadStatus.NEW),
});
```

**Why text() instead of pgEnum()?**

PostgreSQL enum labels have a 63-byte limit. Our enum values are the scoped translation keys (e.g. `"enums.leadStatus.campaignRunning"`) which can exceed this limit. Using `text()` with `{ enum: EnumDB }` provides the same type safety through Drizzle's validation while avoiding the database limitation.

---

## Relations

### One-to-Many Relations

```typescript
import { relations } from "drizzle-orm";

export const leadsRelations = relations(leads, ({ one, many }) => ({
  convertedUser: one(users, {
    fields: [leads.convertedUserId],
    references: [users.id],
  }),
  emailCampaigns: many(emailCampaigns),
  engagements: many(leadEngagements),
}));

export const emailCampaignsRelations = relations(emailCampaigns, ({ one }) => ({
  lead: one(leads, {
    fields: [emailCampaigns.leadId],
    references: [leads.id],
  }),
}));
```

### Self-Referencing Relations

```typescript
export const chatFoldersRelations = relations(chatFolders, ({ one, many }) => ({
  parent: one(chatFolders, {
    fields: [chatFolders.parentId],
    references: [chatFolders.id],
    relationName: "folderHierarchy", // Required for self-reference
  }),
  children: many(chatFolders, {
    relationName: "folderHierarchy", // Must match
  }),
}));
```

### Many-to-Many Relations

```typescript
// Junction table
export const usersToGroups = pgTable("users_to_groups", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
});

// Relations
export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));
```

---

## Querying Data

### Standard Query Pattern

Use `db.select().from()` - **NOT** `db.query`:

```typescript
// repository.ts
import { db } from "@/app/api/[locale]/system/db";
import { leads } from "./db";
import { and, desc, eq, gte, lte } from "drizzle-orm";

// Build query
let query = db.select().from(leads);

// Add conditions
const conditions = [];
if (userId) {
  conditions.push(eq(leads.userId, userId));
}
if (status) {
  conditions.push(eq(leads.status, status));
}

if (conditions.length > 0) {
  query = query.where(and(...conditions)) as typeof query;
}

// Add ordering
query = query.orderBy(desc(leads.createdAt));

// Execute
const results = await query;
```

### Insert Operations

```typescript
import { db } from "@/app/api/[locale]/system/db";
import { leads } from "./db";

// Single insert
await db.insert(leads).values({
  email: "test@example.com",
  businessName: "Test Co",
  status: LeadStatus.NEW,
});

// Multiple inserts
await db.insert(leads).values([
  { email: "test1@example.com", businessName: "Test 1" },
  { email: "test2@example.com", businessName: "Test 2" },
]);

// Insert with returning
const [newLead] = await db
  .insert(leads)
  .values({ email: "test@example.com", businessName: "Test" })
  .returning();
```

### Update Operations

```typescript
// Update with where clause
await db
  .update(leads)
  .set({ status: LeadStatus.SIGNED_UP, updatedAt: new Date() })
  .where(eq(leads.id, leadId));
```

### Delete Operations

```typescript
// Hard delete
await db.delete(leads).where(eq(leads.id, leadId));

// Soft delete (preferred)
await db
  .update(leads)
  .set({ deletedAt: new Date() })
  .where(eq(leads.id, leadId));
```

---

## Migration Patterns

### Creating Migrations

```bash
# Generate migration from schema changes
vibe db:generate

# Apply migrations
vibe db:migrate
```

### Migration File Structure

Migrations are auto-generated in `drizzle/` directory:

```sql
-- Example: drizzle/0001_add_leads_table.sql
CREATE TABLE IF NOT EXISTS "leads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text UNIQUE,
  "business_name" text NOT NULL,
  "status" text NOT NULL DEFAULT 'app.api.leads.enums.leadStatus.new',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

---

## Common Patterns

### Timestamps Pattern

Always include these on every table:

```typescript
createdAt: timestamp("created_at").defaultNow().notNull(),
updatedAt: timestamp("updated_at").defaultNow().notNull(),
```

### Soft Delete Pattern

```typescript
deletedAt: (timestamp("deleted_at"),
  // In queries - filter out deleted records
  (query = query.where(isNull(leads.deletedAt))));
```

### Indexes Pattern

```typescript
import { index, uniqueIndex } from "drizzle-orm/pg-core";

export const chatFolders = pgTable(
  "chat_folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    rootFolderId: text("root_folder_id").notNull(),
    rolesView: jsonb("roles_view").$type<string[]>(),
  },
  (table) => ({
    // Regular indexes
    userIdIdx: index("chat_folders_user_id_idx").on(table.userId),
    rootFolderIdIdx: index("chat_folders_root_folder_id_idx").on(
      table.rootFolderId,
    ),

    // Unique indexes
    emailIdx: uniqueIndex("users_email_idx").on(table.email),

    // GIN indexes for JSONB array containment queries
    rolesViewIdx: index("chat_folders_roles_view_idx").using(
      "gin",
      table.rolesView,
    ),
  }),
);
```

### Foreign Keys Pattern

```typescript
// Cascade delete (child deleted when parent deleted)
leadId: uuid("lead_id")
  .notNull()
  .references(() => leads.id, { onDelete: "cascade" }),

// Set null (reference cleared when parent deleted)
folderId: uuid("folder_id").references(() => chatFolders.id, {
  onDelete: "set null",
}),

// Restrict (prevent parent deletion if children exist)
organizationId: uuid("organization_id")
  .notNull()
  .references(() => organizations.id, { onDelete: "restrict" }),
```

---

## Anti-Patterns

### ❌ Don't Create schema.ts Files

```typescript
// ❌ WRONG - Deprecated pattern
// schema.ts
export const leads = pgTable("leads", {...});

// ✅ CORRECT - Use db.ts
// db.ts
export const leads = pgTable("leads", {...});
```

### ❌ Don't Use pgEnum()

```typescript
// ❌ WRONG - Exceeds PostgreSQL 63-byte limit
export const statusEnum = pgEnum("status", [
  "app.api.leads.enums.status.new",
  "app.api.leads.enums.status.pending",
]);

// ✅ CORRECT - Use text() with enum constraint
import { LeadStatus, LeadStatusDB } from "./enum";

export const leads = pgTable("leads", {
  status: text("status", { enum: LeadStatusDB })
    .notNull()
    .default(LeadStatus.NEW),
});
```

### ❌ Don't Use Hardcoded Enum Arrays

```typescript
// ❌ WRONG
status: text("status", { enum: ["NEW", "PENDING"] });

// ✅ CORRECT - Import from enum.ts
import { LeadStatusDB } from "./enum";
status: text("status", { enum: LeadStatusDB });
```

### ❌ Don't Mix Database and API Schemas

```typescript
// ❌ WRONG - API validation in db.ts
// db.ts
export const createLeadSchema = z.object({
  email: z.string().email(),
  businessName: z.string().min(1),
});

// ✅ CORRECT - API validation in definition.ts, database schemas in db.ts
// db.ts - only Drizzle schemas
export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);

// definition.ts - API validation
export const createLeadRequest = objectField({
  email: textField({ ... }),
  businessName: textField({ ... }),
});
```

### ❌ Don't Use db.query Pattern

```typescript
// ❌ WRONG
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});

// ✅ CORRECT - Use query builder
const [user] = await db.select().from(users).where(eq(users.id, userId));
```

---

## Quick Checklist

Before committing database code:

- [ ] All database code in `db.ts` files at appropriate level
- [ ] No `schema.ts` files (deprecated)
- [ ] Enums use `text("field", { enum: EnumDB })` - NOT `pgEnum()`
- [ ] EnumDB arrays exported from `enum.ts` as const
- [ ] Tables have `createInsertSchema`/`createSelectSchema`
- [ ] Types exported (Select*and Insert*)
- [ ] Relations defined when needed
- [ ] Timestamps (`createdAt`, `updatedAt`) included
- [ ] Foreign keys have proper `onDelete` actions
- [ ] No API validation in database files
- [ ] JSONB fields are typed with `.$type<T>()`
- [ ] Indexes added for commonly queried fields
- [ ] Queries use `db.select().from()` pattern
- [ ] `vibe check` passes with 0 errors

---

## See Also

- [Enum Patterns](enum.md) - Enum integration with database
- [Repository Patterns](repository.md) - Database operations in repositories
