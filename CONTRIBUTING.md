# Contributing to NextVibe

Thank you for your interest in contributing to NextVibe! This document provides essential guidelines for contributing to the framework.

---

## 🎯 Ways to Contribute

- **Bug Reports** - Report issues you encounter
- **Feature Requests** - Suggest new features
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve docs
- **Examples** - Share example implementations
- **Community Support** - Help others in discussions

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
```

### 2. Install and Setup

```bash
bun install
cp .env.example .env
# Edit .env with your values
```

### 3. Start Development

```bash
vibe dev
```

**📚 See [Quick Start Guide](docs/guides/quickstart.md) for detailed setup instructions.**

### Windows: hundreds of files showing as "modified" with no real diff

This repo enforces LF line endings via `.gitattributes` (`* text=auto eol=lf`), which overrides
`core.autocrlf` for every path — fresh clones are unaffected. But if you cloned before this rule
existed, or your local index still has CRLF-normalized blobs, `git status` can show hundreds of
files as modified even though `git diff` shows no actual content change. Fix once, locally:

```bash
git config core.autocrlf false
git add --renormalize .
git status   # should now only show files you actually changed
```

This only touches your local git config and index — no working tree file content changes.

---

## 📋 Development Workflow

### Before Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

2. **Ensure everything works**
   ```bash
   vibe check  # Must pass with 0 errors
   vibe test   # All tests must pass
   ```

### While Developing

1. **Follow existing patterns** - Check similar implementations in the codebase
2. **Run vibe check frequently** - Catch issues early
3. **Write tests for new features** - Maintain code quality

### Before Committing

1. **Run full validation**

   ```bash
   vibe check   # Must pass with 0 errors, 0 warnings
   vibe test    # All tests must pass
   ```

2. **Add translations** (if user-facing) - See [i18n Patterns](docs/patterns/i18n.md)
3. **Update documentation** (if needed)
4. **Commit with clear message** (see [Commit Format](#commit-message-format))

---

## 📏 Code Standards

**CRITICAL**: Before contributing, read these pattern guides:

- **[Endpoint Definitions](docs/patterns/definition.md)** - How to define APIs
- **[Database Patterns](docs/patterns/database.md)** - Drizzle ORM and schemas
- **[i18n Patterns](docs/patterns/i18n.md)** - Type-safe translations
- **[Logger Patterns](docs/patterns/logger.md)** - Proper logging
- **[Email Patterns](docs/patterns/email.md)** - React Email templates
- **[Enum Patterns](docs/patterns/enum.md)** - Enum best practices
- **[Seed Patterns](docs/patterns/seeds.md)** - Database seeding
- **[Task Patterns](docs/patterns/tasks.md)** - Cron jobs

### Quick Rules

✅ **Required:**

- Use types from `definition.ts` only (never manual type definitions)
- Use translation keys everywhere (no hardcoded strings)
- Pass logger as parameter to repositories
- Return `ResponseType` from all repository methods
- Add `"server-only"` import to repository files

❌ **Forbidden:**

- Type assertions (`as`, `!`, `<Type>`)
- `@ts-ignore` or `@ts-expect-error`
- `console.log` (use logger instead)
- Hardcoded strings (use translation keys)
- Type guards (fix schema instead)

### File Structure

```
my-endpoint/
├── definition.ts    # API contract
├── repository.ts    # Business logic
├── route.ts         # Handler wiring
├── hooks.ts         # React hooks (optional)
├── db.ts            # Database schema (optional)
├── enum.ts          # Enums (optional)
├── route.test.ts    # Tests (optional)
└── i18n/            # Translations (optional)
    ├── en/index.ts
    ├── de/index.ts
    └── pl/index.ts
```

---

## 🧪 Testing Requirements

All contributions must:

1. **Pass vibe check** - `vibe check` shows 0 errors, 0 warnings
2. **Pass all tests** - `vibe test` passes
3. **Include tests for new features** (if applicable)

---

## 📝 Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add user export functionality
fix: Correct translation key in login form
docs: Update endpoint anatomy guide
refactor: Simplify repository interface
test: Add tests for user creation
chore: Update dependencies
```

---

## 🔍 Pull Request Process

### 1. Push Your Branch

```bash
git push origin feature/my-feature
```

### 2. Create Pull Request

**Include in PR description:**

- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots (if UI changes)
- Related issues (if any)

### 3. Review Process

Your PR will be reviewed for:

- **Code quality** - Follows framework patterns
- **Type safety** - No workarounds or type assertions
- **Testing** - Adequate test coverage
- **Documentation** - Clear and complete
- **Translations** - All languages included

---

## 📚 Resources

**Essential Documentation:**

- [Quick Start](docs/guides/quickstart.md) - Get up and running
- [Debugging Guide](docs/guides/debugging.md) - Debugging tips
- [All Patterns](docs/patterns/) - Complete pattern documentation
- [Unbottled.ai Example](docs/examples/unbottled-ai/UNBOTTLED_AI.md) - Reference application

**Community:**

- [GitHub Discussions](https://github.com/techfreaque/next-vibe/discussions) - Ask questions
- [GitHub Issues](https://github.com/techfreaque/next-vibe/issues) - Report bugs
- **Email**: max@a42.ch

---

## 📄 License

By contributing, you agree that your contributions will be licensed under:

- **GPL-3.0** for framework core (`src/vibe/` and `src/packages/`)
- **MIT** for everything else

See [LICENSE](LICENSE) for details.

---

**Thank you for contributing to NextVibe!** 🎉

Every contribution, no matter how small, helps make NextVibe better for everyone.
