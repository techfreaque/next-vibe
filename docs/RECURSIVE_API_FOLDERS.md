# Recursive API Folder Structure

**The core innovation of NextVibe: The folder structure IS the API.**

---

## 🎯 Concept

NextVibe uses a **recursive folder structure** where your API organization is defined by your file system. This is not a package you install - it's a **pattern you adopt** when you fork the repository.

Each folder can contain:
1. An endpoint (with `route.ts`)
2. Nested folders (which become nested routes)
3. Shared resources (db.ts, i18n/, etc.)

**The folder path directly maps to the API path.**

When you fork NextVibe, you get example endpoints. Delete what you don't need, keep what you want, and add your own following the same pattern.

---

## 📁 Folder → Route Mapping

### Basic Mapping

```
src/app/api/[locale]/v1/core/user/public/login/
                                └─────┬──────┘
                                      ↓
                    /api/[locale]/v1/core/user/public/login
```

### Nested Endpoints

```
src/app/api/[locale]/v1/core/
├── user/
│   ├── public/
│   │   ├── login/          → /api/.../user/public/login
│   │   │   └── options/    → /api/.../user/public/login/options
│   │   ├── signup/         → /api/.../user/public/signup
│   │   └── reset-password/ → /api/.../user/public/reset-password
│   └── private/
│       ├── me/             → /api/.../user/private/me
│       └── update/         → /api/.../user/private/update
```

### Infinite Nesting

```
leads/
├── route.ts                → /api/.../leads
├── batch/
│   └── route.ts            → /api/.../leads/batch
├── campaigns/
│   ├── route.ts            → /api/.../leads/campaigns
│   └── stats/
│       └── route.ts        → /api/.../leads/campaigns/stats
└── tracking/
    ├── engagement/
    │   └── route.ts        → /api/.../leads/tracking/engagement
    └── pixel/
        └── route.ts        → /api/.../leads/tracking/pixel
```

**No limit to nesting depth. Organize however makes sense for your domain.**

---

## 🏗️ Folder Anatomy

### Minimal Endpoint

```
my-endpoint/
├── definition.ts    # Required - API contract
├── repository.ts    # Required - Business logic
└── route.ts         # Required - Handler wiring
```

### Full Endpoint

```
my-endpoint/
├── definition.ts    # API contract (Zod schemas + metadata)
├── repository.ts    # Business logic
├── route.ts         # Next.js handler
├── hooks.ts         # React hooks (optional)
├── db.ts            # Database schema (optional)
├── enum.ts          # Enums (optional)
├── types.ts         # TypeScript types (optional)
├── seeds.ts         # Seed data (optional)
├── route.test.ts    # Tests (optional)
├── i18n/            # Translations (optional)
│   ├── en/
│   ├── de/
│   └── pl/
└── nested-endpoint/ # Nested endpoints (optional)
    ├── definition.ts
    ├── repository.ts
    └── route.ts
```

---

## 🔄 How It Works

### 1. Folder Scanning

The framework scans `src/app/api/[locale]/v1/core/` recursively:

```typescript
// Simplified scanner logic
function scanDirectory(dir: string): RouteFile[] {
  const routes: RouteFile[] = [];
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Recurse into subdirectories
      routes.push(...scanDirectory(fullPath));
    } else if (entry === 'route.ts') {
      // Found an endpoint
      routes.push(fullPath);
    }
  }
  
  return routes;
}
```

### 2. Path Generation

Folder path → API path:

```typescript
// Example: src/app/api/[locale]/v1/core/user/public/login/route.ts
const relativePath = "user/public/login";
const apiPath = `/api/[locale]/v1/core/${relativePath}`;
// Result: /api/[locale]/v1/core/user/public/login
```

### 3. Multi-Platform Generation

Each `route.ts` automatically generates:

```typescript
// route.ts
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, user, logger }) => repository.login(data, user, logger),
  },
});

// Generates:
// 1. Next.js route: POST /api/[locale]/v1/core/user/public/login
// 2. tRPC procedure: trpc.user.public.login.mutate()
// 3. CLI command: vibe user:public:login
```

### 4. tRPC Router Generation

The folder structure becomes a nested tRPC router:

```typescript
// Auto-generated from folder structure
export const appRouter = router({
  user: router({
    public: router({
      login: procedure.mutation(/* ... */),
      signup: procedure.mutation(/* ... */),
    }),
    private: router({
      me: procedure.query(/* ... */),
      update: procedure.mutation(/* ... */),
    }),
  }),
  leads: router({
    batch: procedure.mutation(/* ... */),
    campaigns: router({
      stats: procedure.query(/* ... */),
    }),
  }),
});
```

---

## 🎨 Organization Patterns

### By Domain

```
api/[locale]/v1/core/
├── user/           # User domain
├── leads/          # Leads domain
├── agent/          # AI agent domain
├── emails/         # Email domain
└── payment/        # Payment domain
```

### By Access Level

```
user/
├── public/         # Public endpoints
│   ├── login/
│   ├── signup/
│   └── reset-password/
└── private/        # Authenticated endpoints
    ├── me/
    ├── update/
    └── delete/
```

### By Resource + Action

```
leads/
├── create/         # POST /leads/create
├── list/           # GET /leads/list
├── search/         # POST /leads/search
├── export/         # POST /leads/export
└── lead/           # GET /leads/lead/:id
    └── [id]/
```

### Hybrid

```
agent/
├── chat/
│   ├── threads/
│   │   ├── create/
│   │   ├── list/
│   │   └── thread/
│   │       └── [id]/
│   ├── folders/
│   │   ├── create/
│   │   └── list/
│   └── credits/
│       ├── balance/
│       └── history/
└── speech-to-text/
```

**Choose what makes sense for your domain. The structure is flexible.**

---

## 🔑 Key Benefits

### 1. Self-Documenting

The folder structure shows the API structure at a glance.

```bash
tree src/app/api/[locale]/v1/core/user/
# Instantly see all user endpoints
```

### 2. Colocation

Everything related to an endpoint lives together:

```
login/
├── definition.ts    # What it does
├── repository.ts    # How it works
├── route.ts         # How it's exposed
├── hooks.ts         # How to use it
├── i18n/            # What it says
└── route.test.ts    # How to test it
```

### 3. Copy-Paste Ready

Want to add a new endpoint? Copy an existing folder:

```bash
cp -r user/public/login user/public/signin
# Edit the files
# Done
```

### 4. Easy to Migrate

When you fork NextVibe, migrate your code folder by folder:

```bash
# Your old code
src/lib/auth/login.ts

# Becomes
src/app/api/[locale]/v1/core/auth/login/
├── definition.ts
├── repository.ts  # Your old login.ts code goes here
└── route.ts
```

### 5. Discoverable

New developers can explore the API by browsing folders.

---

## 🚫 What NOT to Put in API Folders

### ❌ UI Components

```
user/public/login/
└── LoginForm.tsx    # ❌ NO - Put in app/[locale]/(auth)/login/
```

### ❌ Shared Utilities (Unless Domain-Specific)

```
user/
└── utils.ts         # ❌ Maybe - Consider src/lib/utils.ts
```

### ✅ Domain-Specific Shared Code

```
user/
├── db.ts            # ✅ YES - User database schema
├── enum.ts          # ✅ YES - User-specific enums
└── repository.ts    # ✅ YES - Shared user logic
```

---

## 📏 Naming Conventions

### Folder Names

- **lowercase-with-dashes** for multi-word folders
- **singular** for resource names (user, not users)
- **verb** for action folders (create, update, delete)
- **noun** for resource folders (user, lead, thread)

### File Names

- `definition.ts` - Always this name
- `repository.ts` - Always this name
- `route.ts` - Always this name
- `hooks.ts` - Always this name
- `db.ts` - Always this name
- `enum.ts` - Always this name

**Consistency enables tooling and automation.**

---

## 🔄 Migration from Traditional APIs

When you fork NextVibe, you'll migrate your existing code into this structure.

### Before (Traditional)

```
src/
├── pages/api/
│   └── user.ts         # All user endpoints in one file
├── lib/
│   └── user.ts         # Business logic
└── types/
    └── user.ts         # Types
```

### After (Forking NextVibe)

```
src/app/api/[locale]/v1/core/user/
├── public/
│   ├── login/
│   │   ├── definition.ts    # API contract
│   │   ├── repository.ts    # Your lib/user.ts code goes here
│   │   └── route.ts         # Handler wiring
│   └── signup/
│       ├── definition.ts
│       ├── repository.ts
│       └── route.ts
└── private/
    └── me/
        ├── definition.ts
        ├── repository.ts
        └── route.ts
```

**Migration Steps:**
1. Fork NextVibe
2. Copy your business logic from `lib/user.ts` into `repository.ts` files
3. Create `definition.ts` for each endpoint (defines the API contract)
4. Wire them up in `route.ts`
5. Delete your old code

**More folders, but each is simpler and self-contained.**

---

## 🎯 Summary

**The folder structure IS the API.**

- Folders map directly to routes
- Infinitely nestable
- Self-documenting
- Copy-paste ready
- Shareable as bundles

This is the core innovation of NextVibe.

---

Next: **[Endpoint Anatomy](ENDPOINT_ANATOMY.md)** - What goes in each folder

