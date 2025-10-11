# Drizzle Migrations

This directory contains database migrations managed by Drizzle ORM.

## Directory Structure

- `/` - Migration SQL files
- `/meta` - Migration metadata
  - `_journal.json` - Migration journal tracking applied migrations

## Commands

- Generate migrations: `vibe drizzle:generate`
- Run migrations: `vibe drizzle:migrate`

For more information, see the [Drizzle ORM documentation](https://orm.drizzle.team/docs/migrations).
