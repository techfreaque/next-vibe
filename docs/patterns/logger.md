# Logger Usage Patterns

Standardized logging patterns for the NextVibe framework. Follow these patterns religiously - no exceptions unless explicitly documented.

## Overview

This document defines strict logger patterns for the codebase. The `EndpointLogger` is used throughout the application for consistent logging behavior across API routes, repositories, and client components.

---

## Pattern 1: API Routes (Server-Side)

### Rule

**NEVER create loggers in routes.** The `endpointsHandler` creates the logger automatically and passes it via `props.logger`.

### Implementation

```typescript
// route.ts
import { endpointsHandler } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi';

export const { GET, POST } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ logger, data, user, locale }) => {
      // ✅ Logger is available via props.logger
      return await repository.getData(
        data,
        user,
        locale,
        logger,  // <-- Pass it down
      );
    },
  },
});
```

---

## Pattern 2: Repositories (Server-Side)

### Rule

**NEVER create loggers in repositories.** Always receive logger as a parameter and use it.

### Implementation

```typescript
// repository.ts
import type { EndpointLogger } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger';

export interface MyRepositoryInterface {
  getData(
    data: DataInput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,  // <-- Required parameter
  ): Promise<ResponseType<DataOutput>>;
}

export class MyRepositoryImpl implements MyRepositoryInterface {
  async getData(
    data: DataInput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,  // <-- Receive it
  ): Promise<ResponseType<DataOutput>> {
    try {
      logger.debug('Processing data', { userId: user.id });

      // ... business logic ...

      logger.info('Data processed successfully', { count: result.length });
      return createSuccessResponse({ data: result });
    } catch (error) {
      logger.error('Failed to process data', error);
      return createErrorResponse(
        'app.api.errors.internal',
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}
```

---

## Pattern 3: Client Components (React)

### Rule

**Create logger ONLY at the TOP-LEVEL component** (page.tsx or highest client component), then pass it down via props or context.

### Implementation

#### Top-Level Component (Create Logger)

```typescript
// features/chat/context.tsx
'use client';

import { createEndpointLogger } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint';

export function ChatProvider({ children }: ChatProviderProps) {
  const { locale } = useTranslation();

  // ✅ Create logger at the TOP LEVEL
  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);

  // Pass to children via context
  const contextValue = {
    // ... other values ...
    logger,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}
```

#### Child Components (Receive Logger)

```typescript
// components/message-editor.tsx
'use client';

import type { EndpointLogger } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger';

interface MessageEditorProps {
  message: ChatMessage;
  logger: EndpointLogger;  // <-- Receive as prop
}

export function MessageEditor({ message, logger }: MessageEditorProps) {
  const handleSave = async () => {
    try {
      await saveMessage(message.id);
      logger.info('Message saved successfully');
    } catch (error) {
      logger.error('Failed to save message', error);
    }
  };

  return <div>...</div>;
}
```

#### Hooks (Receive Logger)

```typescript
// hooks/use-message-editor.ts
export interface UseMessageEditorOptions {
  message: ChatMessage;
  onSave: (id: string, content: string) => Promise<void>;
  logger: EndpointLogger;  // <-- Required parameter
}

export function useMessageEditor({ message, onSave, logger }: UseMessageEditorOptions) {
  const handleSave = async () => {
    try {
      await onSave(message.id, content);
    } catch (error) {
      logger.error('Failed to overwrite message', error);  // <-- Use it
      throw error;
    }
  };

  return { handleSave };
}
```

---

## Anti-Patterns (DO NOT DO THIS)

### ❌ Creating Logger in Repository

```typescript
// ❌ WRONG
export class MyRepository {
  async getData(...) {
    const logger = createEndpointLogger(false, Date.now(), 'en-GLOBAL');  // ❌ NO!
    logger.info('Processing data');
  }
}
```

### ❌ Using console.log/error in Repositories

```typescript
// ❌ WRONG
export class MyRepository {
  async getData(...) {
    console.log('Processing data');  // ❌ NO! Use logger parameter
  }
}
```

### ❌ Using console.error in Client Components

```typescript
// ❌ WRONG
export function MessageEditor() {
  const handleSave = async () => {
    try {
      await save();
    } catch (error) {
      console.error('Failed to save', error);  // ❌ NO! Use logger prop
    }
  };
}
```

### ❌ Creating Logger in Every Client Component

```typescript
// ❌ WRONG
export function ChildComponent() {
  const logger = createEndpointLogger(false, Date.now(), locale);  // ❌ NO! Get from context/props
}
```

---

## Logger Methods

### Available Methods

```typescript
interface EndpointLogger {
  info(message: TranslationKey, ...args: unknown[]): void;
  error(message: TranslationKey, error?: unknown, ...args: unknown[]): void;
  warn(message: TranslationKey, ...args: unknown[]): void;
  debug(message: TranslationKey, ...args: unknown[]): void;
  vibe(message: TranslationKey, ...args: unknown[]): void;
  isDebugEnabled: boolean;
}
```

### Usage Examples

```typescript
// Info logging
logger.info('Processing user data', { userId: user.id, count: 10 });

// Error logging
logger.error('Failed to process data', error);

// Warning logging
logger.warn('Deprecated API used', { endpoint: '/old-api' });

// Debug logging (only in development)
logger.debug('Cache hit', { key: 'user:123' });

// Vibe logging (special formatting)
logger.vibe('Server started successfully', { port: 3000 });
```

---

## Import Paths

Always use these exact imports:

```typescript
// Type import
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

// Function import (for creation only at top-level)
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
```

---

## Checklist

Before committing code, verify:

- [ ] **Routes**: Logger is received from `props.logger` (never created)
- [ ] **Repositories**: Logger is received as parameter (never created)
- [ ] **Client Components**: Logger created ONLY at top-level, passed down via props/context
- [ ] **Hooks**: Logger received as parameter
- [ ] **No console.log/error**: Except for process-level, task runners, or CLI operations
- [ ] **Proper error handling**: All errors logged with `logger.error()`
- [ ] **Translation keys**: Use translation keys for messages (not hardcoded strings)

---

## Summary

| Component Type | Logger Pattern |
|---|---|
| **API Routes** | Receive from `props.logger` |
| **Repositories** | Receive as parameter |
| **Client Components (Top)** | Create with `createEndpointLogger(false, Date.now(), locale)` |
| **Client Components (Child)** | Receive from props/context |
| **Hooks** | Receive as parameter |

---

## See Also

- [Repository Patterns](repository.md) - Logger in repositories
- [Seeds Patterns](seeds.md) - Logger in seeds

---

**Follow these patterns strictly. No exceptions unless documented here.**
