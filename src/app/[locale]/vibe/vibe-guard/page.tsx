"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Container,
  Cpu,
  Eye,
  GitBranch,
  HardDrive,
  Layers,
  Lock,
  Network,
  Shield,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  create: `# Create a sandboxed development environment
$ vibe guard:create --project my-app
🛡️ Creating Vibe Guard for project 'my-app'

? Select security level:
  ❯ MINIMAL - Basic file system protection
    STANDARD - Git protection + restricted commands
    ENHANCED - Process isolation + network limits
    MAXIMUM - Full containerization

? Select user type:
  ❯ PROJECT_USER - Full access to project files
    PROJECT_VIEWER - Read-only access
    EXTERNAL_USER - Minimal access for testing

✅ Guard created successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Guard ID: guard_my_app_abc123
Username: guard_my_app
Home: /home/guards/my_app
Script: /projects/my-app/.vscode/.guard.sh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  protection: `# Git protection prevents destructive operations
$ git push --force origin main
❌ Vibe Guard: Force push blocked
This operation could destroy commit history
Use: git push origin main

$ git reset --hard HEAD~10  
❌ Vibe Guard: Hard reset blocked
This would lose 10 commits
Use: git reset --soft HEAD~10

# File system protection
$ rm -rf src/
❌ Vibe Guard: Destructive operation blocked
Cannot delete protected directories

$ mv important-file.ts /tmp/
⚠️ Vibe Guard: Moving file outside project
Confirm operation? [y/N]

# Database protection
$ psql -c "DROP DATABASE production;"
❌ Vibe Guard: Production database access denied
Only test databases allowed in guard mode`,

  isolation: `# Different isolation methods
# 1. RBASH (Restricted Bash)
$ vibe guard:create --isolation rbash
✅ Using restricted bash shell
   - Limited command access
   - No directory traversal
   - Project-scoped only

# 2. Docker Container
$ vibe guard:create --isolation docker
✅ Creating Docker container
   - Complete process isolation
   - Resource limits applied
   - Network sandboxing

# 3. Virtual Machine
$ vibe guard:create --isolation vm
✅ Spinning up lightweight VM
   - Hardware-level isolation
   - Snapshot/restore support
   - Maximum security

# 4. Process Namespace
$ vibe guard:create --isolation process
✅ Using Linux namespaces
   - PID isolation
   - Mount namespace
   - Network namespace`,

  agents: `# AI agent sandboxing
# Configure agent permissions
$ vibe guard:agent --model claude-3
🤖 Configuring AI Agent Guard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Allowed Operations:
✅ Read project files
✅ Run tests
✅ Execute linters
✅ Git diff/status
❌ Git push/commit
❌ Database modifications
❌ System commands
❌ Network requests

$ vibe agent:chat --guard
> Agent: I'll analyze your code and suggest improvements
> Agent: Running tests... ✅
> Agent: Attempting to commit changes...
❌ Guard: Operation blocked - agents cannot commit

# Agent activity monitoring
$ vibe guard:logs --agent
[10:15:23] Agent read: src/api/users/route.ts
[10:15:24] Agent executed: npm test
[10:15:30] Agent blocked: git commit -m "fix"
[10:15:31] Agent suggested: "Review changes manually"`,

  vscode: `# VSCode integration
$ vibe guard:vscode --setup
✅ VSCode Vibe Guard configured

Features enabled:
- Restricted terminal commands
- Safe file operations only  
- Git hooks for protection
- Agent sandbox mode
- Activity logging

# .vscode/settings.json
{
  "vibe.guard.enabled": true,
  "vibe.guard.level": "STANDARD",
  "terminal.integrated.profiles.linux": {
    "vibe-guard": {
      "path": "/projects/my-app/.vscode/.guard.sh"
    }
  },
  "terminal.integrated.defaultProfile.linux": "vibe-guard"
}

# Automatic guard activation
$ code .  # Opens VSCode
[VSCode Terminal]
🛡️ Vibe Guard Active - STANDARD mode
Project: my-app
Restrictions: Git protection, file limits`,

  monitoring: `# Real-time activity monitoring
$ vibe guard:monitor
📊 Vibe Guard Activity Monitor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Guards: 3
┌─────────────┬──────────┬─────────────┬──────────┐
│ Project     │ User     │ Security    │ Activity │
├─────────────┼──────────┼─────────────┼──────────┤
│ my-app      │ guard_01 │ STANDARD    │ Active   │
│ backend-api │ guard_02 │ ENHANCED    │ Idle     │
│ frontend    │ agent_01 │ MAXIMUM     │ Busy     │
└─────────────┴──────────┴─────────────┴──────────┘

Recent Activity:
[10:32:15] guard_01: Executed 'npm test'
[10:32:45] guard_01: Read 15 files
[10:33:02] agent_01: Blocked: rm -rf node_modules
[10:33:15] guard_02: Git diff executed

# Detailed logs for investigation
$ vibe guard:logs --detail --last 1h
[Shows comprehensive activity log with stack traces]`,
};

export default function VibeGuardPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("create");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Shield className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Vibe Guard
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Revolutionary sandboxing for development environments. Keep your code,
          data, and systems safe while enabling powerful automation and AI
          assistance.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Multi-Layer Protection
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-red-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Git Safety
              </h3>
              <p className="text-gray-400 text-sm">
                Prevents force pushes, hard resets, and history rewrites
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                File Protection
              </h3>
              <p className="text-gray-400 text-sm">
                Blocks destructive operations on critical files
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Command Limits
              </h3>
              <p className="text-gray-400 text-sm">
                Restricts dangerous system commands
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Process Isolation
              </h3>
              <p className="text-gray-400 text-sm">
                Sandboxes processes with resource limits
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
                onClick={() => setActiveExample("create")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "create"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Create Guard
              </button>
              <button
                onClick={() => setActiveExample("protection")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "protection"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Protection Examples
              </button>
              <button
                onClick={() => setActiveExample("isolation")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "isolation"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Isolation Methods
              </button>
              <button
                onClick={() => setActiveExample("agents")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "agents"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                AI Agents
              </button>
              <button
                onClick={() => setActiveExample("vscode")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "vscode"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                VSCode Integration
              </button>
              <button
                onClick={() => setActiveExample("monitoring")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "monitoring"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Monitoring
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
        <h2 className="text-2xl font-bold text-white mb-6">Security Levels</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-600/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-600/20 rounded-lg p-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                MINIMAL - Quick Protection
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Basic file system protection</li>
              <li>• Prevent accidental deletions</li>
              <li>• Git safeguards for common mistakes</li>
              <li>• Perfect for experienced developers</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-600/5 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-600/20 rounded-lg p-2">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                STANDARD - Balanced Safety
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• All MINIMAL protections</li>
              <li>• Command restrictions</li>
              <li>• Network access limits</li>
              <li>• Recommended for most users</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-600/10 to-orange-600/5 backdrop-blur-sm rounded-xl p-6 border border-orange-600/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-600/20 rounded-lg p-2">
                <Shield className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                ENHANCED - AI & Automation
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Process isolation</li>
              <li>• Resource limits</li>
              <li>• Perfect for AI agents</li>
              <li>• Detailed activity logging</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-600/10 to-red-600/5 backdrop-blur-sm rounded-xl p-6 border border-red-600/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600/20 rounded-lg p-2">
                <Lock className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                MAXIMUM - Full Isolation
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Complete containerization</li>
              <li>• No host system access</li>
              <li>• Snapshot/restore capability</li>
              <li>• For untrusted code execution</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Guard Architecture Flow
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Security Enforcement Pipeline
          </h3>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-blue-400 font-bold">1</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Command Interception
                </h4>
                <p className="text-gray-300 mb-3">
                  Every command is intercepted by the guard shell wrapper before
                  execution
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Terminal className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 text-sm">Input</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">Analyze</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">
                        Execute/Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-blue-400 font-bold">2</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Risk Assessment
                </h4>
                <p className="text-gray-300 mb-3">
                  Advanced pattern matching and context analysis determines
                  command safety
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Command Pattern:
                      </span>
                      <span className="text-blue-400 text-sm font-mono">
                        rm -rf src/
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-400 text-sm">
                          High Risk: Destructive operation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-400 text-sm">
                          Protected Path: Source directory
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-400 text-sm">
                          Result: BLOCKED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-blue-400 font-bold">3</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Isolation Enforcement
                </h4>
                <p className="text-gray-300 mb-3">
                  Safe commands execute within the configured isolation
                  boundaries
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <HardDrive className="h-4 w-4 text-green-400 mx-auto mb-1" />
                      <div className="text-xs text-green-400">File System</div>
                    </div>
                    <div>
                      <Network className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                      <div className="text-xs text-yellow-400">Network</div>
                    </div>
                    <div>
                      <Cpu className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs text-blue-400">Process</div>
                    </div>
                    <div>
                      <Users className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-purple-400">User Space</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-blue-400 font-bold">4</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Activity Logging
                </h4>
                <p className="text-gray-300 mb-3">
                  All activity is logged with detailed context for audit and
                  analysis
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Event ID:</span>
                      <span className="text-yellow-400 text-sm font-mono">
                        guard_2024_001_7b8c
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Action:</span>
                      <span className="text-red-400 text-sm">
                        BLOCKED: rm -rf src/
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Audit Trail:
                      </span>
                      <span className="text-green-400 text-sm">
                        ✓ Logged to security system
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
              <Container className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Isolation Technologies
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Multiple isolation methods available depending on security
              requirements and performance needs.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-400">
                    RBASH - Lightweight shell restriction
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-blue-400">
                    Docker - Container isolation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm text-purple-400">
                    Namespaces - Linux kernel isolation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-400">
                    VM - Hardware-level isolation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Real-time Monitoring
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Comprehensive activity monitoring with intelligent threat
              detection and automated response.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Active Guards</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">3 running</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Commands/min:</span>
                  <span className="text-blue-400">127</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Blocks/hour:</span>
                  <span className="text-yellow-400">3</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Security events:</span>
                  <span className="text-red-400">0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                AI Agent Supervision
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Specialized monitoring and control for AI agents with granular
              permission management.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">
                  File read operations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Test execution</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  Git commits (blocked)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  System commands (blocked)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Performance Impact
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Minimal overhead with intelligent caching and optimized
              interception patterns.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  &lt;2ms
                </div>
                <div className="text-xs text-gray-400">
                  Command interception overhead
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center mt-3">
                <div>
                  <div className="text-lg font-bold text-blue-400">99.8%</div>
                  <div className="text-xs text-gray-400">Cache hit rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">~0MB</div>
                  <div className="text-xs text-gray-400">Memory overhead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Security Architecture Deep Dive
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Defense Layers
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-400 mb-2">
                    Shell Wrapper
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Command interception</li>
                    <li>• Pattern matching</li>
                    <li>• Context analysis</li>
                    <li>• Real-time filtering</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-orange-400 mb-2">
                    Process Control
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Resource limits</li>
                    <li>• Process isolation</li>
                    <li>• Capability restrictions</li>
                    <li>• Signal handling</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Access Control
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-green-400 mb-2">
                    File System
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Path restrictions</li>
                    <li>• Read/write controls</li>
                    <li>• Symlink protection</li>
                    <li>• Backup preservation</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">
                    Network Access
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Outbound restrictions</li>
                    <li>• Port limitations</li>
                    <li>• DNS filtering</li>
                    <li>• Proxy controls</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Monitoring & Audit
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">
                    Activity Logging
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Command history</li>
                    <li>• File access logs</li>
                    <li>• Network activity</li>
                    <li>• Error tracking</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">
                    Threat Detection
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Anomaly detection</li>
                    <li>• Pattern recognition</li>
                    <li>• Behavioral analysis</li>
                    <li>• Auto-response</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            AI-First Security Design
          </h2>
          <p className="text-gray-300 mb-6">
            Vibe Guard was designed from the ground up for the AI era. Enable
            powerful AI agents and automation while keeping your systems
            completely safe.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">
                Multi-User Support
              </h3>
              <p className="text-gray-400 text-sm">
                Each developer and agent gets their own isolated environment
              </p>
            </div>
            <div className="text-center">
              <Terminal className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">
                Transparent Operation
              </h3>
              <p className="text-gray-400 text-sm">
                Works seamlessly with existing tools and workflows
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Zero Trust Model</h3>
              <p className="text-gray-400 text-sm">
                Every operation verified, nothing assumed safe
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Development Without Fear
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Let junior developers learn, AI agents assist, and automation run wild
          - all while keeping your production code and data completely safe.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">
            $ vibe guard:create --level STANDARD
          </div>
          <div className="text-gray-500 mt-1"># Sleep better at night 🛡️</div>
        </div>
      </section>
    </main>
  );
}
