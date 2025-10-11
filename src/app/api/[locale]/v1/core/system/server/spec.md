# Server System Specification

## Overview

The Server System provides unified server management capabilities for development, production, and build environments. It integrates with the task system, database management, and provides comprehensive server lifecycle management.

## Architecture

### Core Components

1. **Development Server** (`dev/`)
   - Hot reload development environment
   - Integrated task runner
   - Database setup and migrations
   - Real-time logging and monitoring

2. **Production Server** (`start/`)
   - Production-optimized server startup
   - Task runner for production workloads
   - Health checks and monitoring
   - Graceful shutdown handling

3. **Build System** (`build/`)
   - Application build process
   - Asset optimization
   - Production bundle generation
   - Build validation

## Subdomain Structure

Each server type follows the standard subdomain pattern:

```
server/
├── dev/
│   ├── definition.ts    # Development server configuration
│   ├── repository.ts    # Development server logic
│   └── route.ts         # CLI endpoint
├── start/
│   ├── definition.ts    # Production server configuration
│   ├── repository.ts    # Production server logic
│   └── route.ts         # CLI endpoint
└── build/
    ├── definition.ts    # Build configuration
    ├── repository.ts    # Build logic
    └── route.ts         # CLI endpoint
```

## CLI Commands

```bash
# Development server (NODE_ENV=development)
vibe dev                    # Start development server with hot reload, seeding, full task support
vibe dev --port=3001        # Custom port
vibe dev --skipDbSetup=true # Skip database setup

# Production server (NODE_ENV=production)
vibe start                  # Start production server with migrations, side task support
vibe start --port=3000      # Custom port
vibe start --env=staging    # Environment override

# Build system
yarn build                  # Build application and run production migrations
```

**Important**: `vibe dev` and `vibe start` run the same server with different NODE_ENV:

- `vibe dev`: Development environment with seeding, hot reload, debug logging
- `vibe start`: Production environment with optimizations, production logging

## Development Server Features

### Core Functionality

- Next.js development server with hot reload
- Integrated task runner (development environment)
- Database connection and health checks
- Real-time log streaming
- File watching and auto-restart

### Configuration Options

- `port`: Server port (default: 3000)
- `skipDbSetup`: Skip database initialization
- `skipNextCommand`: Skip Next.js server startup
- `enableTaskRunner`: Enable/disable task runner (default: true)
- `logLevel`: Logging verbosity

### Integration Points

- **Task System**: Starts unified task runner in development mode
- **Database**: Runs migrations and seeding
- **Monitoring**: Health checks and status reporting

## Production Server Features

### Core Functionality

- Optimized Next.js production server
- Task runner for production workloads
- Health monitoring and metrics
- Graceful shutdown handling
- Process management

### Configuration Options

- `port`: Server port (default: 3000)
- `env`: Environment override
- `workers`: Number of worker processes
- `enableTaskRunner`: Enable/disable task runner (default: true)
- `healthCheckInterval`: Health check frequency

### Production Optimizations

- Process clustering
- Memory management
- Performance monitoring
- Error tracking and reporting

## Build System Features

### Core Functionality

- Next.js application build
- Asset optimization and minification
- Bundle analysis and reporting
- Build validation and testing

### Configuration Options

- `analyze`: Generate bundle analysis
- `clean`: Clean previous builds
- `target`: Build target (server, static, etc.)
- `optimization`: Optimization level

### Build Outputs

- Optimized application bundle
- Static assets
- Build reports and metrics
- Deployment artifacts

## Database Integration

### Development Environment

```typescript
// Automatic database setup
await runMigrations();
await seedDatabase();
await validateSchema();
```

### Production Environment

```typescript
// Production database checks
await validateConnection();
await checkMigrationStatus();
await healthCheck();
```

## Task Runner Integration

### Development Mode (`vibe dev`)

- Runs all tasks including development-specific ones
- Hot reload for task changes
- Debug logging enabled
- **Full side task support** - long-running background tasks

### Production Mode (`vibe start`)

- Filtered task set (excludes development tasks)
- Optimized scheduling
- Production logging
- **Full side task support** - long-running background tasks

### Serverless Mode (Vercel)

- **Only cron tasks supported** via `task.ts` files
- **No side task support** (no long-running processes)
- Tasks executed via pulse route triggered by Vercel cron (once per minute)
- Stateless execution environment

**Critical Distinction**:

- **Production servers** (`vibe start`): Support both cron tasks and side tasks
- **Serverless platforms** (Vercel): Only support cron tasks via pulse route

## Error Handling

### Development Server

- Detailed error messages
- Stack traces
- Hot reload on error fix
- Development-friendly logging

### Production Server

- Sanitized error responses
- Error tracking and reporting
- Graceful degradation
- Production logging

## Monitoring and Health Checks

### Health Endpoints

- `/api/health` - Basic health check
- `/api/health/detailed` - Comprehensive status
- `/api/health/tasks` - Task runner status
- `/api/health/database` - Database connectivity

### Metrics Collection

- Server uptime
- Request/response metrics
- Task execution statistics
- Database performance
- Memory and CPU usage

## Environment Configuration

### Development

```typescript
{
  environment: "development",
  hotReload: true,
  taskRunner: {
    enabled: true,
    sideTasks: true,
    debugLogging: true
  },
  database: {
    autoMigrate: true,
    autoSeed: true
  }
}
```

### Production Server (`vibe start`)

```typescript
{
  environment: "production",
  clustering: true,
  taskRunner: {
    enabled: true,
    sideTasks: true, // Full support on production servers
    optimizedScheduling: true
  },
  database: {
    connectionPooling: true,
    healthChecks: true
  }
}
```

### Serverless (Vercel)

```typescript
{
  environment: "serverless",
  taskRunner: {
    enabled: true,
    sideTasks: false, // No long-running processes
    pulseOnly: true,  // Only pulse route execution
    cronInterval: "* * * * *" // Vercel triggers once per minute
  },
  database: {
    connectionPooling: true,
    stateless: true
  }
}
```

## Security Considerations

### Development

- Local development only
- Debug information exposed
- Relaxed CORS policies

### Production

- Secure headers
- Rate limiting
- Input validation
- Audit logging

## Performance Requirements

### Development

- Fast startup time (< 10 seconds)
- Hot reload (< 2 seconds)
- Memory efficient

### Production

- High availability (99.9% uptime)
- Low latency (< 100ms response)
- Scalable architecture

## Command Consistency

The server commands remain the same as the legacy CLI:

- `vibe dev` - Development server (unchanged)
- `vibe start` - Production server (unchanged)
- `yarn build` - Build system (unchanged)

The underlying implementation now uses the unified server system architecture while preserving all existing functionality and command interfaces.
