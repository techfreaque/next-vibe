"use client";

import {
  AlertCircle,
  CheckCircle,
  GitBranch,
  RefreshCw,
  Rocket,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  vibeCheck: `# Run comprehensive checks on your codebase
$ vibe check

🚀 Vibe Check - Development Quality Assurance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Running lint check...
✅ Lint check passed (0 errors, 0 warnings)

⏳ Running type check...
✅ Type check passed
  - 1,247 files checked
  - 0 errors found

⏳ Validating routes...
✅ Route validation passed
  - 89 API routes validated
  - All follow framework patterns

⏳ Checking TRPC procedures...
✅ TRPC validation passed
  - All procedures correctly generated

⏳ Running tests...
✅ All tests passed
  - 156 tests run
  - 100% coverage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ All checks passed! Your code is production ready.`,

  autoFix: `# Automatically fix issues
$ vibe check --fix

🚀 Vibe Check with Auto-Fix
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Running lint check...
❌ Found 12 lint issues
🔧 Auto-fixing...
✅ Fixed 12/12 issues

⏳ Running type check...
❌ Found 3 type errors
📍 src/app/api/[locale]/v1/users/repository.ts:45
   Property 'email' is missing in type

📍 src/app/api/[locale]/v1/users/definition.ts:23
   Type 'string' is not assignable to type 'number'

📍 src/app/api/[locale]/v1/users/hooks.ts:12
   Missing return type annotation

💡 Run 'vibe check --fix-types' to add missing types

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary: Fixed 12 issues, 3 require manual intervention`,

  structure: `# Enforce consistent structure
$ vibe check:structure

📁 Validating Project Structure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ API Route Structure
├── ✓ All routes follow [domain]/[feature] pattern
├── ✓ Required files present (definition, repository, route)
├── ✓ Consistent file naming
└── ✓ Proper export patterns

❌ Missing Required Files
├── /api/v1/orders/stats/hooks.ts (missing)
├── /api/v1/payments/db.ts (missing)
└── /api/v1/analytics/enum.ts (missing)

🔧 Run 'vibe generate:missing' to create missing files

✅ Translation Structure
├── ✓ All i18n keys defined
├── ✓ Consistent key naming
└── ✓ No orphaned translations`,

  gitHooks: `# Integrated git hooks
$ git commit -m "Add user authentication"

🚀 Pre-commit Vibe Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Running quick checks...
✅ Lint check passed
✅ Type check passed
✅ Import sorting fixed
✅ Translations validated

⏳ Running security scan...
✅ No secrets detected
✅ No vulnerable dependencies

[main 5a2f3d1] Add user authentication
 5 files changed, 127 insertions(+)`,

  continuous: `# Watch mode for continuous feedback
$ vibe check --watch

👀 Watching for changes...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[12:34:15] File changed: src/api/v1/users/repository.ts
⏳ Running incremental type check...
✅ No errors

[12:34:32] File changed: src/api/v1/users/definition.ts
⏳ Running checks...
❌ Type error: Property 'age' must be number
📍 Line 45: age: z.string() // Should be z.number()

[12:34:45] File changed: src/api/v1/users/definition.ts
⏳ Running checks...
✅ All checks passed

[12:35:01] Running full check (30s interval)...
✅ 1,247 files checked
✅ 0 errors, 0 warnings`,

  integration: `# Deep framework integration
// Every endpoint automatically validated
const userEndpoint = createEndpoint({
  // Type-checked at build time
  method: Methods.POST,
  path: ["v1", "users", "create"],
  
  // Schema validation
  fields: objectField({
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
    }, z.email()),
  }),
});

// Hooks with full type inference
const { data, error } = useEndpoint(userEndpoint);
//     ^? User type inferred from schema

// CLI commands type-checked
$ vibe user:create --email "not-an-email"
❌ Validation error: Invalid email format

// Database to UI type chain verified
drizzle schema → zod validation → API types → React props`,
};

export default function DevelopmentLoopPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("vibeCheck");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Rocket className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Vibe Check Development Loop
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Comprehensive code quality assurance that catches everything from
          syntax errors to architectural violations, keeping your codebase
          pristine.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            One Command, Complete Confidence
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Lint Check
              </h3>
              <p className="text-gray-400 text-sm">
                ESLint with auto-fix for code style consistency
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Type Check
              </h3>
              <p className="text-gray-400 text-sm">
                Full TypeScript validation across the codebase
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Structure
              </h3>
              <p className="text-gray-400 text-sm">
                Validates framework patterns and conventions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Security
              </h3>
              <p className="text-gray-400 text-sm">
                Scans for secrets and vulnerabilities
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
                onClick={() => setActiveExample("vibeCheck")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "vibeCheck"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Basic Check
              </button>
              <button
                onClick={() => setActiveExample("autoFix")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "autoFix"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Auto Fix
              </button>
              <button
                onClick={() => setActiveExample("structure")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "structure"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Structure Check
              </button>
              <button
                onClick={() => setActiveExample("gitHooks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "gitHooks"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Git Integration
              </button>
              <button
                onClick={() => setActiveExample("continuous")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "continuous"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Watch Mode
              </button>
              <button
                onClick={() => setActiveExample("integration")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "integration"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Deep Integration
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
          Development Workflow Visualization
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Complete Development Cycle
          </h3>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">1</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Code Changes
                </h4>
                <p className="text-gray-300 mb-3">
                  Developer makes changes to endpoints, schemas, or components
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="text-blue-400 text-sm">definition.ts</div>
                    <div className="text-green-400 text-sm">repository.ts</div>
                    <div className="text-yellow-400 text-sm">component.tsx</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">2</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Automatic Detection
                </h4>
                <p className="text-gray-300 mb-3">
                  File watcher triggers immediate validation checks
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">File changed:</span>
                    <span className="text-blue-400 text-sm">
                      users/definition.ts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-yellow-400 text-sm">
                      Running incremental checks...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">3</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Multi-Layer Validation
                </h4>
                <p className="text-gray-300 mb-3">
                  Comprehensive checks across all layers simultaneously
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          Lint Check
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          Type Check
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                          Schema Validation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-400">
                          Pattern Check
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">4</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Instant Feedback
                </h4>
                <p className="text-gray-300 mb-3">
                  Results displayed in IDE, terminal, and optional desktop
                  notifications
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-red-400 text-sm">
                        3 issues found
                      </span>
                    </div>
                    <div className="text-blue-400 text-sm cursor-pointer hover:underline">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-purple-400 font-bold">5</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Auto-Fix & Guidance
                </h4>
                <p className="text-gray-300 mb-3">
                  Automatic fixes applied where possible, guidance provided for
                  manual fixes
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">
                        Auto-fixed: Import sorting
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">
                        Manual fix needed: Type annotation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">
                Database to UI Chain
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Validates the entire type chain from database schemas through API
              definitions to UI components.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Type Chain Status</span>
                <span className="text-sm text-green-400">✓ Valid</span>
              </div>
              <div className="text-xs font-mono text-gray-400">
                DB → Drizzle → Zod → API → Hooks → Components
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Translation Completeness
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Ensures all i18n keys are defined across all supported languages
              with no orphaned translations.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-green-400 text-lg font-bold">EN</div>
                  <div className="text-xs text-gray-400">1,847 keys</div>
                </div>
                <div>
                  <div className="text-green-400 text-lg font-bold">ES</div>
                  <div className="text-xs text-gray-400">1,847 keys</div>
                </div>
                <div>
                  <div className="text-green-400 text-lg font-bold">FR</div>
                  <div className="text-xs text-gray-400">1,847 keys</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">
                Anti-Pattern Detection
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Identifies anti-patterns and framework violations before they
              become technical debt.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  Direct DB access in routes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  Missing error boundaries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  Incorrect hook usage
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                Auto-Generation
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Automatically generates missing files, routes, and boilerplate
              code following framework patterns.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="text-sm text-green-400">
                ✓ Generated 3 missing files
              </div>
              <div className="text-sm text-blue-400">
                + Added type definitions
              </div>
              <div className="text-sm text-yellow-400">
                + Created test boilerplate
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Performance Metrics Dashboard
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">0.8s</div>
              <div className="text-sm text-gray-400">Average Check Time</div>
              <div className="mt-2 text-xs text-green-400">↓ 45% faster</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">1,247</div>
              <div className="text-sm text-gray-400">Files Validated</div>
              <div className="mt-2 text-xs text-blue-400">Incremental mode</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">94%</div>
              <div className="text-sm text-gray-400">Auto-Fix Rate</div>
              <div className="mt-2 text-xs text-purple-400">
                Continuously improving
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">0</div>
              <div className="text-sm text-gray-400">Production Bugs</div>
              <div className="mt-2 text-xs text-green-400">Last 30 days</div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-6">
            <h4 className="text-lg font-medium text-white mb-4">
              Check Performance Over Time
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">Week 1</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">
                  1.4s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">Week 2</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                    style={{ width: "65%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">
                  1.1s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">Week 3</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"
                    style={{ width: "50%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">
                  0.8s
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Incremental checking and caching improve performance over time
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Intelligent Error Messages
          </h2>
          <p className="text-gray-300 mb-6">
            When something goes wrong, Vibe Check provides actionable error
            messages with exact file locations, suggested fixes, and relevant
            documentation links.
          </p>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-red-400">❌ Type Error in user endpoint</div>
            <div className="text-gray-400 mt-2">
              File: src/app/api/[locale]/v1/users/definition.ts:45:12
            </div>
            <div className="text-yellow-400 mt-2">
              Property 'age' expects type 'number' but received 'string'
            </div>
            <div className="text-green-400 mt-2">
              💡 Fix: Change z.string() to z.number()
            </div>
            <div className="text-blue-400 mt-2">
              📚 Docs: https://vibe.dev/docs/schemas#number-validation
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Keep Your Codebase Pristine
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Vibe Check is your guardian angel, ensuring every line of code meets
          the highest standards before it reaches production.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">$ vibe check</div>
          <div className="text-gray-500 mt-1">
            # Your daily dose of confidence
          </div>
        </div>
      </section>
    </main>
  );
}
