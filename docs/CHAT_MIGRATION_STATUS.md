# Chat System Migration Status

**Last Updated:** 2025-10-20  
**Status:** 🔴 CRITICAL - ~1500 unstaged changes lost, migration in progress

## What Happened

On 2025-10-20, approximately 1500 lines of unstaged changes were accidentally deleted when `git checkout . && git clean -fd src/app/[locale]/chat/` was run. These changes were the migration of chat components to use API hooks directly instead of React context.

## Current State

### ✅ Completed
- All API endpoints created with proper `definition.ts → repository.ts → hooks.ts` pattern
- All hooks support both server and incognito modes
- API layer fully functional and type-safe
- Vibe check passes on API layer with 0 errors

### ❌ Lost/Needs Redo
- Migration of `chat-interface.tsx` to use `useChat` hook
- Removal of `ChatProvider` wrapper from `pages.tsx` files
- Updates to all chat components to use API hooks directly
- Approximately 1500 lines of component changes

### 📋 Current Architecture

**Chat Folder (Presentational Only):**
- `src/app/[locale]/chat/components/` - UI components
- `src/app/[locale]/chat/lib/` - UI utilities (keyboard, navigation, screenshot, send-prompt)
- `src/app/[locale]/chat/features/chat/context.tsx` - Currently uses `useChatContext` (needs update)

**API Folder (All Business Logic):**
- `src/app/api/[locale]/v1/core/agent/chat/hooks.ts` - Central hook combining all functionality
- `src/app/api/[locale]/v1/core/agent/chat/threads/hooks.ts` - Thread operations
- `src/app/api/[locale]/v1/core/agent/chat/folders/hooks.ts` - Folder operations
- `src/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/messages/hooks.ts` - Message operations
- `src/app/api/[locale]/v1/core/agent/chat/threads/search/hooks.ts` - Search operations

## What Needs to Be Done

### Phase 1: Migrate Components to API Hooks
1. Update `chat-interface.tsx` to import `useChat` from API instead of `useChatContext`
2. Remove `ChatProvider` wrapper from:
   - `src/app/[locale]/page.tsx`
   - `src/app/[locale]/threads/[...path]/page.tsx`
3. Update all chat components to destructure from `useChat` hook directly
4. Ensure no prop drilling - use Zustand store via `useEndpoint`

### Phase 2: Verify Type Safety
- Run `npx vibe check` on all 3 folders
- Ensure 0 errors, 0 warnings
- Verify no type assertions, no 'unknown' types, no 'any' types

### Phase 3: Test All Modes
- Test server mode (threads saved to DB)
- Test incognito mode (threads only in localStorage)
- Test all 4 folder types (private, shared, public, incognito)
- Test all operations (create, edit, delete, vote, branch, etc.)

## Key Principles

1. **NO business logic in chat folder** - All logic stays in API layer
2. **NO copying files from old folder** - Manually migrate logic to new pattern
3. **Chat folder is purely presentational** - Only imports from API hooks
4. **100% type-safe** - All types inferred from API responses
5. **Both modes supported** - Each hook works with server and incognito modes

## Files to Update

- `src/app/[locale]/chat/components/chat-interface.tsx`
- `src/app/[locale]/chat/components/layout/chat-area.tsx`
- `src/app/[locale]/chat/components/layout/sidebar-wrapper.tsx`
- `src/app/[locale]/chat/components/layout/top-bar.tsx`
- `src/app/[locale]/chat/components/messages/chat-messages.tsx`
- `src/app/[locale]/chat/components/messages/flat-message-view.tsx`
- `src/app/[locale]/chat/components/messages/threaded-message.tsx`
- `src/app/[locale]/chat/components/sidebar/chat-sidebar.tsx`
- `src/app/[locale]/chat/components/sidebar/folder-list.tsx`
- `src/app/[locale]/chat/components/sidebar/thread-list.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/threads/[...path]/page.tsx`

## API Hooks to Use

```typescript
// Central hook
import { useChat } from "@/app/api/[locale]/v1/core/agent/chat/hooks";

// Individual hooks
import { useThreadsList } from "@/app/api/[locale]/v1/core/agent/chat/threads/hooks";
import { useFoldersList } from "@/app/api/[locale]/v1/core/agent/chat/folders/hooks";
import { useMessagesList } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/messages/hooks";
import { useSearchThreads } from "@/app/api/[locale]/v1/core/agent/chat/threads/search/hooks";
```

## Testing Checklist

- [ ] Server mode: Create thread → verify in DB
- [ ] Server mode: Send message → verify in DB
- [ ] Incognito mode: Create thread → verify only in localStorage
- [ ] Incognito mode: Refresh page → verify data persists
- [ ] All 4 folder types work correctly
- [ ] All operations (create, edit, delete, vote, branch, retry, answer-as-model)
- [ ] Vibe check passes with 0 errors on all 3 folders
- [ ] Type safety verified (no assertions, no 'any', no 'unknown')

