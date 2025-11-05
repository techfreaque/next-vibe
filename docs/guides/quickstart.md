# Quick Start

5-minute getting started guide.

## Main Scripts

```bash
# Development
vibe dev              # Start Next.js + auto-generation + tRPC
bun run dev           # Alternative

# Database
vibe db:migrate       # Run migrations
vibe db:seed          # Seed test data
vibe db:studio        # Open Drizzle Studio GUI
vibe db:reset         # Drop + migrate + seed
vibe db:ping          # Check connection

# Code Quality
vibe check            # Type checking and linting
vibe check src/path   # Check specific folder
vibe lint             # Linting only
vibe typecheck        # Type checking only
vibe test             # Run tests

# Build
vibe build            # Production build
vibe start            # Start production server

# React Native
bun native            # Start Expo dev server
bun native:android    # Run on Android
bun native:ios        # Run on iOS
bun native:reset      # Clear cache and start
```

### TODO: Complete Quick Start Guide

This document needs expansion with:

- [ ] Prerequisites (Node, Bun, Docker)
- [ ] Clone and install steps
- [ ] Environment setup (.env configuration)
- [ ] Database handling links
- [ ] First endpoint creation tutorial
- [ ] page creation tutorial link
- [ ] troubleshooting links
