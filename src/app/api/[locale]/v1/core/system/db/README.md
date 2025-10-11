# Database Management Scripts

This directory contains scripts for managing the database, including resetting, migrating, seeding, checking connectivity, and launching Drizzle Studio.

## Database Reset and Initialization

The database management system consists of these main scripts:

1. `reset.ts` - Fast database reset by truncating tables or full initialization by dropping and recreating schema
2. `migrate.ts` - Run database migrations
3. `seed-db.ts` - Seed the database with initial data for different environments
4. `ping.ts` - Check database connectivity
5. `studio.ts` - Launch Drizzle Studio for database management and visualization

### Usage

```bash
# Reset database (truncate tables)
vibe reset-db --force

# Initialize database (drop and recreate schema)
vibe db:init
# or
vibe reset-db --force --initialize

# Reset and run migrations
vibe db:reset:migrate
# or
vibe reset-db --force --run-migrations

# Run migrations
vibe db:migrate
# or
vibe migrate

# Seed database
vibe db:seed
# or
vibe seed-db --env=dev

# Check database connectivity
vibe db:ping
# or
vibe ping-db

# Launch Drizzle Studio
vibe db:studio
# or
vibe studio
# or
vibe drizzle:studio
```

If no environment is specified for seeding, the script will use the `NODE_ENV` environment variable, or default to `dev` if that's not set.

## Database Reset

The `reset.ts` script provides two main modes of operation:

1. **Fast Reset Mode** (default): Truncates all tables without dropping them, which is much faster than a full initialization
2. **Initialization Mode**: Drops and recreates the entire database schema

### Fast Reset Mode

```bash
vibe reset-db --force
```

This mode:

- Connects to the database
- Identifies all tables in the current schema
- Truncates each table to remove all data
- Preserves the table structure and schema
- Completes in under 1 second (compared to 30+ seconds for full initialization)

### Initialization Mode

```bash
vibe db:init
```

This mode:

- Drops all tables in the database
- Recreates the schema from scratch
- Takes longer but ensures a completely clean database state

### Options

- `--force`: Skip confirmation prompt
- `--run-migrations`: Run migrations after reset
- `--initialize`: Use initialization mode instead of fast reset

## Database Seeding

### How Seeding Works

1. The script first loads the generated seeds file from `src/app/api/generated/seeds.js`
2. It then executes seeds in order of priority (higher priority seeds run first)
3. For each module, it runs the appropriate seed function for the specified environment
4. It tracks statistics about how many seeds were run, skipped, or failed
5. If any critical seeds fail (like auth), the script will exit with an error

### Priority System

Seeds are executed in order of priority, with higher priority seeds running first. This ensures that dependencies between modules are handled correctly (e.g., users must be created before orders that reference them).

The priority system works as follows:

1. Each seed module can specify a priority when registering (higher number = higher priority)
2. If no priority is specified, default priorities are used for common modules
3. Modules with the same priority are processed in no particular order
4. Default priorities are:
   - Auth: 100 (highest priority, runs first)
   - Category: 80
   - Cart: 60
   - Order: 50
   - User Profile: 40
   - Template API: 20

## Creating Seed Files

Seed files should be placed in the appropriate API module directory and follow these conventions:

1. Name the file `seeds.ts` or `seed.ts` or with a `.seed.ts` or `.seeds.ts` extension
2. Export functions named `dev`, `test`, and `prod` for the respective environments
3. Register the seed functions with the seed manager using `registerSeed`
4. Specify a priority value to control execution order (higher number = higher priority)

Example:

```typescript
import { registerSeed } from "next-vibe/server/db/seed-manager";
import { cliDebugLogger } from "next-vibe/shared/utils/logger";

// Export functions for each environment
export async function dev(): Promise<void> {
  cliDebugLogger("🌱 Seeding data for development environment");
  // Create development data
}

export async function test(): Promise<void> {
  cliDebugLogger("🌱 Seeding data for test environment");
  // Create test data
}

export async function prod(): Promise<void> {
  cliDebugLogger("🌱 Seeding data for production environment");
  // Create production data
}

// Register seeds with priority (higher number = higher priority)
registerSeed(
  "my-module",
  {
    dev,
    test,
    prod,
  },
  50 // Priority value - determines execution order
);
```

## Seed Generation

The build process automatically discovers and generates imports for all seed files using the `generate-seeds.ts` script. This script:

1. Scans the `src/app/api` directory for files matching the seed naming conventions
2. Generates a consolidated `seeds.ts` file in `src/app/api/generated/`
3. This generated file is then imported by the seed scripts

To regenerate the seeds file, run:

```bash
yarn build:seeds
```

## Production Readiness

For production environments:

1. Only essential seed data should be created
2. Sensitive data should be properly secured
3. The admin user is always created to ensure system access
4. Error handling is robust to prevent partial seeding
5. The seeding system automatically checks if the database is properly set up and runs migrations if needed

## Dependency Management

The priority system is designed to handle dependencies between modules. When designing your seed files:

1. Assign higher priorities to modules that create data needed by other modules
2. Consider the natural dependencies in your data model (e.g., users → orders → payments)
3. Use the default priorities as a guide for common modules
4. Test your seeds to ensure they run in the correct order

## Troubleshooting

If you encounter issues with seeding:

1. Check the console output for specific error messages
2. Ensure your database is running and accessible
3. Verify that your seed files are properly structured
4. Check that your seed priorities are set correctly
5. Run migrations before seeding to ensure tables exist
6. Look for duplicate data issues (the seeding system tries to handle these automatically)
7. Check for circular dependencies between seed modules

## Drizzle Studio

Drizzle Studio provides a web-based interface for database management and visualization. It allows you to:

- Browse and edit database tables
- Visualize database schema and relationships
- Execute SQL queries
- Monitor database performance
- Manage database data through a user-friendly interface

### Studio Usage

```bash
# Launch Drizzle Studio with default settings
vibe studio

# Launch on a custom port
vibe studio --port 5000

# Launch on a custom host
vibe studio --host localhost

# Enable verbose logging
vibe studio --verbose

# Using aliases
vibe db:studio
vibe drizzle:studio
```

### Studio Options

- `--port` or `-p`: Port to run Drizzle Studio on (default: 4983)
- `--host` or `-h`: Host to bind Drizzle Studio to (default: 0.0.0.0)
- `--verbose` or `-v`: Enable verbose logging

### Requirements

- Drizzle Studio requires a `drizzle.config.ts` file in your project root
- The database must be running and accessible
- Drizzle Kit must be installed (already included in this project)

### Accessing the Interface

Once started, Drizzle Studio will be available at:

- Default: `http://0.0.0.0:4983`
- Custom: `http://<host>:<port>`

The interface will automatically open in your default browser. Press `Ctrl+C` to stop the studio server.
