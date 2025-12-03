# Contributing to NextVibe

Thank you for your interest in contributing to NextVibe! This document provides guidelines for contributing to the framework.

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

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Start Development

```bash
vibe dev
```

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

1. **Follow existing patterns**
   - Check similar implementations
   - Read relevant documentation
   - Follow file structure conventions

2. **Run vibe check frequently**

   ```bash
   vibe check src/path/to/your/changes
   ```

3. **Write tests for new features**

   ```typescript
   // my-feature/route.test.ts
   describe("My Feature", () => {
     it("should work correctly", async () => {
       // Test implementation
     });
   });
   ```

### Before Committing

1. **Run full validation**

   ```bash
   vibe check   # Must pass with 0 errors, 0 warnings
   vibe test    # All tests must pass
   ```

2. **Add translations** (if user-facing)
   - Add to `i18n/en/index.ts`
   - Copy to `i18n/de/index.ts`
   - Copy to `i18n/pl/index.ts`

3. **Update documentation** (if needed)
   - Update relevant docs
   - Add examples if helpful

4. **Commit with clear message**

   ```bash
   git add .
   git commit -m "feat: Add user profile export feature"
   # or
   git commit -m "fix: Correct translation key path in login"
   ```

---

## 📏 Code Standards

### Required Patterns

1. **Types from definition.ts ONLY**

   ```typescript
   // ✅ GOOD
   import type { PostRequestOutput } from "./definition";

   // ❌ BAD
   interface MyType { ... }  // Don't manually define types
   ```

   See **[docs/development/quality-standards.md](./docs/development/quality-standards.md)** for detailed type rules.

2. **Use translation keys everywhere**

   ```typescript
   // ✅ GOOD
   t("app.api.user.login.title")

   // ❌ BAD
   <h1>Login</h1>  // No hardcoded strings
   ```

3. **Logger as parameter**

   ```typescript
   // ✅ GOOD
   async function create(data, user, locale, logger: EndpointLogger) {
     logger.info("Creating user");
   }

   // ❌ BAD
   async function create(data, user, locale) {
     const logger = createEndpointLogger(...);  // Don't create in repositories
   }
   ```

4. **Return ResponseType**

   ```typescript
   // ✅ GOOD
   return success({ userId: "123" });

   // ❌ BAD
   return { userId: "123" }; // Not type-safe
   ```

### Forbidden Patterns

- ❌ **Type assertions** (`as`, `!`, `<Type>`)
- ❌ **@ts-ignore** or **@ts-expect-error**
- ❌ **console.log** (use logger)
- ❌ **Hardcoded strings** (use translation keys)
- ❌ **Type guards** (fix schema instead)

### File Structure

Follow the standard endpoint structure:

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

### All Contributions Must

1. **Pass vibe check**

   ```bash
   vibe check
   # Must show: ✓ 0 errors, 0 warnings
   ```

2. **Pass all tests**

   ```bash
   vibe test
   # All tests must pass
   ```

3. **Include tests for new features**

   ```typescript
   // route.test.ts
   describe("New feature", () => {
     it("should work as expected", async () => {
       // Test implementation
     });
   });
   ```

---

## 📝 Commit Message Format

Use conventional commits:

```
feat: Add user export functionality
fix: Correct translation key in login form
docs: Update endpoint anatomy guide
refactor: Simplify repository interface
test: Add tests for user creation
chore: Update dependencies
```

**Format:**

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

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

**Example PR description:**

````markdown
## Summary

Add user profile export feature

## Motivation

Users requested ability to export their profile data

## Changes

- Added `/api/[locale]/user/private/export` endpoint
- Added export format options (JSON, CSV)
- Added tests for export functionality
- Added translations (en, de, pl)

## Testing

```bash
vibe check  # Passes
vibe test   # All pass
vibe user:private:export --format=json  # Works
```
````

## Checklist

- [x] Code follows patterns
- [x] Tests added and passing
- [x] Documentation updated
- [x] Translations added
- [x] vibe check passes

```

### 3. Review Process

Your PR will be reviewed for:
- **Code quality** - Follows framework patterns
- **Type safety** - No workarounds or type assertions
- **Testing** - Adequate test coverage
- **Documentation** - Clear and complete
- **Translations** - All languages included

### 4. Address Feedback

- Respond to review comments
- Make requested changes
- Push updates to your branch
- Re-request review when ready

---

## 🎯 Contribution Areas

### High Priority

**Missing Documentation:**
- Deployment guides
- Security best practices
- Performance optimization
- Migration guides

**Framework Improvements:**
- Better error messages
- More CLI commands
- Additional validators
- Enhanced type inference

**Testing:**
- Increase test coverage
- Add integration tests
- Add E2E tests

### Medium Priority

**Examples:**
- More example endpoints
- Example applications
- Tutorial content

**Tooling:**
- Developer experience improvements
- Build optimizations
- CLI enhancements

### Future

**React Native Support (Milestone 3):**
- Platform resolution
- Native polyfills
- Component parity

**Component Colocation (Milestone 4):**
- UI in API folders
- Auto-generated forms
- Page composition

---

## 📚 Resources

**Documentation:**
- [Core Concepts](docs/core-concepts/) - Framework fundamentals
- [Development Guide](docs/development/) - Development patterns
- [Testing Guide](docs/development/testing-guide.md) - Writing tests
- [Debugging Guide](docs/development/debugging-guide.md) - Debugging tips

**Code Quality:**
- [Codebase Quality Control](docs/development/quality-standards.md) - Quality standards
- [Agent Validators](.claude/agents/) - Pattern validators

**Community:**
- [GitHub Discussions](https://github.com/techfreaque/next-vibe/discussions) - Ask questions
- [GitHub Issues](https://github.com/techfreaque/next-vibe/issues) - Report bugs

---

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** - Treat everyone with respect
- **Be constructive** - Provide helpful feedback
- **Be collaborative** - Work together toward solutions
- **Be patient** - Remember everyone is learning

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Unprofessional conduct

### Enforcement

Violations may result in:
- Warning
- Temporary ban
- Permanent ban

Report issues to: max@a42.ch

---

## 📄 License

By contributing, you agree that your contributions will be licensed under:
- **GPL-3.0** for framework core (`src/app/api/[locale]/` and `src/packages/`)
- **MIT** for everything else

See [LICENSE](LICENSE) and [src/packages/LICENSE](src/packages/LICENSE) for details.

---

## ❓ Questions?

- **Documentation issues?** Open an issue
- **Need help?** Ask in discussions
- **Have questions?** Email max@a42.ch

---

**Thank you for contributing to NextVibe!** 🎉

Every contribution, no matter how small, helps make NextVibe better for everyone.
```
