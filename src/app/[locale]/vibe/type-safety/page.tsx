"use client";

import {
  CheckCircle,
  Code,
  Database,
  Layers,
  Link,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  chain: `// Complete type safety from database to UI
// 1. Database Schema (Drizzle)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  profile: jsonb('profile').$type<UserProfile>(),
  settings: jsonb('settings').$type<UserSettings>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Complex nested types inferred from JSON
type UserProfile = {
  bio?: string;
  avatar?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
};

// 3. Endpoint Definition with conditional fields
const userEndpoint = createEndpoint({
  fields: objectField({
    // Input with nested validation
    userData: requestDataField({
      type: WidgetType.FORM_OBJECT,
      sections: [
        { key: 'basic', title: 'Basic Info' },
        { key: 'profile', title: 'Profile' },
        { key: 'settings', title: 'Settings' },
      ],
    }, z.object({
      email: z.email().transform(email => email.toLowerCase()),
      name: z.string().min(1).max(100),
      profile: z.object({
        bio: z.string().max(500).optional(),
        avatar: z.string().url().optional(),
        socialLinks: z.object({
          twitter: z.string().url().optional(),
          linkedin: z.string().url().optional(),
        }).optional(),
      }).optional(),
    })),
    
    // Response with role-based field filtering
    user: responseField({
      type: WidgetType.DATA_CARD,
      conditional: {
        admin: ['id', 'email', 'name', 'role', 'createdAt', 'profile'],
        user: ['id', 'name', 'profile.bio', 'profile.avatar'],
        guest: ['name'],
      },
    }, createSelectSchema(users)),
  }),
});

// 4. Repository with complex business logic
export async function createUser(input: typeof userEndpoint.input) {
  const { userData } = input;
  
  // Type-safe database operations
  const [user] = await db.insert(users).values({
    email: userData.email, // Already transformed to lowercase
    name: userData.name,
    profile: userData.profile ?? null,
    settings: {
      theme: 'light',
      notifications: true,
      language: 'en',
    },
  }).returning();
  
  // Type flows through transformations
  const userWithStats = {
    ...user,
    stats: await getUserStats(user.id),
    permissions: await getUserPermissions(user.role),
  };
  
  return userWithStats;
  //     ^? Complete inferred type with all properties
}

// 5. React Component with full type safety
function UserProfile() {
  const { data, error, isLoading } = useEndpoint(userEndpoint);
  //      ^? data: { user: SelectUser } | undefined
  //         ^? error: EndpointError<typeof userEndpoint> | null
  
  if (error?.type === 'EMAIL_EXISTS') {
    //       ^? TypeScript knows this error type exists
    return <Alert severity="error">{error.details.email} already exists</Alert>;
  }
  
  if (isLoading) return <ProfileSkeleton />;
  
  return (
    <Card>
      <Avatar src={data?.user.profile?.avatar} />
      {/*            ^? Optional chaining is type-safe */}
      <Typography>{data.user.name}</Typography>
      {/*                  ^? Required field, no optional chaining needed */}
    </Card>
  );
}`,

  translations: `// Type-safe translations with static checking
// 1. Translation files with nested structure
// src/app/api/[locale]/v1/users/i18n/en/api.ts
export default {
  users: {
    create: {
      title: "Create User",
      fields: {
        email: {
          label: "Email Address",
          placeholder: "user@example.com",
          error: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
        },
      },
      success: "User created successfully",
    },
  },
} as const;

// 2. Type-safe translation keys
const { t } = useTranslation();

// ✅ Autocomplete and type checking
t('users.create.fields.email.label')

// ❌ Type error - wrong key
t('users.create.fields.emial.label')
//                      ^^^^^
// Property 'emial' does not exist

// 3. Dynamic translations with parameters
t('users.welcome', { name: user.name })
// Type-checks parameter names and types`,

  inference: `// Automatic type inference throughout the stack
// No manual type definitions needed!

// Repository function
export async function createUser(data: unknown) {
  // Input validated against schema
  const validated = userCreateSchema.parse(data);
  //    ^? Exact type from Zod schema
  
  // Database insert with type safety
  const [user] = await db.insert(users)
    .values(validated)
    .returning();
  //    ^? Return type inferred from table schema
  
  return user;
}

// API Route (types flow through)
export const POST = createHandler({
  endpoint: userCreateEndpoint,
  handler: async ({ data }) => {
    //              ^? Input type from endpoint definition
    const user = await createUser(data);
    return { success: true, user };
    //     ^? Return type matches endpoint schema
  },
});

// React Component
function CreateUserForm() {
  const { mutate, error } = useEndpointCreate(userCreateEndpoint);
  //      ^? mutate: (data: UserCreateInput) => void
  //         error: EndpointError<typeof userCreateEndpoint>
  
  const handleSubmit = (formData: FormData) => {
    mutate({
      email: formData.get('email'), // Type-checked
      name: formData.get('name'),   // Type-checked
    });
  };
}`,

  errors: `// Type-safe error handling
// 1. Define error types in endpoint
const userEndpoint = createEndpoint({
  errorTypes: {
    USER_NOT_FOUND: {
      title: "users.errors.notFound.title",
      description: "users.errors.notFound.description",
    },
    EMAIL_EXISTS: {
      title: "users.errors.emailExists.title",
      description: "users.errors.emailExists.description",
    },
    INVALID_ROLE: {
      title: "users.errors.invalidRole.title",
      description: "users.errors.invalidRole.description",
    },
  },
});

// 2. Type-safe error throwing
export async function createUser(data: UserInput) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new EndpointError({
      type: 'EMAIL_EXISTS', // Auto-completed
      email: data.email,    // Type-safe context
    });
  }
}

// 3. Type-safe error handling in UI
function UserForm() {
  const { error } = useEndpoint(userEndpoint);
  
  if (error?.type === 'EMAIL_EXISTS') {
    //       ^? Typed error with context
    return <Alert>Email {error.email} already exists</Alert>;
  }
}`,

  cli: `// CLI commands with full type safety
// 1. Command definition inferred from endpoint
$ vibe user:create --help

Usage: vibe user:create [options]

Options:
  --email <email>     Email address (required)
  --name <string>     Full name (required)
  --role <role>       User role (choices: "admin", "user", "guest")
  --help              Display help

// 2. Runtime validation
$ vibe user:create --email "invalid-email" --name "John"
❌ Validation error: Invalid email format

$ vibe user:create --role "superadmin"
❌ Validation error: Invalid role. Choose from: admin, user, guest

// 3. Type-safe output
$ vibe user:create --email "john@example.com" --name "John" --format json
{
  "id": 123,
  "email": "john@example.com",
  "name": "John",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}`,

  guards: `// Runtime type guards with compile-time checking
// 1. Automatic guard generation from schemas
const isUser = createTypeGuard(userSchema);
const isPost = createTypeGuard(postSchema);
const isComment = createTypeGuard(commentSchema);

// 2. Safe type narrowing in complex scenarios
function processWebhookData(payload: unknown) {
  if (isUser(payload)) {
    // Type system now knows payload is User
    await updateUserProfile(payload.id, payload.profile);
    //                     ^? number    ^? UserProfile | null
  } else if (isPost(payload)) {
    // Type system now knows payload is Post
    await notifySubscribers(payload.authorId, payload.title);
    //                     ^? number        ^? string
  }
}

// 3. Array filtering with type preservation
const mixedData: unknown[] = await fetchApiData();

// Filter and get type-safe arrays
const validUsers = mixedData.filter(isUser);
//    ^? User[] - fully typed array, no casting needed

const validPosts = mixedData.filter(isPost);
//    ^? Post[] - each item is fully typed

// 4. Conditional type guards for complex scenarios
const isActiveUser = createTypeGuard(
  userSchema.extend({
    role: z.enum(['admin', 'user']).refine(role => role !== 'guest'),
    lastLoginAt: z.date().refine(date => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return date > thirtyDaysAgo;
    }),
  })
);

async function sendNotificationToActiveUsers(users: unknown[]) {
  const activeUsers = users.filter(isActiveUser);
  //    ^? Each user is guaranteed to be active and not a guest
  
  for (const user of activeUsers) {
    await sendNotification(user.id, {
      message: "Welcome back!",
      priority: user.role === 'admin' ? 'high' : 'normal',
      //                ^? TypeScript knows this is 'admin' | 'user'
    });
  }
}

// 5. Union type discrimination with guards
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

const isSuccessResponse = <T>(response: ApiResponse<T>): response is Extract<ApiResponse<T>, { success: true }> => {
  return response.success === true;
};

function handleUserResponse(response: ApiResponse<User>) {
  if (isSuccessResponse(response)) {
    // TypeScript knows response.data is User and response.success is true
    const user = response.data;
    //    ^? User - no type assertion needed
    console.log(\`Welcome \${user.name}!\`);
  } else {
    // TypeScript knows response.error is string and response.success is false
    console.error(response.error);
    //             ^? string - no type assertion needed
  }
}

// 6. Generic guards for reusable patterns
function createArrayGuard<T>(itemGuard: (value: unknown) => value is T) {
  return (value: unknown): value is T[] => {
    return Array.isArray(value) && value.every(itemGuard);
  };
}

const isUserArray = createArrayGuard(isUser);
const isPostArray = createArrayGuard(isPost);

// Usage with full type safety
if (isUserArray(someApiData)) {
  // someApiData is now User[]
  someApiData.forEach(user => {
    console.log(user.email); // ✅ Fully typed
  });
}`,
};

export default function TypeSafetyPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("chain");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Database className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            End-to-End Type Safety
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          From database schemas to API responses to UI components, enjoy
          complete type safety with a bit of runtime overhead and no manual type
          definitions.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            The Unbroken Chain
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 rounded-lg p-3">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">Database</div>
                <div className="text-gray-400 text-sm">Drizzle ORM</div>
              </div>
            </div>

            <Link className="h-8 w-8 text-gray-600" />

            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 rounded-lg p-3">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">Validation</div>
                <div className="text-gray-400 text-sm">Zod Schemas</div>
              </div>
            </div>

            <Link className="h-8 w-8 text-gray-600" />

            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 rounded-lg p-3">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">API Layer</div>
                <div className="text-gray-400 text-sm">Type-safe handlers</div>
              </div>
            </div>

            <Link className="h-8 w-8 text-gray-600" />

            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 rounded-lg p-3">
                <Code className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">Frontend</div>
                <div className="text-gray-400 text-sm">React + Hooks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Live Examples</h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("chain")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "chain"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Type Chain
              </button>
              <button
                onClick={() => setActiveExample("translations")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "translations"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Translations
              </button>
              <button
                onClick={() => setActiveExample("inference")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "inference"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Auto Inference
              </button>
              <button
                onClick={() => setActiveExample("errors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "errors"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Error Handling
              </button>
              <button
                onClick={() => setActiveExample("cli")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "cli"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                CLI Types
              </button>
              <button
                onClick={() => setActiveExample("guards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "guards"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Type Guards
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                {codeExamples[activeExample]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Real-World Type Scenarios
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Complex Data Transformations
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Input Processing
              </h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">Raw Form Data</div>
                  <div className="bg-red-900/20 rounded p-2 text-red-300 font-mono text-xs">
                    FormData: unknown types
                  </div>
                </div>
                <div className="text-gray-500 text-center">
                  ↓ Schema Validation
                </div>
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">Validated Input</div>
                  <div className="bg-yellow-900/20 rounded p-2 text-yellow-300 font-mono text-xs">
                    UserCreateInput: typed
                  </div>
                </div>
                <div className="text-gray-500 text-center">
                  ↓ Business Logic
                </div>
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">Database Entity</div>
                  <div className="bg-green-900/20 rounded p-2 text-green-300 font-mono text-xs">
                    User: complete with ID
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Response Building
              </h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">Database Record</div>
                  <div className="bg-blue-900/20 rounded p-2 text-blue-300 font-mono text-xs">
                    User: full DB schema
                  </div>
                </div>
                <div className="text-gray-500 text-center">↓ Transform</div>
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">API Response</div>
                  <div className="bg-purple-900/20 rounded p-2 text-purple-300 font-mono text-xs">
                    UserResponse: public fields only
                  </div>
                </div>
                <div className="text-gray-500 text-center">↓ Client Hook</div>
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">React State</div>
                  <div className="bg-green-900/20 rounded p-2 text-green-300 font-mono text-xs">
                    useQuery&lt;UserResponse&gt;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Double Validation Layer
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Both client and server validate all data. Yes, it's a performance
              trade-off we consciously make for bulletproof safety.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm">
              <div className="text-yellow-400">
                Client: Prevents bad requests
              </div>
              <div className="text-green-400">Server: Prevents bad data</div>
              <div className="text-blue-400">Result: 100% data integrity</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Catch Errors Early
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Type mismatches are caught during development, not in production.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm space-y-1">
              <div className="text-red-400">
                ❌ Runtime Error: Cannot read 'name' of undefined
              </div>
              <div className="text-green-400">
                ✅ Compile Error: Property 'name' missing in type
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Refactor with Confidence
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Change a database column? TypeScript shows every affected
              location.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm">
              <div className="text-purple-400">1 schema change</div>
              <div className="text-gray-400">→ 47 files need updates</div>
              <div className="text-green-400">→ All caught at compile time</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Code className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Amazing Developer Experience
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Autocomplete everything. No more guessing or checking
              documentation.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm">
              <div className="text-blue-400">
                IntelliSense: Every field, method, value
              </div>
              <div className="text-yellow-400">
                Go to Definition: Jump to schema source
              </div>
              <div className="text-green-400">
                Hover: See full type information
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Advanced Type Patterns
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Conditional Types
            </h3>
            <p className="text-gray-300 mb-3">
              Types change based on user roles, feature flags, or request
              context automatically.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>// Admin sees all fields</div>
              <div>type AdminUser = FullUserData</div>
              <div />
              <div>// Regular user sees public only</div>
              <div>type PublicUser = Pick&lt;User, 'name' | 'avatar'&gt;</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Union Discrimination
            </h3>
            <p className="text-gray-300 mb-3">
              Handle different response shapes safely with discriminated unions.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>// Auto-discriminated by 'status' field</div>
              <div>if (response.status === 'success') {"{"}</div>
              <div> // response.data is now typed</div>
              <div>
                {"}"} else {"{"}
              </div>
              <div> // response.error is now typed</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Deep Partial Updates
            </h3>
            <p className="text-gray-300 mb-3">
              PATCH operations with nested partial updates, all type-safe.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>// Only update what's provided</div>
              <div>updateUser(id, {"{"}</div>
              <div>
                {" "}
                profile: {"{"} bio: "New bio" {"}"},
              </div>
              <div>
                {" "}
                settings: {"{"} theme: "dark" {"}"},
              </div>
              <div>{"}"}) // All keys are optional & typed</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Generic Endpoints
            </h3>
            <p className="text-gray-300 mb-3">
              Reusable endpoint patterns that maintain type safety across
              different entities.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              <div>// Generic CRUD maintains types</div>
              <div>const userCrud = createCRUD(userSchema)</div>
              <div>const postCrud = createCRUD(postSchema)</div>
              <div />
              <div>// Each has full type inference</div>
              <div>userCrud.create // (data: UserInput) =&gt; User</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            The Magic of Inference
          </h2>
          <p className="text-gray-300 mb-6">
            You don't write types - Vibe infers them. Define your database
            schema once, and types flow through your entire application
            automatically.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">0</div>
              <div className="text-gray-400">Manual type definitions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">100%</div>
              <div className="text-gray-400">Type coverage</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">∞</div>
              <div className="text-gray-400">Developer happiness</div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Type Safety Without the Boilerplate
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Vibe gives you enterprise-grade type safety with startup-speed
          development. No more choosing between safety and productivity.
        </p>
        <div className="inline-flex items-center gap-4 bg-black/30 rounded-lg px-6 py-3">
          <Database className="h-6 w-6 text-purple-400" />
          <span className="text-gray-400">→</span>
          <Shield className="h-6 w-6 text-purple-400" />
          <span className="text-gray-400">→</span>
          <Layers className="h-6 w-6 text-purple-400" />
          <span className="text-gray-400">→</span>
          <Code className="h-6 w-6 text-purple-400" />
          <span className="text-green-400 font-medium ml-4">✓ Fully Typed</span>
        </div>
      </section>
    </main>
  );
}
