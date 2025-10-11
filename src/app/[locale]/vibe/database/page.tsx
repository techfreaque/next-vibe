"use client";

import {
  ArrowUpDown,
  CheckCircle,
  Database,
  GitBranch,
  Layers,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  schema: `// Define your schema with Drizzle ORM
// src/app/api/[locale]/v1/users/db.ts
import { pgTable, serial, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'guest']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type inference works automatically
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));`,

  migrations: `# Generate migrations from schema changes
$ vibe db:generate
🔍 Analyzing schema changes...
✅ Found 3 changes:
  - Added column: users.avatarUrl
  - Modified column: users.email (added unique constraint)
  - Created table: user_sessions

📝 Generated migration: 0001_add_avatar_and_sessions.sql

# Preview migration SQL
$ vibe db:generate --preview
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL
);

ALTER TABLE users 
  ADD COLUMN avatar_url VARCHAR(255),
  ADD CONSTRAINT users_email_unique UNIQUE(email);

# Run migrations
$ vibe db:migrate
🚀 Running migrations...
  ✅ 0001_add_avatar_and_sessions.sql
  ✅ 0002_add_indexes.sql
  
✅ Database schema updated successfully`,

  seeding: `// Smart seeding system with environment support
// src/app/api/[locale]/v1/users/seeds.ts
import { registerSeed } from "next-vibe/seed";

registerSeed(import.meta.url, {
  // Development seeds - lots of test data
  dev: async ({ db }) => {
    console.log("🌱 Seeding users for development...");
    
    const users = await db.insert(usersTable).values([
      { email: "admin@dev.local", name: "Dev Admin", role: "admin" },
      { email: "user@dev.local", name: "Dev User", role: "user" },
      ...generateTestUsers(100), // Generate 100 test users
    ]).returning();
    
    console.log(\`✅ Seeded \${users.length} users\`);
  },
  
  // Test seeds - minimal data for testing
  test: async ({ db }) => {
    await db.insert(usersTable).values([
      { email: "test@example.com", name: "Test User", role: "user" },
    ]);
  },
  
  // Production seeds - only essential data
  prod: async ({ db }) => {
    const adminExists = await db.select()
      .from(usersTable)
      .where(eq(usersTable.role, "admin"))
      .limit(1);
      
    if (!adminExists.length) {
      await db.insert(usersTable).values([
        { email: process.env.ADMIN_EMAIL!, name: "Admin", role: "admin" },
      ]);
    }
  },
  
  priority: 100, // Higher priority runs first
});`,

  commands: `# Comprehensive database management CLI
# Initialize database (create + migrate + seed)
$ vibe db:init
🚀 Initializing database...
  ✅ Database created
  ✅ Migrations applied (12 files)
  ✅ Seeds executed (dev environment)
  
# Reset database (drop all tables, re-run everything)
$ vibe db:reset
⚠️  This will delete all data. Continue? [y/N] y
🔄 Resetting database...
  ✅ Tables dropped
  ✅ Migrations re-applied
  ✅ Seeds re-executed

# Seed management
$ vibe db:seed
🌱 Running seeds for 'development' environment...
  ✅ Core seeds (priority: 1000)
  ✅ User seeds (priority: 100)
  ✅ Product seeds (priority: 50)
  ✅ Test data seeds (priority: 10)

$ vibe db:seed --env production --only users
🌱 Running only 'users' seeds for production...

# Migration utilities
$ vibe db:migrate:status
┌─────┬────────────────────────────┬─────────────┬────────┐
│ #   │ Migration                  │ Applied     │ Status │
├─────┼────────────────────────────┼─────────────┼────────┤
│ 001 │ initial_schema.sql         │ 2024-01-01  │ ✅     │
│ 002 │ add_user_roles.sql         │ 2024-01-05  │ ✅     │
│ 003 │ create_products.sql        │ -           │ ⏳     │
└─────┴────────────────────────────┴─────────────┴────────┘

$ vibe db:migrate:redo --step 2
🔄 Rolling back 2 migrations...
🚀 Re-applying migrations...`,

  advanced: `# Advanced database features
# Backup before migrations (production)
$ vibe db:migrate --backup
📦 Creating backup: db_backup_2024_01_15_103045.sql
✅ Backup created successfully
🚀 Running migrations...

# Repair broken migrations
$ vibe db:migrate:repair
🔧 Checking migration integrity...
❌ Found issues:
  - Missing migration file: 0003_fix_indexes.sql
  - Checksum mismatch: 0005_add_columns.sql
  
? How to proceed?
  ❯ Skip missing migrations
    Re-sync from source
    Manual fix

# Schema validation
$ vibe db:validate
🔍 Validating database schema...
  ✅ All tables match schema definitions
  ✅ All columns have correct types
  ✅ All constraints are applied
  ✅ All indexes are created
  
✨ Database schema is valid!

# Performance insights
$ vibe db:analyze
📊 Database Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Table Statistics:
  users: 128,453 rows (142 MB)
  posts: 892,123 rows (2.1 GB)
  
Missing Indexes:
  ⚠️ posts.user_id (would improve JOIN performance)
  ⚠️ users.created_at (would improve ORDER BY)
  
Suggested Optimizations:
  - Add composite index on (user_id, created_at)
  - Consider partitioning posts table by date`,

  drizzleStudio: `# Visual database management
$ vibe db:studio
🎨 Starting Drizzle Studio...

  Local:    http://localhost:4983
  Network:  http://192.168.1.100:4983
  
  Press Ctrl+C to stop

Features:
  ✅ Browse all tables visually
  ✅ Edit data with validation
  ✅ Run custom SQL queries
  ✅ Export data as CSV/JSON
  ✅ View relationships
  ✅ Performance metrics`,
};

export default function DatabasePage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("schema");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Database className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Database Management
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Enterprise-grade database management with migrations, seeding, type
          safety, and visual tools. Powered by Drizzle ORM for the best
          TypeScript experience.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Complete Database Lifecycle
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Schema First
              </h3>
              <p className="text-gray-400 text-sm">
                Define schemas in TypeScript with full type inference
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Auto Migrations
              </h3>
              <p className="text-gray-400 text-sm">
                Generate SQL migrations from schema changes automatically
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Smart Seeding
              </h3>
              <p className="text-gray-400 text-sm">
                Environment-aware seeding with priorities and dependencies
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Production Safe
              </h3>
              <p className="text-gray-400 text-sm">
                Backup, rollback, and repair capabilities built-in
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Live Examples</h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("schema")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "schema"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Schema Definition
              </button>
              <button
                onClick={() => setActiveExample("migrations")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "migrations"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Migrations
              </button>
              <button
                onClick={() => setActiveExample("seeding")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "seeding"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Seeding
              </button>
              <button
                onClick={() => setActiveExample("commands")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "commands"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                CLI Commands
              </button>
              <button
                onClick={() => setActiveExample("advanced")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "advanced"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setActiveExample("drizzleStudio")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "drizzleStudio"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Drizzle Studio
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                {codeExamples[activeExample]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Migration Workflow
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">1</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Make Schema Changes
                </h3>
                <p className="text-gray-300 mb-3">
                  Edit your Drizzle schema files - add tables, columns, or
                  modify existing structures.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-400">
                  // Add a new column to users table
                  <br />
                  avatarUrl: varchar('avatar_url', {"{"} length: 500 {"}"})
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">2</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Generate Migration
                </h3>
                <p className="text-gray-300 mb-3">
                  Vibe analyzes changes and generates SQL migration files
                  automatically.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400">
                  $ vibe db:generate
                  <br />✅ Generated: 0001_add_avatar_url.sql
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">3</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Review & Test
                </h3>
                <p className="text-gray-300 mb-3">
                  Preview the SQL, test in development, and ensure data
                  integrity.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-blue-400">
                  $ vibe db:migrate --dry-run
                  <br />
                  [Preview] ALTER TABLE users ADD avatar_url VARCHAR(500);
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">4</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Deploy to Production
                </h3>
                <p className="text-gray-300 mb-3">
                  Apply migrations with confidence - automatic backups and
                  rollback support included.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-yellow-400">
                  $ vibe db:migrate --env production --backup
                  <br />
                  📦 Backup created
                  <br />✅ Migration applied successfully
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <ArrowUpDown className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Bidirectional Migrations
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Every migration can be rolled back safely. The system tracks
              migration state and supports redo operations for testing changes.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              $ vibe db:migrate:down --step 3<br />$ vibe db:migrate:up
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Lightning Fast
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Optimized for speed with parallel operations, intelligent caching,
              and minimal overhead. Seeds and migrations run concurrently when
              safe.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm text-green-400">
              ⚡ 10,000 records seeded in 0.8s
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Type-Safe Queries
              </h3>
            </div>
            <p className="text-gray-300">
              Full TypeScript support with Drizzle ORM:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Compile-time query validation</li>
              <li>• Auto-completion for all fields</li>
              <li>• Type-safe joins and relations</li>
              <li>• No runtime overhead</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Database className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Multi-Database Support
              </h3>
            </div>
            <p className="text-gray-300">
              Works with multiple database systems:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• PostgreSQL (primary)</li>
              <li>• MySQL/MariaDB</li>
              <li>• SQLite</li>
              <li>• Turso (edge-ready)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Schema Visualization
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-gray-300 mb-6">
            Your database schema is the single source of truth - everything else
            is derived from it:
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Schema Definition
              </h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-purple-400">// users.db.ts</div>
                <div className="text-gray-300">
                  <div className="mt-2">
                    export const users = pgTable('users', {"{"}
                  </div>
                  <div className="ml-4">id: serial('id').primaryKey(),</div>
                  <div className="ml-4">
                    email: varchar('email').notNull().unique(),
                  </div>
                  <div className="ml-4">
                    role: userRoleEnum('role').notNull(),
                  </div>
                  <div className="ml-4">
                    createdAt: timestamp('created_at').defaultNow()
                  </div>
                  <div>{"}"});</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Auto-Generated
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm mb-1">
                    ✓ TypeScript Types
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    type User = InferSelectModel&lt;typeof users&gt;
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm mb-1">
                    ✓ Zod Schemas
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    const userSchema = createSelectSchema(users)
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm mb-1">
                    ✓ SQL Migrations
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    CREATE TABLE users (id SERIAL PRIMARY KEY...)
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm mb-1">✓ API Types</div>
                  <div className="text-gray-400 font-mono text-xs">
                    interface UserResponse extends User {"{}"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Environment-Aware Seeding
          </h2>
          <p className="text-gray-300 mb-6">
            Seeds adapt to your environment automatically. Development gets rich
            test data, testing gets minimal fixtures, and production gets only
            essential records.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-white font-medium">Development</div>
              <div className="text-gray-400 text-sm">Rich test data</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🧪</div>
              <div className="text-white font-medium">Testing</div>
              <div className="text-gray-400 text-sm">Minimal fixtures</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🏭</div>
              <div className="text-white font-medium">Production</div>
              <div className="text-gray-400 text-sm">Essential only</div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Database Done Right
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From schema design to production deployment, Vibe's database system
          gives you the tools and confidence to manage data at any scale.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">$ vibe db:init</div>
          <div className="text-gray-500 mt-1">
            # Your database, ready in seconds
          </div>
        </div>
      </section>
    </main>
  );
}
