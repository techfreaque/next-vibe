# Contributing to vibe-check

Thank you for your interest in contributing to vibe-check! This document provides guidelines for contributing to the code quality checker.

---

## 🎯 Ways to Contribute

- **Bug Reports** - Report issues you encounter
- **Feature Requests** - Suggest new checker features or rules
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve docs
- **Plugin Development** - Create custom Oxlint plugins
- **Community Support** - Help others in discussions

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/next-vibe.git
cd next-vibe

# Checkout the vibe-check branch
git checkout vibe-check
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Build the Project

```bash
bun vibe builder
```

### 4. Test Your Setup

```bash
# Run vibe-check on itself
bun vibe check

# Test MCP server
bun run mcp:test
```

---

## 📋 Development Workflow

### Before Making Changes

1. **Create a feature branch from `vibe-check`**
   ```bash
   git checkout vibe-check
   git pull origin vibe-check
   git checkout -b feature/my-feature
   ```

2. **Ensure everything works**
   ```bash
   bun vibe check  # Must pass with 0 errors
   ```

### While Developing

1. **Follow existing patterns** - Check similar implementations in:
   - `src/app/api/[locale]/system/check/` - Check endpoints
   - `oxlint-plugins/` - Custom Oxlint plugins
   - `check.config.ts` - Configuration format

2. **Run vibe check frequently** - Catch issues early
   ```bash
   bun vibe check
   ```

3. **Test MCP integration** - If changing MCP tools
   ```bash
   bun run mcp:test
   ```

### Before Committing

1. **Run full validation**

   ```bash
   bun vibe check --fix  # Auto-fix issues
   bun vibe check        # Must pass with 0 errors, 0 warnings
   ```

2. **Test the build**
   ```bash
   bun vibe builder
   ```

3. **Commit with clear message** (see [Commit Format](#commit-message-format))

---

## 📏 Code Standards

### Key Areas to Know

- **Check Endpoints** (`src/app/api/[locale]/system/check/`)
  - Each checker has a `definition.ts`, `repository.ts`, and `route.ts`
  - Follow the existing pattern for consistency

- **Custom Oxlint Plugins** (`oxlint-plugins/`)
  - Written in TypeScript, compiled to JS
  - Follow Oxlint plugin API patterns

- **Configuration** (`check.config.ts`)
  - Maintain backward compatibility
  - Document all new options

- **MCP Integration** (`src/app/api/[locale]/system/unified-interface/mcp/`)
  - Ensure tools are properly exposed
  - Test with MCP inspector

### Required Practices

✅ **Do:**
- Use TypeScript strictly (no `any` types)
- Add translation keys for user-facing messages
- Pass logger to repository methods
- Return structured response types
- Test your changes thoroughly

❌ **Don't:**
- Use `@ts-ignore` or type assertions
- Add `console.log` (use logger instead)
- Hardcode error messages
- Break existing CLI commands
- Change MCP tool signatures without versioning

---

## 🧪 Testing Requirements

All contributions must:

1. **Pass vibe check** - `bun vibe check` shows 0 errors, 0 warnings
2. **Build successfully** - `bun vibe builder` completes without errors
3. **Work via CLI** - Test relevant `vibe check` commands
4. **Work via MCP** - Test with MCP inspector (if MCP-related)

### Testing Checklist

```bash
# 1. Code quality
bun vibe check

# 2. Build
bun vibe builder

# 3. CLI functionality
bun vibe check
bun vibe check --fix
bun vibe check src/

# 4. MCP (if applicable)
bun run mcp:test
```

---

## 📝 Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(oxlint): add new i18n rule for component props
fix(typecheck): handle monorepo tsconfig correctly
docs(readme): update MCP setup instructions
refactor(vibe-check): improve error aggregation
test(lint): add tests for import sorting
chore: update oxlint dependency to 1.35.0
```

**Scope examples:**
- `oxlint` - Oxlint checker
- `lint` - ESLint checker
- `typecheck` - TypeScript checker
- `vibe-check` - Main vibe-check command
- `mcp` - MCP server integration
- `config` - Configuration handling
- `cli` - CLI interface

---

## 🔍 Pull Request Process

### 1. Push Your Branch

```bash
git push origin feature/my-feature
```

### 2. Create Pull Request

**Target Branch:** `vibe-check`

**Include in PR description:**
- **What** - Summary of changes
- **Why** - Problem being solved or feature being added
- **How** - Technical approach taken
- **Testing** - How you tested the changes
- **Screenshots/Examples** - If applicable (CLI output, MCP responses)
- **Breaking Changes** - If any

**Example:**

```markdown
## What
Adds support for checking specific file patterns in vibe-check

## Why
Users want to check only certain file types without creating config files

## How
- Added `--pattern` flag to CLI
- Extended repository to accept glob patterns
- Updated MCP tool signature

## Testing
- Tested with various glob patterns
- Verified MCP integration
- All checks pass

## Breaking Changes
None
```

### 3. Review Process

Your PR will be reviewed for:
- **Code quality** - Follows TypeScript and framework patterns
- **Performance** - No performance regressions
- **Compatibility** - Works with existing configs
- **MCP compliance** - MCP tools work correctly
- **Documentation** - Changes are documented

---

## 🔌 Adding New Features

### Adding a New Checker

1. Create directory: `src/app/api/[locale]/system/check/my-checker/`
2. Add `definition.ts` - Define endpoint contract
3. Add `repository.ts` - Implement checker logic
4. Add `route.ts` - Wire up HTTP handler
5. Add translations in `i18n/` subdirectories
6. Register in `src/app/api/[locale]/system/generated/endpoints.ts`
7. Test via CLI and MCP

### Adding an Oxlint Plugin

1. Create `oxlint-plugins/my-plugin.ts`
2. Follow existing plugin structure
3. Add configuration to `check.config.ts`
4. Document the rules
5. Test thoroughly

### Extending Configuration

1. Update `CheckConfig` type
2. Add to `check.config.ts` example
3. Handle backward compatibility
4. Document in README

---

## 📚 Resources

**Essential Documentation:**
- [README.md](README.md) - Main documentation
- [check.config.ts](check.config.ts) - Configuration reference
- [Oxlint Documentation](https://oxc.rs/docs/guide/usage/linter.html)
- [MCP Specification](https://modelcontextprotocol.io/)

**Community:**
- [GitHub Discussions](https://github.com/techfreaque/next-vibe/discussions)
- [GitHub Issues](https://github.com/techfreaque/next-vibe/issues)
- **Email**: max@a42.ch

---

## 📦 Package Publishing

Only maintainers can publish. The package is published as `@next-vibe/checker`:

```bash
# Build and test
bun vibe builder
bun vibe check

# Publish (maintainers only)
npm publish --access public
```

---

## 📄 License

By contributing, you agree that your contributions will be licensed under GPL-3.0-only.

See [LICENSE](LICENSE) for details.

---

**Thank you for contributing to vibe-check!** 🎉

Every contribution helps make code quality checking better for the TypeScript ecosystem.
