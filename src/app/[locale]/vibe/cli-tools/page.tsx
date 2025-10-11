"use client";

import {
  Code,
  Command,
  Database,
  FileText,
  Shield,
  Terminal,
  User,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  basic: `# Every API endpoint is automatically a CLI command
$ vibe user:create --email john@example.com --name "John Doe"
✅ User created successfully
ID: usr_123456789
Email: john@example.com

# Use short aliases for common commands
$ vibe db:ping
✅ Database connection successful
Response time: 12ms

# Interactive mode when no data provided
$ vibe user:create
? Enter email: jane@example.com
? Enter name: Jane Smith
? Select role: [Admin/User/Guest] User
✅ User created successfully

# Help is auto-generated from your schemas
$ vibe user:create --help
Create a new user account

Usage: vibe user:create [options]

Options:
  --email <email>     User email address (required)
  --name <string>     Full name (required)
  --role <role>       User role (choices: "admin", "user", "guest")
  --send-welcome      Send welcome email (default: true)
  -h, --help          Display help for command`,

  definition: `// definition.ts - Single source of truth
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "users", "create"],
  title: "users.create.title",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["user:create", "uc"],  // CLI shortcuts
  
  fields: objectField({
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "users.fields.email",
      required: true,
    }, z.email()),
    
    name: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "users.fields.name",
    }, z.string()),
    
    role: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.SELECT,
      options: UserRoleOptions,
      defaultValue: UserRoleValue.USER,
    }, z.nativeEnum(UserRoleValue)),
  }),
});`,

  advanced: `# Complex operations with rich output
$ vibe leads:import --file contacts.csv --validate
📊 Import Preview:
┌─────────────────────────────────────┐
│ Total rows: 1,247                   │
│ Valid: 1,198                        │
│ Invalid: 49                         │
│ Duplicates: 23                      │
└─────────────────────────────────────┘

? Proceed with import? Yes
⏳ Importing... [████████████████] 100%
✅ Import completed successfully

# Pipe and compose commands
$ vibe user:list --role admin | vibe export --format json > admins.json

# Execute remote commands
$ vibe remote:connect production
$ vibe @production stats:overview --last 7d`,

  interactive: `# Full interactive CLI when no command provided
$ vibe

🚀 Vibe CLI v2.0.0

? What would you like to do?
  ❯ User Management
    System Operations
    Data Import/Export
    Development Tools
    Remote Operations

? Select operation:
  ❯ Create new user
    List users
    Update user
    Delete user
    Back

? Enter user details:
  Email: admin@company.com
  Name: Admin User
  Role: [Admin] ✓
  Send welcome email: [Y/n] Y

✅ User created and welcome email sent!`,

  authentication: `# Authentication handled automatically
$ vibe auth:login
? Enter email: admin@example.com
? Enter password: ********
✅ Authenticated successfully
Token saved to ~/.vibe/auth.json

# Role-based access control
$ vibe admin:users:delete --id usr_123
❌ Error: Insufficient permissions
Required role: SUPER_ADMIN
Your role: ADMIN

# API key authentication
$ VIBE_API_KEY=sk_live_xxx vibe user:list`,

  output: `# Multiple output formats
$ vibe user:list --format table
┌──────────┬────────────────────┬───────────┬────────┐
│ ID       │ Email              │ Name      │ Role   │
├──────────┼────────────────────┼───────────┼────────┤
│ usr_001  │ alice@example.com  │ Alice     │ Admin  │
│ usr_002  │ bob@example.com    │ Bob       │ User   │
│ usr_003  │ charlie@example.com│ Charlie   │ User   │
└──────────┴────────────────────┴───────────┴────────┘

$ vibe user:list --format json --pretty
{
  "users": [
    {
      "id": "usr_001",
      "email": "alice@example.com",
      "name": "Alice",
      "role": "Admin"
    }
  ]
}

$ vibe user:list --format csv
id,email,name,role
usr_001,alice@example.com,Alice,Admin
usr_002,bob@example.com,Bob,User`,
};

export default function CLIToolsPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("basic");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Terminal className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            CLI for Every API
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Write your API endpoint once, get a powerful CLI command
          automatically. No additional configuration needed.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                1. Define Your Endpoint
              </h3>
              <p className="text-gray-400">
                Create a single definition file with your endpoint schema,
                validation, and UI configuration
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                2. Automatic Generation
              </h3>
              <p className="text-gray-400">
                Vibe automatically generates CLI commands, REST APIs, TRPC
                procedures, and React hooks
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Command className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Use Everywhere
              </h3>
              <p className="text-gray-400">
                Access your functionality via CLI, web UI, or programmatically
                with full type safety
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
                onClick={() => setActiveExample("basic")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "basic"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Basic Usage
              </button>
              <button
                onClick={() => setActiveExample("definition")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "definition"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Definition
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
                onClick={() => setActiveExample("interactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "interactive"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Interactive
              </button>
              <button
                onClick={() => setActiveExample("authentication")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "authentication"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Auth & Roles
              </button>
              <button
                onClick={() => setActiveExample("output")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "output"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Output Formats
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
        <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Smart Interactive Forms
              </h3>
            </div>
            <p className="text-gray-300">
              When parameters are missing, the CLI automatically presents
              beautiful interactive forms with validation, defaults, and helpful
              descriptions.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Database className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Type-Safe Parameters
              </h3>
            </div>
            <p className="text-gray-300">
              All CLI arguments are validated against your Zod schemas. Get
              helpful error messages and suggestions when parameters don't match
              expected types.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Built-in Authentication
              </h3>
            </div>
            <p className="text-gray-300">
              Role-based access control works seamlessly across CLI and web.
              Authenticate once, access all your permitted endpoints.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Code className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Multiple Output Formats
              </h3>
            </div>
            <p className="text-gray-300">
              Choose between table, JSON, CSV, or custom formats. Pipe output to
              other commands or save directly to files.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Command Discovery
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Explore Available Commands
              </h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-400"># List all commands</div>
                <div className="text-green-400">$ vibe list</div>
                <div className="text-gray-300 mt-2">
                  <div>User Management:</div>
                  <div className="ml-4">
                    user:create, user:update, user:delete
                  </div>
                  <div className="ml-4">user:list, user:search</div>
                  <div className="mt-2">Database:</div>
                  <div className="ml-4">db:migrate, db:seed, db:reset</div>
                  <div className="ml-4">db:backup, db:restore</div>
                </div>

                <div className="text-gray-400 mt-4"># Search commands</div>
                <div className="text-green-400">$ vibe list user</div>
                <div className="text-gray-300 mt-2">
                  <div>user:create - Create a new user</div>
                  <div>user:update - Update user details</div>
                  <div>user:list - List all users</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Command Documentation
              </h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-400"># Get detailed help</div>
                <div className="text-green-400">$ vibe help user:create</div>
                <div className="text-gray-300 mt-2">
                  <div className="text-white">Create a new user account</div>
                  <div className="mt-2">Usage: vibe user:create [options]</div>
                  <div className="mt-2">Options:</div>
                  <div className="ml-2">--email User email (required)</div>
                  <div className="ml-2">--name Full name (required)</div>
                  <div className="ml-2">--role User role</div>
                  <div className="ml-2">--notify Send notification</div>
                  <div className="mt-2">Examples:</div>
                  <div className="ml-2 text-blue-400">
                    vibe user:create --email john@example.com
                  </div>
                  <div className="ml-2 text-blue-400">
                    vibe uc --email jane@example.com --role admin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Advanced CLI Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Scripting Support
            </h3>
            <p className="text-gray-300 mb-3">
              Perfect for automation and CI/CD pipelines with JSON output and
              exit codes.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>#!/bin/bash</div>
              <div>users=$(vibe user:list --json)</div>
              <div>echo $users | jq '.length'</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Environment Support
            </h3>
            <p className="text-gray-300 mb-3">
              Work with different environments seamlessly using configuration
              profiles.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>$ vibe --env staging user:list</div>
              <div>$ VIBE_ENV=production vibe db:backup</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Plugin System
            </h3>
            <p className="text-gray-300 mb-3">
              Extend the CLI with custom commands and integrations for your
              workflow.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>$ vibe plugin:add @company/cli</div>
              <div>$ vibe company:deploy --prod</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            CLI That Understands Your Business
          </h2>
          <p className="text-gray-300 mb-6">
            Unlike generic CLIs, Vibe commands are generated from your actual
            business logic. Every command knows your data models, validation
            rules, and business constraints.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-medium mb-3">Traditional CLI</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>❌ Manual command definitions</li>
                <li>❌ Duplicate validation logic</li>
                <li>❌ Out of sync with API</li>
                <li>❌ No type checking</li>
                <li>❌ Separate documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Vibe CLI</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✅ Auto-generated from endpoints</li>
                <li>✅ Shared validation with API</li>
                <li>✅ Always in sync</li>
                <li>✅ Full type safety</li>
                <li>✅ Self-documenting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Transform Your CLI Experience?
        </h2>
        <p className="text-gray-300 mb-6">
          Every endpoint in your Vibe application is instantly accessible via
          CLI. No additional setup, no configuration files, no maintenance
          overhead.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
          <div className="text-green-400">$ npm install -g @vibe/cli</div>
          <div className="text-green-400">$ vibe init</div>
          <div className="text-gray-500 mt-2">
            # Start using any endpoint as a CLI command!
          </div>
        </div>
      </section>
    </main>
  );
}
