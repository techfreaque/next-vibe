# Campaign Starter Module

This module contains all functionality related to starting lead campaigns.

## Overview

The Campaign Starter is responsible for:

- Transitioning leads from `NEW` to `PENDING` status
- Setting initial campaign stage to `NOT_STARTED`
- Distributing leads evenly across enabled day hours
- Handling failed lead rebalancing
- Processing leads based on weekly quotas per locale

## Files

The campaign starter is organized into modular files:

- **`campaign-starter.cron.ts`** - Main cron task definition and execution
- **`types.ts`** - TypeScript types and Zod schemas
- **`config.ts`** - Environment-specific configurations
- **`distribution.ts`** - Lead distribution calculation logic
- **`rebalancing.ts`** - Failed lead rebalancing functionality
- **`processor.ts`** - Lead processing and status updates
- **`README.md`** - This documentation

## Configuration

The campaign starter uses the following configuration:

```typescript
{
  dryRun: boolean,                    // Test mode without actual changes
  minAgeHours: number,               // Minimum age before processing leads
  enabledDays: number[],             // Days of week (1=Monday, 7=Sunday)
  enabledHours: { start, end },      // Hours of day (UTC)
  leadsPerWeek: Record<CountryLanguage, number>, // Weekly quotas per locale (e.g., "en-GLOBAL", "de-DE")
  cronFrequencyMinutes: number,      // How often cron runs (default: 3)
}
```

## Scheduling

### Production Environment

- **Frequency**: Every 3 minutes during business hours
- **Schedule**: Monday-Friday, 7-15 UTC
- **Weekly Quotas**: "en-GLOBAL": 100, "de-DE": 50, "pl-PL": 30

### Non-Production Environment (Testing)

- **Frequency**: Every 1 minute, always running
- **Schedule**: All days, all hours (0-23 UTC)
- **Weekly Quotas**: "en-GLOBAL": 10, "de-DE": 5, "pl-PL": 3 (smaller for testing)
- **Distribution**: Evenly across all enabled time slots

## Failed Lead Rebalancing

The system automatically handles failed leads (BOUNCED, INVALID, UNSUBSCRIBED) by:

1. Counting failed leads from current week
2. Adding them to the current run's quota
3. Marking them as processed to prevent double-counting

## Dependencies

- `../db` - Lead database schema
- `../enum` - Lead status and campaign stage enums
- `@/app/api/cron/*` - Cron task framework
