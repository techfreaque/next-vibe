"use client";

import {
  Cloud,
  GitBranch,
  Globe,
  Lock,
  Shield,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  connect: `# Connect to remote Vibe instances
$ vibe remote:add production https://api.myapp.com
? Enter authentication token: **********************
✅ Remote 'production' added successfully

$ vibe remote:add staging https://staging.myapp.com
✅ Remote 'staging' added successfully

$ vibe remote:list
┌────────────┬─────────────────────────────┬──────────┐
│ Name       │ URL                         │ Status   │
├────────────┼─────────────────────────────┼──────────┤
│ production │ https://api.myapp.com       │ ✅ Active │
│ staging    │ https://staging.myapp.com   │ ✅ Active │
│ local      │ http://localhost:3000       │ ✅ Active │
└────────────┴─────────────────────────────┴──────────┘

# Switch default remote
$ vibe remote:use production
✅ Now using 'production' as default remote`,

  execute: `# Execute commands on remote servers
# Use @ prefix to specify remote
$ vibe @production user:list --role admin
┌──────────┬────────────────────┬───────────┬───────┐
│ ID       │ Email              │ Name      │ Role  │
├──────────┼────────────────────┼───────────┼───────┤
│ usr_001  │ alice@company.com  │ Alice     │ Admin │
│ usr_017  │ bob@company.com    │ Bob       │ Admin │
└──────────┴────────────────────┴───────────┴───────┘

# Compare data across environments
$ vibe stats:overview
Local Environment:
  Users: 42
  Revenue: $1,234
  
$ vibe @staging stats:overview  
Staging Environment:
  Users: 1,842
  Revenue: $45,234
  
$ vibe @production stats:overview
Production Environment:
  Users: 128,923
  Revenue: $2,847,192`,

  sync: `# Sync data between environments
$ vibe sync:config --from production --to staging
⚠️  This will sync configuration from production to staging
? Confirm sync operation? Yes

📋 Analyzing differences...
  - API Keys: 3 to update
  - Feature Flags: 7 to update
  - Settings: 12 to update

? Review changes before applying? Yes

[Shows detailed diff of all changes]

? Apply changes? Yes
✅ Configuration synced successfully

# Selective sync with filters
$ vibe sync:users --from production --to local \
  --filter "role=test" --limit 100
  
✅ Synced 100 test users to local environment`,

  auth: `# Authentication and authorization
# Token-based auth
$ vibe auth:login --remote production
? Email: admin@company.com
? Password: ********
✅ Authenticated to production
Token saved to ~/.vibe/auth/production.token

# API key auth
$ VIBE_API_KEY=sk_prod_xxxxx vibe @production user:create

# Role-based access control
$ vibe @production admin:users:delete --id usr_123
❌ Error: Insufficient permissions
Required role: SUPER_ADMIN
Your role: ADMIN on production

# Multi-factor authentication
$ vibe @production sensitive:operation
? Enter 2FA code: 123456
✅ 2FA verified, executing operation...`,

  monitoring: `# Real-time monitoring and logs
$ vibe @production logs:tail --follow
[2024-01-15 10:30:01] INFO: User usr_123 logged in
[2024-01-15 10:30:05] INFO: API call to /v1/users/list
[2024-01-15 10:30:07] ERROR: Database connection timeout
[2024-01-15 10:30:08] INFO: Retrying database connection
[2024-01-15 10:30:09] INFO: Database connection restored

# Monitor specific services
$ vibe @production monitor:health
┌─────────────┬────────┬───────────┬────────────┐
│ Service     │ Status │ Uptime    │ Response   │
├─────────────┼────────┼───────────┼────────────┤
│ API         │ ✅ OK  │ 99.99%    │ 45ms       │
│ Database    │ ✅ OK  │ 99.95%    │ 12ms       │
│ Redis       │ ✅ OK  │ 100%      │ 2ms        │
│ Email       │ ⚠️ Slow │ 99.9%     │ 2,341ms    │
└─────────────┴────────┴───────────┴────────────┘`,

  batch: `# Batch operations across remotes
# Execute on multiple remotes
$ vibe @all check:health
Executing on all remotes...

local: ✅ All systems operational
staging: ✅ All systems operational  
production: ⚠️ High memory usage (87%)

# Parallel execution
$ vibe @production,staging user:count --parallel
[production]: 128,923 users
[staging]: 1,842 users
Completed in 0.23s

# Script remote operations
$ cat deploy-check.sh
#!/bin/bash
vibe @staging check
vibe @staging test:integration
vibe @production stats:snapshot --save pre-deploy

$ ./deploy-check.sh`,
};

export default function RemoteCLIPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("connect");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <GitBranch className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Remote CLI
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Connect to any Vibe instance remotely. Execute commands on production
          servers, sync data between environments, and monitor your applications
          from anywhere.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Work Across Environments
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multi-Environment
              </h3>
              <p className="text-gray-400">
                Connect to local, staging, production, or any custom environment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure by Default
              </h3>
              <p className="text-gray-400">
                Token-based auth, role enforcement, and audit logging built-in
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Terminal className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Same CLI Experience
              </h3>
              <p className="text-gray-400">
                All commands work identically whether local or remote
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
                onClick={() => setActiveExample("connect")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "connect"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Connection
              </button>
              <button
                onClick={() => setActiveExample("execute")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "execute"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Remote Execution
              </button>
              <button
                onClick={() => setActiveExample("sync")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "sync"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Data Sync
              </button>
              <button
                onClick={() => setActiveExample("auth")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "auth"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Authentication
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
              <button
                onClick={() => setActiveExample("batch")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "batch"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Batch Operations
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
          Remote Execution Architecture
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Secure Command Flow
          </h3>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 rounded-full p-3 flex-shrink-0">
                <div className="text-blue-400 font-bold">1</div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Client Authentication
                </h4>
                <p className="text-gray-300 mb-3">
                  Multi-layer authentication with token validation, role
                  checking, and optional MFA
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">JWT Token</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 text-sm">Role Check</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 text-sm">
                        MFA (Optional)
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
                  Command Validation
                </h4>
                <p className="text-gray-300 mb-3">
                  Every command is validated against permissions, rate limits,
                  and environment policies
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Command:</span>
                    <span className="text-blue-400 text-sm font-mono">
                      vibe @prod user:create
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-400 text-sm">
                        Permission: users.create ✓
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-400 text-sm">
                        Rate limit: 47/100 ✓
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-400 text-sm">
                        Environment: production ✓
                      </span>
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
                  Secure Transmission
                </h4>
                <p className="text-gray-300 mb-3">
                  Commands are encrypted and transmitted over secure channels
                  with integrity verification
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center mb-2">
                        <Terminal className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-xs text-gray-400">Local CLI</div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
                      <span className="text-xs text-purple-400">
                        TLS 1.3 + AES-256
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-500 to-green-500" />
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center mb-2">
                        <Cloud className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-xs text-gray-400">Remote Server</div>
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
                  Execution & Auditing
                </h4>
                <p className="text-gray-300 mb-3">
                  Commands execute in isolated contexts with full audit logging
                  and response encryption
                </p>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Execution ID:
                      </span>
                      <span className="text-yellow-400 text-sm font-mono">
                        exec_2024_001_5a3f
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Audit Log:</span>
                      <span className="text-green-400 text-sm">
                        ✓ Logged to security system
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Response:</span>
                      <span className="text-blue-400 text-sm">
                        Encrypted & transmitted
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
              <Cloud className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Environment Management
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Manage multiple environments with named remotes and execute
              commands across multiple environments simultaneously.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1" />
                  <div className="text-xs text-green-400">Production</div>
                </div>
                <div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1" />
                  <div className="text-xs text-yellow-400">Staging</div>
                </div>
                <div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1" />
                  <div className="text-xs text-blue-400">Development</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Team Collaboration
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Share remote configurations with your team. Each developer has
              individual authentication and role-based access.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-400 text-sm">Alice (Admin)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-400 text-sm">Bob (Developer)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-yellow-400 text-sm">Carol (DevOps)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Real-time Operations
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Stream logs, monitor health, and execute commands with real-time
              feedback via WebSocket connections.
            </p>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Connection Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              <div className="text-xs text-blue-400 font-mono">
                wss://prod.api.com/cli-stream
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Complete Audit Trail
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Every remote command is logged with full audit trail for
              compliance, security, and debugging.
            </p>
            <div className="bg-black/30 rounded-lg p-3 space-y-2">
              <div className="text-xs text-gray-400">Last 24h Activity:</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">247 commands</span>
                <span className="text-sm text-green-400">100% logged</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">5 users active</span>
                <span className="text-sm text-blue-400">0 violations</span>
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
                Authentication Layer
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">
                    Token-Based Auth
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• JWT with RSA-256 signing</li>
                    <li>• Short-lived access tokens (15m)</li>
                    <li>• Refresh token rotation</li>
                    <li>• Device fingerprinting</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">
                    Multi-Factor Auth
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• TOTP (Google Authenticator)</li>
                    <li>• SMS verification</li>
                    <li>• Hardware security keys</li>
                    <li>• Biometric authentication</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Authorization Layer
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-green-400 mb-2">
                    Role-Based Access
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Environment-specific roles</li>
                    <li>• Command-level permissions</li>
                    <li>• Resource-based access</li>
                    <li>• Time-based restrictions</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-orange-400 mb-2">
                    Dynamic Policies
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• IP-based restrictions</li>
                    <li>• Geolocation controls</li>
                    <li>• Rate limiting per user</li>
                    <li>• Contextual permissions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Security Monitoring
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-400 mb-2">
                    Threat Detection
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Anomaly detection</li>
                    <li>• Brute force protection</li>
                    <li>• Suspicious activity alerts</li>
                    <li>• Command pattern analysis</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">
                    Compliance
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• SOX audit trails</li>
                    <li>• GDPR data handling</li>
                    <li>• HIPAA compliance</li>
                    <li>• SOC 2 Type II</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Enterprise-Ready Security
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Authentication Methods
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• JWT token authentication</li>
                <li>• API key support</li>
                <li>• OAuth2 integration</li>
                <li>• Multi-factor authentication</li>
                <li>• Session management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Access Control
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Role-based permissions</li>
                <li>• Environment-specific roles</li>
                <li>• Command-level restrictions</li>
                <li>• IP whitelisting</li>
                <li>• Time-based access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Manage Your Entire Fleet
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From local development to global production deployments, manage all
          your Vibe instances from a single CLI with confidence and ease.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">$ vibe @production status</div>
          <div className="text-gray-500 mt-1">
            # Control production from your terminal
          </div>
        </div>
      </section>
    </main>
  );
}
