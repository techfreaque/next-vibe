# CLI System

**Command-line interface for all API endpoints**

## Overview

The CLI System automatically converts your API endpoints into terminal commands. Uses the same endpoint registry as AI tools and MCP.

## Quick Start

```bash
# Install globally
npm install -g vibe

# Or use npx
npx vibe <command>

# Run a command
vibe create-user --email=john@example.com --name="John Doe"

# Use aliases
vibe user:new --email=john@example.com
vibe signup --email=john@example.com
```

## How It Works

```
1. Discovery
   └─> Scans definition.ts files
   └─> Extracts CLI metadata (aliases, params)

2. Command Registration
   └─> Registers commands with Commander.js
   └─> Maps aliases to endpoints

3. Execution
   └─> Parses CLI arguments
   └─> Validates parameters
   └─> Calls endpoint via route handler
   └─> Formats output (pretty or JSON)
```

## Command Naming

Commands use path segments or aliases:

```
API Path: /v1/core/user/create
Command: vibe core:user:create

Aliases: ["create-user", "user:new", "signup"]
Commands: vibe create-user
          vibe user:new
          vibe signup
```

## Defining CLI Metadata

```typescript
// definition.ts
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "create"],
  aliases: ["create-user", "user:new", "signup"],

  cli: {
    firstCliArgument: "email", // First positional arg
    examples: [
      {
        command: "create-user john@example.com --name='John Doe'",
        description: "Create a user with email and name",
      },
    ],
  },

  // ... rest of definition
});
```

## CLI Arguments

### Positional Arguments

```bash
# First argument is email (defined by firstCliArgument)
vibe create-user john@example.com --name="John Doe"
```

### Named Arguments

```bash
# All fields can be named arguments
vibe create-user --email=john@example.com --name="John Doe"
```

### Boolean Flags

```bash
# Boolean fields become flags
vibe migrate --force
vibe migrate --no-force
```

### Arrays

```bash
# Arrays use comma-separated values
vibe send-email --to=john@example.com,jane@example.com
```

### JSON Objects

```bash
# Complex objects use JSON
vibe create-user --metadata='{"source":"cli","version":"1.0"}'
```

## Output Formats

### Pretty (Default)

```bash
vibe create-user --email=john@example.com

✓ User created successfully
  ID: 550e8400-e29b-41d4-a716-446655440000
  Email: john@example.com
  Name: John Doe
  Created: 2024-01-15 10:30:00
```

### JSON

```bash
vibe create-user --email=john@example.com --output=json

{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Authentication

CLI authentication flow:

1. Check `.vibe.session` file (from login/signup)
2. If no session, check `VIBE_CLI_USER_EMAIL` env var and authenticate from DB
3. If `VIBE_CLI_USER_EMAIL` is empty, create public user with new lead
4. If email is set but user not found in DB, return error

```bash
# Use authenticated user from DB
export VIBE_CLI_USER_EMAIL=admin@example.com
vibe create-user --email=john@example.com

# Use public user (no env var set)
unset VIBE_CLI_USER_EMAIL
vibe create-user --email=john@example.com
```

## Permission System

Commands respect endpoint permissions:

```typescript
// definition.ts
allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF];

// user must have ADMIN; disabled for CLI 
```

Special role `WEB_OFF` and `AI_TOOL_OFF` for CLI-only operations:

- Database migrations
- System maintenance
- Dangerous operations

## Built-in Commands

### Help

```bash
# List all commands
vibe --help

# Command-specific help
vibe create-user --help
```

### Version

```bash
vibe --version
```

### Setup

```bash
# Install CLI globally
vibe setup:install

# Check installation
vibe setup:status

# Update CLI
vibe setup:update

# Uninstall CLI
vibe setup:uninstall
```

### Vibe Check

```bash
# Check all files
vibe check

# Check specific path
vibe check src/app/api/[locale]/v1/core/user

# Lint only
vibe lint

# Type check only
vibe typecheck
```

## Configuration

```typescript
// config/platform-config.ts
export const CLI_CONFIG: PlatformConfig = {
  platform: Platform.CLI,
  rootDir: "src/app/api/[locale]/v1",
  excludePaths: [], // CLI can access everything
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
  },
  rateLimit: {
    enabled: false, // No rate limiting for CLI
  },
};
```

## Best Practices

### 1. Use Semantic Aliases

```typescript
aliases: [
  "create-user", // Imperative
  "user:new", // Namespaced
  "signup", // User-facing term
];
```

### 2. Define First Argument

```typescript
cli: {
  firstCliArgument: "email",  // Most common argument
}
```

### 3. Provide Examples

```typescript
cli: {
  examples: [
    {
      command: "create-user john@example.com --name='John Doe'",
      description: "Create a user with email and name",
    },
    {
      command: "create-user --email=john@example.com --role=ADMIN",
      description: "Create an admin user",
    },
  ],
}
```

### 4. Handle Errors Gracefully

```typescript
errorTypes: {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "Invalid input",
    description: "Please check that email is valid and name is not empty"
  }
}
```

## Scripting

CLI is perfect for automation:

```bash
#!/bin/bash

# Create multiple users
for email in john@example.com jane@example.com; do
  vibe create-user --email=$email --name="Test User"
done

# Check status
if vibe db:ping --output=json | jq -r '.success' | grep -q 'true'; then
  echo "Database is healthy"
else
  echo "Database is down"
  exit 1
fi
```

## Troubleshooting

**"Command not found: vibe"**

```bash
npm install -g vibe
# or use npx
npx vibe <command>
```

**"Permission denied"**

- Check CLI user's role in database
- Verify endpoint's allowedRoles
- Use correct VIBE_CLI_USER_EMAIL

**"Invalid arguments"**

- Check command help: `vibe <command> --help`
- Verify argument names match definition
- Use quotes for strings with spaces

## Related

- [Main README](../README.md)
- [Shared README](../shared/README.md)
- [AI Tool README](../ai-tool/README.md)
- [MCP README](../mcp/README.md)
