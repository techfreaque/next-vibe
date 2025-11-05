# Debugging Guide

> **Part of NextVibe Framework** (GPL-3.0) - Debugging techniques and troubleshooting

**Fix issues faster with the right tools.**

---

## Overview

**Primary debugging tools:**
- `vibe check` - Type and lint errors
- EndpointLogger - logging across server/client enable debug via src/config/debug.ts
- Chrome DevTools MCP - Client-side debugging
- CLI testing - Endpoint verification

---

## 1. Type Errors

**Always run `vibe check` first:**

```bash
vibe check                    # Entire codebase
vibe check src/path/to/file   # Specific file/folder
```

**Common Issues:**

```typescript
// "Property doesn't exist"
const name = user.firstName; // ❌ Error
const name = user.publicName; // ✅ Check actual schema in db.ts

// "Type 'X' is not assignable to type 'Y'"
const role = "ADMIN"; // ❌ Error
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
const role = UserRole.ADMIN; // ✅ Use proper enum

// "Possibly undefined"
const userId = response.data.userId; // ❌ Error
if (response.success) {
  const userId = response.data.userId; // ✅ Type-safe
}
```

---

## 2. Translation Errors

**Error:** `Argument of type '"app.user.login.title"' is not assignable to type 'TranslationKey'`

**Debug Steps:**

1. Find i18n file location: `src/app/api/[locale]/v1/core/user/public/login/i18n/en/index.ts`
2. Build correct key from path:
   - Path: `app/api/[locale]/v1/core/user/public/login`
   - Remove `[locale]`: `app/api/v1/core/user/public/login`
   - Replace `/` with `.`: `app.api.v1.core.user.public.login.title`
3. Verify key exists in all language files
4. Run `vibe check` - error disappears if fixed

See [I18n Structure Rules](i18n-structure-rules.md) for complete guide.

---

## 3. Endpoint Errors

**Test endpoints via CLI:**

```bash
vibe --help                                        # List all endpoints
vibe user:public:login --email="test@test.com" --password="pass123"
vibe user:create --name="Test" --verbose          # Detailed errors
```

**Common Issues:**

**"Endpoint not found" (404)**
1. Check folder structure: `/api/en-GLOBAL/v1/core/user/create` → `src/app/api/[locale]/v1/core/user/create/route.ts`
2. Verify exports: `export const { POST } = endpointsHandler({ ... });`
3. Check path array: `path: ["v1", "core", "user", "create"]` matches folders

**"Validation failed" (Zod errors)**
1. Check schema in `definition.ts`: `email: requestDataField({}, z.string().email())`
2. Test with CLI: `vibe user:create --email="invalid" --name="Test"`
3. Fix request data to match schema

**"Unauthorized" (401/403)**
1. Check `allowedRoles` in definition: `allowedRoles: [UserRole.ADMIN]`
2. Verify JWT: `logger.debug("User role", { role: user.role });`
3. Test with correct user role

---

## 4. Database Errors

**Connection:**
```bash
vibe db:status              # Check database
docker ps | grep postgres   # If using Docker
```

**Migrations:**
```bash
vibe migrate:status         # Check pending
vibe migrate                # Run migrations
vibe migrate:generate       # Regenerate after schema changes
```

**Query Debugging:**
```typescript
logger.debug("Query params", { userId: user.id });
const result = await db.query.users.findFirst({ where: eq(users.id, user.id) });
logger.debug("Query result", { found: !!result });
```

---

## 5. Logger Debugging

**Server-Side:**

```typescript
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

async function processData(data, user, locale, logger: EndpointLogger) {
  logger.info("Processing started", { userId: user.id });
  try {
    const result = await doSomething(data);
    logger.info("Processing complete", { resultId: result.id });
    return createSuccessResponse(result);
  } catch (error) {
    logger.error("Processing failed", error, { data });
    return createErrorResponse(...);
  }
}
```

**Client-Side:**

```typescript
const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);
const handleClick = () => logger.debug("Button clicked", { timestamp: Date.now() });
```

**Log Levels:** `debug()` (dev only), `info()` (important events), `warn()` (warnings), `error()` (failures), `vibe()` (CLI/framework)

---

## 6. React Errors

**Hook Errors:**

```typescript
// "Rendered more hooks than previous render" - DON'T use hooks conditionally
// ❌
if (condition) { const { data } = useQuery(); }

// ✅
const { data } = useQuery();
if (condition && data) { /* Use data */ }

// "Cannot update component while rendering" - DON'T setState during render
// ❌
function Component() { setState(newValue); return <div>...</div>; }

// ✅
function Component() {
  useEffect(() => { setState(newValue); }, []);
  return <div>...</div>;
}
```

**Form Debugging:**

```typescript
const { form } = useApiForm(definition, logger);
console.log("Values:", form.watch());
console.log("Errors:", form.formState.errors);
```

---

## 7. Build Errors

```bash
vibe check # Fix all type/lint errors
rm -rf .next node_modules/.cache && vibe build  # Clean rebuild
```

**Import Paths:**

```typescript
import { Button } from "../../components/ui/button"; // ❌ Relative
import { Button } from "@/path/to/button";                // ✅ Use alias
```

---

## 8. Common Issues

- **"Module not found"** → Check file exists, verify import path, check tsconfig.json paths, restart dev server
- **"Infinite loop/re-renders"** → Check useEffect dependencies: `useEffect(() => setState(value), [dependency])` not `useEffect(() => setState(value))`
- **"CORS errors"** → Verify API route in `/api` folder, check headers, check environment config
- **"Hydration mismatch"** → Ensure server/client render same HTML, avoid `Date.now()` during render, use `useEffect` for client-only code

```typescript
// Hydration fix example
// ❌ Different on server/client
const time = Date.now();

// ✅ Client-only
const [time, setTime] = useState<number>();
useEffect(() => { setTime(Date.now()); }, []);
```

---

## 9. Debug Workflow

1. Run `vibe check` and fix all type/lint errors (no workarounds, no type assertions)
2. Test via CLI: `vibe endpoint:name --param=value`
3. Add logging: `logger.debug("Step 1", { data })`
4. Check logs: server (terminal), client (browser console), database (Drizzle Studio)
5. Verify fix: `vibe check && vibe test`

---

## 10. Tools Reference

**Development:** `vibe check` (type/lint), `vibe test` (tests), `vibe studio` (DB GUI), `vibe --help` (commands)
**Browser DevTools:** Console (logs), Network (API), React DevTools (state), Sources (breakpoints)
**VS Code:** oxlint, TypeScript, Drizzle extensions

---

## Next Steps

- [Testing Guide](testing-guide.md) - Write tests
- [Error Handling Patterns](error-handling.md) - Handle errors properly
- [Logger Patterns](logger-patterns.md) - Logging best practices
