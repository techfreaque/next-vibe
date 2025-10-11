"use client";

import {
  ArrowRight,
  Building,
  CheckCircle,
  Cloud,
  GitBranch,
  Package,
  Rocket,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  builder: `# Build any route as a standalone package
$ vibe build:route user
🏗️ Building route: /api/v1/user
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Analyzing dependencies...
  - Core dependencies: 12
  - Route-specific: 3
  - Total size: 147KB

🔨 Building package...
  ✅ TypeScript compilation
  ✅ Bundle optimization
  ✅ Type definitions generated
  ✅ CLI wrapper created
  ✅ README generated

📁 Output structure:
dist/
├── index.js        (45KB)
├── index.d.ts      (12KB)
├── cli.js          (8KB)
├── package.json
└── README.md

✅ Package built successfully
Install: npm install ./dist/vibe-route-user-1.0.0.tgz`,

  release: `# Orchestrated release pipeline
$ vibe release
🚀 Vibe Release Tool v2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Analyzing packages for release...

Found 5 packages with changes:
┌─────────────────────┬─────────┬─────────┬──────────┐
│ Package             │ Current │ Next    │ Changes  │
├─────────────────────┼─────────┼─────────┼──────────┤
│ @vibe/core          │ 2.1.4   │ 2.2.0   │ +3 feat  │
│ @vibe/cli           │ 2.1.4   │ 2.1.5   │ +2 fix   │
│ @vibe/guard         │ 1.0.9   │ 1.1.0   │ +1 feat  │
│ @vibe/builder       │ 0.9.2   │ 0.9.3   │ +1 fix   │
│ @vibe/release-tool  │ 1.2.1   │ 1.2.2   │ +3 fix   │
└─────────────────────┴─────────┴─────────┴──────────┘

? Select release type:
  ❯ patch - Bug fixes (2.1.4 → 2.1.5)
    minor - New features (2.1.4 → 2.2.0)
    major - Breaking changes (2.1.4 → 3.0.0)
    custom - Specify versions manually

? Generate changelogs? Yes
? Run tests before release? Yes
? Tag release in git? Yes
? Publish to npm? Yes`,

  pipeline: `# Release pipeline execution
$ vibe release --minor
🚀 Starting release pipeline...

1️⃣ Pre-release checks
   ✅ Git status clean
   ✅ On main branch
   ✅ Remote up to date

2️⃣ Running tests
   ✅ Unit tests: 1,247 passed
   ✅ Integration tests: 89 passed
   ✅ E2E tests: 34 passed

3️⃣ Building packages
   ⏳ @vibe/core... ✅ (12s)
   ⏳ @vibe/cli... ✅ (8s)
   ⏳ @vibe/guard... ✅ (6s)
   ⏳ @vibe/builder... ✅ (5s)
   ⏳ @vibe/release-tool... ✅ (4s)

4️⃣ Generating changelogs
   ✅ Analyzed 47 commits
   ✅ Categorized changes
   ✅ Generated CHANGELOG.md

5️⃣ Publishing packages
   📦 @vibe/core@2.2.0... ✅
   📦 @vibe/cli@2.2.0... ✅
   📦 @vibe/guard@1.1.0... ✅
   📦 @vibe/builder@0.9.3... ✅
   📦 @vibe/release-tool@1.2.2... ✅

6️⃣ Creating git release
   ✅ Tagged v2.2.0
   ✅ Pushed to origin
   ✅ Created GitHub release

🎉 Release completed successfully!`,

  monorepo: `# Monorepo package management
$ vibe release --packages
📦 Monorepo Package Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workspace structure:
workspace/
├── packages/
│   ├── vibe-core/         ✅ Public
│   ├── vibe-cli/          ✅ Public
│   ├── vibe-ui/           ✅ Public
│   ├── vibe-guard/        ✅ Public
│   └── vibe-internal/     🔒 Private
├── apps/
│   ├── website/           🔒 Private
│   └── docs/              🔒 Private
└── tools/
    ├── builder/           ✅ Public
    └── release/           ✅ Public

# Dependency graph
$ vibe release --graph
@vibe/cli
  └── @vibe/core (^2.1.0)
      └── @vibe/utils (^1.0.0)
  
@vibe/ui
  ├── @vibe/core (^2.1.0)
  └── react (^18.0.0)

# Update internal dependencies
$ vibe release --sync-versions
✅ Updated 12 internal dependency versions`,

  automation: `# CI/CD Integration
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install Vibe
        run: npm install -g @vibe/cli
        
      - name: Check for releases
        run: |
          if vibe release --check; then
            echo "SHOULD_RELEASE=true" >> $GITHUB_ENV
          fi
          
      - name: Run release
        if: env.SHOULD_RELEASE == 'true'
        run: vibe release --ci --npm-token $NPM_TOKEN
        env:
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,

  custom: `# Custom build configurations
$ vibe build:custom
🛠️ Custom Build Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? What to build?
  ❯ Single route → Standalone package
    Route group → Combined package
    Entire API → Full API package
    Custom selection → Choose files

? Select routes to include:
  ✅ /api/v1/users
  ✅ /api/v1/auth
  ❯ ✅ /api/v1/billing
  ◯ /api/v1/admin
  
? Package configuration:
  Name: @mycompany/user-api
  Version: 1.0.0
  License: MIT
  
? Include extras?
  ✅ TypeScript definitions
  ✅ CLI interface
  ✅ React hooks
  ❯ ✅ Documentation
  ◯ Tests
  
? Output format?
  ❯ NPM package (.tgz)
    Docker image
    Serverless function
    Edge function

Building custom package...
✅ Package created: dist/mycompany-user-api-1.0.0.tgz`,
};

export default function BuilderReleasePage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("builder");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Package className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Builder & Release Tool
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Build any route as a standalone package. Orchestrate releases across
          your entire monorepo with intelligent versioning and automated
          pipelines.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            From Routes to Packages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Route Builder
              </h3>
              <p className="text-gray-400">
                Convert any API route into a standalone npm package instantly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Release Orchestration
              </h3>
              <p className="text-gray-400">
                Coordinate releases across multiple packages with dependency
                management
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Cloud className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Deploy Anywhere
              </h3>
              <p className="text-gray-400">
                Publish to npm, Docker registries, or deploy as serverless
                functions
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
                onClick={() => setActiveExample("builder")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "builder"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Route Builder
              </button>
              <button
                onClick={() => setActiveExample("release")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "release"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Release Tool
              </button>
              <button
                onClick={() => setActiveExample("pipeline")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "pipeline"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setActiveExample("monorepo")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "monorepo"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Monorepo
              </button>
              <button
                onClick={() => setActiveExample("automation")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "automation"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                CI/CD
              </button>
              <button
                onClick={() => setActiveExample("custom")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "custom"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Custom Builds
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
          Release Pipeline Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <GitBranch className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Semantic Versioning
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Automatic version bumping based on commit messages. Follows
              conventional commits for consistent versioning across all
              packages.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              feat: → minor version
              <br />
              fix: → patch version
              <br />
              BREAKING CHANGE: → major version
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Dependency Management
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Intelligently updates internal dependencies. When core package
              updates, all dependent packages are automatically updated and
              tested.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-green-400">
              ✓ Circular dependency detection
              <br />
              ✓ Version range optimization
              <br />✓ Lock file updates
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Quality Gates
              </h3>
            </div>
            <p className="text-gray-300">
              Every release passes through comprehensive quality checks:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• All tests must pass</li>
              <li>• No lint errors</li>
              <li>• Type checking success</li>
              <li>• Security scan clean</li>
              <li>• Bundle size limits</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Package Optimization
              </h3>
            </div>
            <p className="text-gray-300">
              Built packages are optimized for production:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Tree shaking</li>
              <li>• Minification</li>
              <li>• Code splitting</li>
              <li>• Type definitions</li>
              <li>• Source maps</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            The Power of Modularity
          </h2>
          <p className="text-gray-300 mb-6">
            Every route in your Vibe application can become a standalone
            package. Share functionality across projects, create microservices,
            or build a marketplace of reusable API components.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-black/30 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-400">Route</span>
              <span className="text-purple-400 ml-2">/api/v1/auth</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-500" />
            <div className="bg-black/30 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-400">Package</span>
              <span className="text-green-400 ml-2">@company/auth-api</span>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Ship Faster, Ship Safer
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From development to production, Vibe's builder and release tools
          ensure your code is packaged perfectly and deployed flawlessly every
          time.
        </p>
        <div className="inline-flex gap-4">
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">$ vibe build:route user</div>
            <div className="text-gray-500 mt-1"># Package any route</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">$ vibe release</div>
            <div className="text-gray-500 mt-1"># Ship with confidence</div>
          </div>
        </div>
      </section>
    </main>
  );
}
