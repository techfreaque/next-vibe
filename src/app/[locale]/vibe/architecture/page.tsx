"use client";

import {
  Code2,
  Cpu,
  Database,
  FolderTree,
  GitBranch,
  Layers,
  Package,
  Shield,
  Terminal,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  domainStructure: `# Domain-Driven Architecture
src/app/api/[locale]/v1/
├── core/                          # Core system functionality
│   ├── system/                   # Framework infrastructure
│   │   ├── builder/             # Build & bundle tools (Vite + Rollup)
│   │   ├── check/               # Code quality (lint, typecheck, vibe-check)
│   │   │   ├── lint/           # ESLint integration
│   │   │   ├── typecheck/      # TypeScript checking
│   │   │   └── vibe-check/     # Full validation
│   │   ├── cli/                 # CLI system
│   │   │   └── vibe/           # Main CLI tool
│   │   │       ├── endpoints/  # Endpoint execution
│   │   │       ├── renderers/  # Widget renderers
│   │   │       └── ui/         # Interactive UI
│   │   ├── db/                  # Database operations
│   │   │   ├── migrate/        # Migration tools
│   │   │   ├── seed/           # Seeding system
│   │   │   └── ping/           # Health checks
│   │   ├── generators/          # Code generation
│   │   │   ├── endpoints/      # Endpoint discovery
│   │   │   ├── seeds/          # Seed generation
│   │   │   └── trpc/           # tRPC routers
│   │   ├── guard/               # Security sandbox
│   │   │   ├── create/         # Environment creation
│   │   │   └── destroy/        # Cleanup
│   │   ├── release-tool/        # Release automation
│   │   │   ├── bump/           # Version bumping
│   │   │   ├── publish/        # NPM publishing
│   │   │   └── validate/       # Pre-release checks
│   │   ├── server/              # Server management
│   │   └── tasks/               # Task runner
│   ├── user/                    # User management
│   ├── contact/                 # Contact forms
│   └── newsletter/              # Newsletter system
├── business-data/               # Business logic domain
├── consultation/                # Scheduling system
├── template-api/                # Template management
└── agent/                       # AI agent system

# Each endpoint follows this structure:
endpoint-name/
├── definition.ts    # Schema definition
├── repository.ts    # Business logic
├── route.ts        # HTTP handler
├── enum.ts         # Enumerations
└── hooks.ts        # React hooks`,

  endpointPattern: `// Every endpoint follows this exact pattern
// definition.ts - Single source of truth
import { createEndpoint } from "next-vibe";
import { Methods, objectField, requestDataField, responseField } from "next-vibe/types";
import { z } from "zod";

const { POST, GET } = createEndpoint({
  // 1. Method and routing
  method: Methods.POST,
  path: ["v1", "users", "create"],
  
  // 2. Metadata
  title: "users.create.title",
  description: "users.create.description",
  
  // 3. Schema definition with UI hints
  fields: objectField({
    // Request fields
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "users.fields.email",
      placeholder: "user@example.com",
      required: true,
      validation: {
        minLength: 5,
        maxLength: 255,
      }
    }, z.email()),
    
    role: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.SELECT,
      options: UserRoleOptions,
      defaultValue: UserRoleValue.USER,
    }, z.nativeEnum(UserRoleValue)),
    
    // Response fields
    user: responseField({
      type: WidgetType.DATA_CARD,
      title: "users.created.success",
    }, userSchema),
    
    stats: responseField({
      type: WidgetType.METRIC_CARD,
      format: "number",
    }, z.object({
      totalUsers: z.number(),
      activeToday: z.number(),
    })),
  }),
  
  // 4. Security & access control
  allowedRoles: [UserRole.ADMIN],
  rateLimit: { requests: 10, window: 60 },
  
  // 5. CLI configuration
  aliases: ["user:create", "uc"],
  examples: [
    "vibe user:create --email john@example.com",
  ],
  
  // 6. Cache strategy
  cacheStrategy: {
    type: "dynamic",
    ttl: 300, // 5 minutes
    tags: ["users"],
  },
});

export { POST, GET };`,

  repositoryPattern: `// repository.ts - Business logic layer
import { db } from "@/db";
import { users } from "./db";
import { hashPassword } from "@/lib/auth";

export async function POST(input: PostInput): Promise<PostOutput> {
  // Input is fully typed from schema
  const { email, role } = input;
  
  // Transaction support
  return await db.transaction(async (tx) => {
    // Check if user exists
    const existing = await tx.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
      
    if (existing.length > 0) {
      throw new ConflictError("User already exists");
    }
    
    // Create user
    const [user] = await tx.insert(users).values({
      email,
      role,
      passwordHash: await hashPassword(generatePassword()),
      createdAt: new Date(),
    }).returning();
    
    // Get stats
    const stats = await tx.select({
      totalUsers: count(),
      activeToday: count(
        and(
          gte(users.lastLoginAt, startOfDay(new Date()))
        )
      ),
    }).from(users);
    
    // Return typed response
    return {
      user,
      stats: stats[0],
    };
  });
}`,

  routeHandler: `// route.ts - HTTP handler (auto-generated pattern)
import { endpointsHandler } from "next-vibe";
import * as implementation from "./repository";
import * as definition from "./definition";

// This single line creates:
// - Type-safe Next.js route handlers
// - Automatic validation
// - Error handling
// - Auth checks
// - Rate limiting
// - Response transformation
// - OpenAPI documentation
export const { POST, GET } = endpointsHandler(
  definition,
  implementation
);`,

  widgetSystem: `// Widget System - Data-driven UI generation
// The framework includes 30+ widget types

// Form Widgets
WidgetType.FORM_FIELD      // Input fields
WidgetType.FORM_GROUP      // Field groups
WidgetType.FORM_SECTION    // Form sections

// Data Display
WidgetType.DATA_TABLE      // Tables
WidgetType.DATA_CARDS      // Card grid
WidgetType.DATA_LIST       // Lists
WidgetType.GROUPED_LIST    // Grouped data

// Layout
WidgetType.CONTAINER       // Container
WidgetType.TABS           // Tabbed view
WidgetType.ACCORDION      // Collapsible

// Content
WidgetType.TEXT           // Text blocks
WidgetType.METRIC_CARD    // Metrics
WidgetType.CODE_OUTPUT    // Code/logs

// Each widget has a renderer for each platform:
// - CLI (ASCII art, colors, interactive)
// - Web (React components)
// - Mobile (React Native)
// - AI (Structured data)

// Example: Table widget renders as:
// CLI:    ASCII table with borders
// Web:    <DataTable /> React component
// Mobile: <FlatList /> with headers
// AI:     Structured JSON data`,

  cliRendering: `// CLI Rendering System
// Automatic UI generation from schemas

$ vibe user:create

🚀 Create User
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email Address *
   > user@example.com
   
📋 User Role
   ◉ Admin
   ○ User
   ○ Guest
   
[Cancel]              [Create User →]

// The CLI renderer:
// 1. Reads endpoint schema
// 2. Generates interactive forms
// 3. Validates input in real-time
// 4. Shows progress indicators
// 5. Displays formatted results

// Widget renderers use:
- chalk for colors
- inquirer for prompts
- cli-table3 for tables
- ora for spinners
- boxen for boxes`,

  typeSystem: `// Advanced Type System
// Complete type preservation through the chain

// 1. Schema types flow through the system
type InferSchemaFromField<
  F extends AnyEndpointField,
  Usage extends FieldUsage
> = F extends PrimitiveField<infer S, any, any>
  ? S  // Zod schema preserved
  : F extends ObjectField<infer Fields, any, any>
  ? InferSchemaFromFields<Fields, Usage>
  : F extends ArrayField<infer Item, any, any>
  ? z.array(InferSchemaFromField<Item, Usage>)
  : never;

// 2. Input/Output extraction
type ExtractInput<T> = T extends z.ZodType<
  infer O, infer Z, infer I
> ? I : never;

type ExtractOutput<T> = T extends z.ZodType<
  infer O, infer Z, infer I
> ? O : never;

// 3. Widget configuration preservation
interface ResponseFieldMetadata {
  fieldType: FieldDataType;
  widgetType: WidgetType;
  widgetConfig: WidgetConfigMap[WidgetType];
  validation?: ValidationConfig;
  fieldPath: string[];
  // ... maintains all UI hints
}

// This enables:
// - Full IntelliSense support
// - Compile-time validation
// - Type-safe API clients
// - Auto-generated documentation`,

  security: `// Security Architecture

// 1. Authentication (JWT-based)
interface AuthContext {
  user: User;
  roles: UserRole[];
  permissions: Permission[];
  sessionId: string;
}

// 2. Authorization (Role-based)
const endpoint = createEndpoint({
  allowedRoles: [UserRole.ADMIN],
  permissions: ["users.write"],
  
  // Custom auth logic
  authorize: async (context) => {
    if (context.user.department !== "HR") {
      throw new ForbiddenError();
    }
  },
});

// 3. Input Validation (Zod schemas)
// - Automatic sanitization
// - Type coercion
// - Custom validators
// - Error messages

// 4. SQL Injection Protection
// - Drizzle ORM parameterized queries
// - No raw SQL execution
// - Query builder validation

// 5. Rate Limiting
rateLimit: {
  requests: 100,
  window: 3600, // 1 hour
  by: "user", // or "ip"
}

// 6. Vibe Guard Sandboxing
// - Isolated execution environments
// - Resource limits
// - File system restrictions
// - Network isolation`,

  performance: `// Performance Architecture

// 1. Caching System
cacheStrategy: {
  type: "static" | "dynamic",
  ttl: 300, // seconds
  tags: ["users", "admin"],
  invalidateOn: ["user.created", "user.updated"],
  storage: "memory" | "redis",
}

// 2. Database Optimization
// - Connection pooling
// - Query optimization
// - Indexed fields
// - Pagination support
// - Cursor-based iteration

// 3. Route Discovery
// Build-time endpoint indexing
// Zero runtime discovery cost
// Optimized imports

// 4. Bundle Optimization
// - Tree shaking
// - Code splitting
// - Lazy loading
// - Minification
// - Compression

// 5. Monitoring
interface PerformanceMetrics {
  responseTime: Histogram;
  throughput: Counter;
  errorRate: Gauge;
  dbQueryTime: Histogram;
  cacheHitRate: Gauge;
}

// 6. Streaming Support
// - Server-sent events
// - WebSocket connections
// - Chunked responses
// - Backpressure handling`,
};

export default function ArchitecturePage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("domainStructure");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Layers className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Vibe Architecture Deep Dive
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          A production-ready, schema-driven framework that unifies API
          development across REST, tRPC, and CLI interfaces with complete type
          safety and data-driven UI generation.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Core Architecture Principles
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code2 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Schema-Driven
              </h3>
              <p className="text-gray-400 text-sm">
                Single source of truth using Zod schemas for validation, types,
                and UI
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multi-Interface
              </h3>
              <p className="text-gray-400 text-sm">
                One endpoint serves REST API, tRPC, CLI, and generates UI
                automatically
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Type-Safe
              </h3>
              <p className="text-gray-400 text-sm">
                End-to-end type safety from database to UI with zero runtime
                overhead
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Production-Ready
              </h3>
              <p className="text-gray-400 text-sm">
                Built-in auth, caching, monitoring, and performance optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Architecture Deep Dive
        </h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("domainStructure")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "domainStructure"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Domain Structure
              </button>
              <button
                onClick={() => setActiveExample("endpointPattern")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "endpointPattern"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Endpoint Pattern
              </button>
              <button
                onClick={() => setActiveExample("repositoryPattern")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "repositoryPattern"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Repository
              </button>
              <button
                onClick={() => setActiveExample("routeHandler")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "routeHandler"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Route Handler
              </button>
              <button
                onClick={() => setActiveExample("widgetSystem")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "widgetSystem"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Widget System
              </button>
              <button
                onClick={() => setActiveExample("cliRendering")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "cliRendering"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                CLI Rendering
              </button>
              <button
                onClick={() => setActiveExample("typeSystem")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "typeSystem"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Type System
              </button>
              <button
                onClick={() => setActiveExample("security")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "security"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveExample("performance")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "performance"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Performance
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
          System Architecture Flow
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">1</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Define Endpoint Schema
                </h3>
                <p className="text-gray-300 mb-3">
                  Create a single definition with Zod schemas, widget types, and
                  metadata. This becomes the source of truth for validation,
                  types, and UI generation.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-400">
                  definition.ts → Schema + UI Config + Validation Rules
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">2</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Implement Business Logic
                </h3>
                <p className="text-gray-300 mb-3">
                  Write repository functions with full type safety. Input and
                  output types are inferred from the schema automatically.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-400">
                  repository.ts → Database Operations + Business Rules
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">3</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Auto-Generate Interfaces
                </h3>
                <p className="text-gray-300 mb-3">
                  The framework automatically generates REST routes, tRPC
                  procedures, CLI commands, and React hooks from your
                  definition.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-400">
                  route.ts → HTTP + tRPC + CLI + Hooks
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">4</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Render Everywhere
                </h3>
                <p className="text-gray-300 mb-3">
                  Widget system automatically renders appropriate UI for each
                  platform - ASCII tables in CLI, React components on web,
                  native components on mobile.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-400">
                  Widgets → CLI + Web + Mobile + AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Core System Components
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Vibe CLI</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Production-ready CLI that can execute any API endpoint
              interactively. Features include:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Auto-generated from schemas</li>
              <li>• Interactive forms with validation</li>
              <li>• Rich output formatting</li>
              <li>• Performance monitoring</li>
              <li>• Command aliases and shortcuts</li>
              <li>• Built-in help and examples</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Builder System
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              All-in-one build tool based on Vite and Rollup with zero
              configuration:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• TypeScript, React, Tailwind</li>
              <li>• Automatic optimization</li>
              <li>• Tree shaking & minification</li>
              <li>• Multiple output formats</li>
              <li>• Watch mode for development</li>
              <li>• Source maps generation</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Vibe Guard</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Security sandbox for safe code execution in development:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Isolated environments</li>
              <li>• Resource limits</li>
              <li>• File system restrictions</li>
              <li>• Network isolation</li>
              <li>• Git protection</li>
              <li>• AI agent safety</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Release Tool</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Automated release orchestration for monorepos:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Version bumping</li>
              <li>• Dependency updates</li>
              <li>• Pre-release validation</li>
              <li>• NPM publishing</li>
              <li>• Changelog generation</li>
              <li>• Git tagging</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why This Architecture?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Developer Experience
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Single source of truth</li>
                <li>✓ Full type inference</li>
                <li>✓ No boilerplate code</li>
                <li>✓ Instant feedback</li>
                <li>✓ Self-documenting</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Production Benefits
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Consistent patterns</li>
                <li>✓ Built-in security</li>
                <li>✓ Performance optimized</li>
                <li>✓ Easy to maintain</li>
                <li>✓ Scales with team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Architecture That Scales
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From startup MVP to enterprise scale, Vibe's architecture grows with
          you. Every decision is optimized for developer productivity without
          sacrificing production performance.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">
            $ vibe endpoint:create my-feature
          </div>
          <div className="text-gray-500 mt-1">
            # Your endpoint, ready for production
          </div>
        </div>
      </section>
    </main>
  );
}
