import {
  ArrowRight,
  BarChart,
  Clock,
  Code2,
  Database,
  GitBranch,
  Globe,
  Mail,
  Package,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

export default function VibePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative">
          <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-purple-400" />
                  <h1 className="text-2xl font-bold text-white">
                    Vibe Framework
                  </h1>
                </div>
                <p className="text-sm text-gray-300">
                  One Code, Every Interface
                </p>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12">
            <section className="mb-20 text-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Write Once, Run Everywhere
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                The ultimate full-stack framework where every API endpoint is
                automatically a CLI tool, React hook, React Native compatible,
                and type-safe from database to UI
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Production Ready
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Type-Safe End-to-End
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Zero Configuration
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Developer First
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Why Vibe?
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Built by developers who were tired of gluing together dozens
                  of tools. Vibe is the all-in-one framework that just works.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <BarChart className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    10x Productivity
                  </h4>
                  <p className="text-gray-400">
                    Stop writing boilerplate. Focus on your business logic while
                    Vibe handles the rest.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Global Scale
                  </h4>
                  <p className="text-gray-400">
                    From prototype to planet-scale. Built-in i18n, caching, and
                    distributed systems.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    AI Ready
                  </h4>
                  <p className="text-gray-400">
                    Vibe Guard sandboxing and structured data make AI
                    integration safe and powerful.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              <Link href="/vibe/cli-tools" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      CLI for Every API
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Every endpoint automatically becomes a powerful CLI command
                    with interactive forms, validation, and beautiful output
                    formatting.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400 overflow-hidden">
                    <div>$ vibe user:create</div>
                    <div>$ vibe db:ping --silent</div>
                    <div>$ vibe check --fix</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/data-driven-ui" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Code2 className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Data-Driven UI
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Define your UI once, render everywhere. From CLI forms to
                    React components, all generated from a single schema
                    definition.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 text-sm text-blue-400 overflow-hidden">
                    <div className="font-mono">useUniversalEndpoint(</div>
                    <div className="font-mono ml-4">definition</div>
                    <div className="font-mono">)</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/development-loop" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Vibe Check Loop
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Comprehensive development workflow with linting, type
                    checking, and testing all integrated into one powerful
                    command.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-yellow-400 overflow-hidden">
                    <div>✓ Lint check passed</div>
                    <div>✓ Type check passed</div>
                    <div>✓ Tests passed</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/type-safety" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      End-to-End Type Safety
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    From database schemas to API responses to UI components,
                    enjoy complete type safety with zero runtime overhead.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 text-sm text-purple-400">
                    <div>DB → Zod → API → Hooks → UI</div>
                    <div className="mt-2 text-xs text-gray-500">
                      Full type inference chain
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/remote-cli" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <GitBranch className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Remote CLI
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Connect to any Vibe instance remotely. Execute commands on
                    production servers with proper authentication and role
                    management.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-cyan-400 overflow-hidden">
                    <div>$ vibe remote:connect prod</div>
                    <div>$ vibe @prod user:list</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/vibe-guard" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Vibe Guard
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Revolutionary sandboxing for development environments. Keep
                    agents and code execution safe with multiple isolation
                    levels.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 text-sm text-red-400">
                    <div>🛡️ Docker isolation</div>
                    <div>🛡️ Git protection</div>
                    <div>🛡️ Non-destructive only</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/builder-release" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Builder & Release
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Automated build system for publishing routes as packages.
                    Orchestrated release pipelines for monorepo management.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-orange-400 overflow-hidden">
                    <div>$ vibe build:route user</div>
                    <div>$ vibe release --packages</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/database" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Database Magic
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Schema-driven development with automatic migrations,
                    type-safe queries, and environment-aware seeding.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-blue-400 overflow-hidden">
                    <div>$ vibe db:migrate</div>
                    <div>$ vibe db:seed --env dev</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/background-jobs" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Background Jobs
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Enterprise-grade task scheduling with cron expressions,
                    monitoring, and distributed execution.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-yellow-400 overflow-hidden">
                    <div>@weekly newsletter:send</div>
                    <div>@hourly data:sync</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/communications" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Communications
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Beautiful email templates, SMS integration, tracking, and
                    automation workflows built-in.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-pink-400 overflow-hidden">
                    <div>📧 React email components</div>
                    <div>📊 Full tracking & analytics</div>
                  </div>
                </div>
              </Link>

              <Link href="/vibe/i18n" className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-8 w-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Global i18n
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Type-safe translations that live next to your code. No more
                    hunting through massive JSON files.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400 overflow-hidden">
                    <div>// Co-located translations</div>
                    <div>
                      t('user.welcome', {"{"} name {"}"})
                    </div>
                  </div>
                </div>
              </Link>

              <div className="md:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Coming Soon
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• AI-powered chat UI fork</li>
                    <li>• Vercel AI SDK integration</li>
                    <li>• Visual route builder</li>
                    <li>• Marketplace for endpoints</li>
                    <li>• Cloud hosting platform</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Compare the Stack
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  See how Vibe simplifies your development stack
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                  <h4 className="text-xl font-semibold text-red-400 mb-6">
                    Traditional Stack
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        Next.js + Express + tRPC
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        Prisma + Migrations + Seeds
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        React Query + Axios + Zod
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        i18next + JSON files
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">Bull/BullMQ + Redis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        Nodemailer + Templates
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        Commander.js + Manual CLI
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-300">
                        Docker + K8s + CI/CD
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-red-500/30">
                    <p className="text-red-400 font-semibold">
                      8+ tools to configure and maintain
                    </p>
                  </div>
                </div>

                <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                  <h4 className="text-xl font-semibold text-green-400 mb-6">
                    Vibe Framework
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Unified endpoint system
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Drizzle with auto migrations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Built-in hooks & validation
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Co-located translations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Database-backed cron
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Email components & tracking
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">Auto-generated CLI</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-300">
                        Vibe Guard sandboxing
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-green-500/30">
                    <p className="text-green-400 font-semibold">
                      1 framework, zero configuration
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="text-center py-12 border-t border-white/10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Build Something Amazing?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who ship faster with Vibe. From
                startup to scale-up, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/vibe/getting-started"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/vibe/docs"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
                >
                  Read the Docs
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
                <a
                  href="https://github.com/vibe-framework/vibe"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="/vibe/examples"
                  className="hover:text-white transition-colors"
                >
                  Examples
                </a>
                <a
                  href="https://discord.gg/vibe"
                  className="hover:text-white transition-colors"
                >
                  Discord
                </a>
                <a
                  href="https://twitter.com/vibeframework"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
