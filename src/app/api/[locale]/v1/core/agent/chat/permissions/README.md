# Chat Permission System

## Overview

The chat system supports four folder types with different permission models:

1. **PRIVATE** - User-only access
2. **SHARED** - Link-based sharing with optional user restrictions
3. **PUBLIC** - Forum-style with role-based moderation
4. **INCOGNITO** - Local-only, never stored on server

## Folder Types

### PRIVATE (Default)
- **Storage**: Server-side database
- **Access**: Only the folder owner
- **Use Case**: Personal conversations, private notes
- **Permissions**:
  - Owner: Full access (read, write, delete, manage)
  - Others: No access

### SHARED
- **Storage**: Server-side database
- **Access**: Anyone with the share link, optionally restricted to specific users
- **Use Case**: Collaborative conversations, team discussions
- **Permissions**:
  - Owner: Full access (read, write, delete, manage, share)
  - Share link holders: Read and write (can add messages)
  - Restricted users (if allowedUserIds set): Read and write
  - Others: No access
- **Features**:
  - `shareToken`: Unique token for link-based access
  - `allowedUserIds`: Optional array to restrict access to specific users

### PUBLIC
- **Storage**: Server-side database
- **Access**: All authenticated users (read), moderated write access
- **Use Case**: Community forums, public discussions, Q&A
- **Permissions**:
  - Owner: Full access (read, write, delete, manage, moderate)
  - Moderators: Read, write, delete others' messages, manage threads
  - Authenticated users: Read, write (own messages)
  - Anonymous: Read-only (optional future feature)
- **Features**:
  - `isPublic`: Set to true
  - `moderatorIds`: Array of user IDs with moderator privileges

### INCOGNITO
- **Storage**: localStorage only (never sent to server)
- **Access**: Only the current browser session
- **Use Case**: Sensitive conversations, temporary testing
- **Permissions**:
  - Local user: Full access
  - Others: No access (data never leaves the browser)
- **Features**:
  - All API calls with `storageType='local'` skip database writes
  - Data persists only in browser localStorage
  - No server-side record

## Permission Matrix

| Action | PRIVATE | SHARED (Owner) | SHARED (Link Holder) | PUBLIC (Owner) | PUBLIC (Moderator) | PUBLIC (User) | INCOGNITO |
|--------|---------|----------------|----------------------|----------------|-------------------|---------------|-----------|
| Read folder | Owner only | Owner | Link holders | Owner | Moderators | All authenticated | Local only |
| Read threads | Owner only | Owner | Link holders | Owner | Moderators | All authenticated | Local only |
| Read messages | Owner only | Owner | Link holders | Owner | Moderators | All authenticated | Local only |
| Create thread | Owner only | Owner | Link holders | Owner | Moderators | All authenticated | Local only |
| Create message | Owner only | Owner | Link holders | Owner | Moderators | All authenticated | Local only |
| Edit own message | Owner only | Owner | Link holders | Owner | Moderators | Message author | Local only |
| Edit others' message | Owner only | Owner | No | Owner | Moderators | No | Local only |
| Delete own message | Owner only | Owner | Link holders | Owner | Moderators | Message author | Local only |
| Delete others' message | Owner only | Owner | No | Owner | Moderators | No | Local only |
| Delete thread | Owner only | Owner | No | Owner | Moderators | No | Local only |
| Delete folder | Owner only | Owner | No | Owner | No | No | Local only |
| Manage permissions | Owner only | Owner | No | Owner | No | No | Local only |
| Add moderators | N/A | N/A | N/A | Owner | No | No | N/A |
| Generate share link | N/A | Owner | No | N/A | N/A | N/A | N/A |
| Vote on messages | Owner only | Owner + Link holders | Link holders | All authenticated | All authenticated | All authenticated | Local only |

## Permission Checking Functions

The system provides these utility functions for permission checks:

### Folder-Level Permissions

```typescript
// Check if user can read a folder
canReadFolder(userId: string | null, folder: ChatFolder): boolean

// Check if user can write to a folder (create threads/messages)
canWriteFolder(userId: string | null, folder: ChatFolder): boolean

// Check if user can delete a folder
canDeleteFolder(userId: string, folder: ChatFolder): boolean

// Check if user can manage folder permissions
canManageFolder(userId: string, folder: ChatFolder): boolean

// Check if user is a moderator of a folder
isModerator(userId: string, folder: ChatFolder): boolean
```

### Thread-Level Permissions

```typescript
// Check if user can read a thread
canReadThread(userId: string | null, thread: ChatThread, folder: ChatFolder): boolean

// Check if user can write to a thread (add messages)
canWriteThread(userId: string | null, thread: ChatThread, folder: ChatFolder): boolean

// Check if user can delete a thread
canDeleteThread(userId: string, thread: ChatThread, folder: ChatFolder): boolean
```

### Message-Level Permissions

```typescript
// Check if user can read a message
canReadMessage(userId: string | null, message: ChatMessage, thread: ChatThread, folder: ChatFolder): boolean

// Check if user can edit a message
canEditMessage(userId: string, message: ChatMessage, folder: ChatFolder): boolean

// Check if user can delete a message
canDeleteMessage(userId: string, message: ChatMessage, folder: ChatFolder): boolean

// Check if user can vote on a message
canVoteMessage(userId: string | null, message: ChatMessage, folder: ChatFolder): boolean
```

## Implementation Notes

### Share Token Generation
- Use cryptographically secure random tokens (e.g., `crypto.randomBytes(32).toString('base64url')`)
- Store in `shareToken` field
- Share links format: `/chat/shared/{shareToken}`

### Moderator Management
- Only folder owner can add/remove moderators
- Moderators stored in `moderatorIds` array
- Moderators have elevated permissions but cannot delete the folder or change ownership

### Incognito Mode
- All operations check `storageType` parameter
- If `storageType === 'local'`, skip all database operations
- Return success responses without persisting data
- Client handles all storage in localStorage

### Permission Inheritance
- Threads inherit permissions from their parent folder
- Messages inherit permissions from their parent thread
- Child folders can have different types than parent folders

### Security Considerations
1. Always validate `userId` from JWT token, never trust client input
2. Check permissions at every API endpoint
3. Use database transactions for permission-sensitive operations
4. Rate limit share link generation to prevent abuse
5. Implement share link expiration (future feature)
6. Log permission violations for security monitoring

## Database Schema

### chat_folders Table
```sql
folder_type TEXT NOT NULL DEFAULT 'app.api.v1.core.agent.chat.enums.folderType.private'
is_public BOOLEAN NOT NULL DEFAULT false
share_token TEXT -- Unique token for shared folders
moderator_ids JSONB DEFAULT '[]' -- Array of user IDs
allowed_user_ids JSONB DEFAULT '[]' -- Array of user IDs for restricted shared folders
```

### chat_messages Table
```sql
upvotes INTEGER NOT NULL DEFAULT 0
downvotes INTEGER NOT NULL DEFAULT 0
metadata JSONB -- Contains voterIds and voteDetails
```

## API Endpoints

All endpoints must implement permission checks:

1. **GET /folders** - Filter by readable folders
2. **GET /folders/[id]** - Check canReadFolder
3. **POST /folders** - Check user authentication
4. **PATCH /folders/[id]** - Check canManageFolder
5. **DELETE /folders/[id]** - Check canDeleteFolder
6. **GET /threads** - Filter by readable threads
7. **GET /threads/[id]** - Check canReadThread
8. **POST /threads** - Check canWriteFolder
9. **PATCH /threads/[id]** - Check canWriteThread or isModerator
10. **DELETE /threads/[id]** - Check canDeleteThread
11. **GET /messages** - Filter by readable messages
12. **GET /messages/[id]** - Check canReadMessage
13. **POST /messages** - Check canWriteThread
14. **PATCH /messages/[id]** - Check canEditMessage
15. **DELETE /messages/[id]** - Check canDeleteMessage
16. **POST /messages/[id]/vote** - Check canVoteMessage

## Future Enhancements

1. Share link expiration dates
2. Anonymous read access for public folders
3. Role-based permissions (beyond owner/moderator/user)
4. Folder-level settings for message editing/deletion
5. Audit logs for permission changes
6. Invite-only shared folders
7. Read-only share links

