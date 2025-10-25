# Client Hooks

**Type-safe React and React Native hooks for using endpoints.**

> **Part of NextVibe Framework** (GPL-3.0) - Located in `src/app/api/[locale]/v1/core/system/unified-ui/react/hooks/`

All hooks work in both React (web) and React Native (mobile) with identical APIs.

---

## 🪝 Available Hooks

### 1. `useEndpoint` - All-in-One Hook

The main hook that auto-detects available methods and provides corresponding functionality.

```typescript
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

const endpoint = useEndpoint(
  definitions,  // { GET: endpoint, POST: endpoint, ... }
  options,      // Configuration
  logger,       // Endpoint logger
);
```

**Returns:**
- `read` - For GET endpoints
- `create` - For POST endpoints
- `update` - For PUT/PATCH endpoints
- `delete` - For DELETE endpoints
- `alert` - Unified alert state

### 2. `useApiForm` - Form with Mutation

Form integrated with API mutation.

```typescript
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";

const { form, submitForm, mutation } = useApiForm(
  endpoint,
  logger,
  formOptions,
  mutationOptions,
);
```

### 3. `useApiMutation` - Mutation Only

For mutations without forms.

```typescript
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";

const mutation = useApiMutation(endpoint, logger, options);
```

### 4. `useApiQuery` - Query Only

For GET requests without forms.

```typescript
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";

const query = useApiQuery({
  endpoint,
  requestData,
  urlParams,
  options,
  logger,
});
```

### 5. `useApiQueryForm` - Query with Form

For search/filter forms that trigger queries.

```typescript
import { useApiQueryForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query-form";

const { form, response, submitForm } = useApiQueryForm(
  endpoint,
  urlParams,
  formOptions,
  queryOptions,
  logger,
);
```

---

## 📖 Detailed Usage

### useEndpoint

**Best for:** CRUD operations with multiple methods.

```typescript
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useMemo } from "react";
import { useTranslation } from "@/i18n/core/client";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

function UserProfile({ userId }: { userId: string }) {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const user = useEndpoint(
    {
      GET: getUserEndpoint,
      PUT: updateUserEndpoint,
    },
    {
      urlParams: { id: userId },
      autoPrefill: true, // Auto-fill PUT form from GET data
      queryOptions: {
        enabled: true,
        staleTime: 10000,
      },
    },
    logger,
  );

  if (user.read?.isLoading) return <div>Loading...</div>;
  if (user.read?.response?.success === false) return <div>Error</div>;

  return (
    <div>
      <h1>{user.read?.response?.data?.name}</h1>
      
      <Form form={user.update?.form} onSubmit={user.update?.submitForm}>
        <FormField name="name" />
        <FormField name="email" />
        <Button type="submit" disabled={user.update?.mutation.isPending}>
          Update
        </Button>
      </Form>
    </div>
  );
}
```

**Return Type:**
```typescript
{
  read?: {
    form: UseFormReturn;
    response: ResponseType<TResponse>;
    isLoading: boolean;
    refetch: () => void;
  };
  create?: {
    form: UseFormReturn;
    submitForm: (event?, options?) => void;
    mutation: {
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      data: ResponseType<TResponse>;
      error: ErrorResponseType;
    };
  };
  update?: { /* same as create */ };
  delete?: {
    mutation: {
      mutate: (variables) => void;
      mutateAsync: (variables) => Promise<ResponseType>;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
    };
  };
  alert?: {
    variant: "success" | "error" | "info";
    title: string;
    message: string;
  };
}
```

---

### useApiForm

**Best for:** Forms that submit to an API.

```typescript
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { Form, FormField, Button } from "@/packages/next-vibe-ui/web/ui/form";

function LoginForm() {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const { form, submitForm, mutation } = useApiForm(
    loginEndpoint,
    logger,
    {
      defaultValues: {
        email: "",
        password: "",
      },
      persistForm: true, // Save to localStorage
    },
    {
      onSuccess: ({ data }) => {
        console.log("Logged in", data);
        router.push("/dashboard");
      },
      onError: ({ error }) => {
        console.error("Login failed", error);
      },
    },
  );

  return (
    <Form form={form} onSubmit={submitForm}>
      <FormField name="email" />
      <FormField name="password" />
      
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </Button>
      
      {mutation.isError && (
        <div className="text-red-500">
          {mutation.error.error.message}
        </div>
      )}
    </Form>
  );
}
```

**Options:**
```typescript
// Form options
{
  defaultValues?: Partial<TRequest>;
  persistForm?: boolean;           // Save to localStorage
  persistenceKey?: string;          // Custom storage key
}

// Mutation options
{
  onSuccess?: ({ data, requestData }) => void;
  onError?: ({ error, requestData }) => void;
}
```

---

### useApiMutation

**Best for:** Mutations without forms (e.g., delete, toggle).

```typescript
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";

function DeleteButton({ userId }: { userId: string }) {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const deleteMutation = useApiMutation(deleteUserEndpoint, logger, {
    onSuccess: () => {
      toast.success("User deleted");
      router.push("/users");
    },
  });

  return (
    <Button
      onClick={() => deleteMutation.mutate({
        requestData: {},
        urlParams: { id: userId },
      })}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
```

**Async usage:**
```typescript
const result = await deleteMutation.mutateAsync({
  requestData: {},
  urlParams: { id: userId },
});

if (result.success) {
  console.log("Deleted", result.data);
} else {
  console.error("Error", result.error);
}
```

---

### useApiQuery

**Best for:** Fetching data without a form.

```typescript
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";

function UserList() {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const query = useApiQuery({
    endpoint: listUsersEndpoint,
    requestData: { page: 1, limit: 10 },
    urlParams: {},
    options: {
      enabled: true,
      staleTime: 5000,
      refetchOnWindowFocus: true,
    },
    logger,
  });

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>Error: {query.error?.error.message}</div>;
  if (!query.data?.success) return <div>No data</div>;

  return (
    <div>
      {query.data.data.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      
      <Button onClick={() => query.refetch()}>
        Refresh
      </Button>
    </div>
  );
}
```

---

### useApiQueryForm

**Best for:** Search/filter forms.

```typescript
import { useApiQueryForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query-form";

function UserSearch() {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const { form, response, submitForm } = useApiQueryForm(
    searchUsersEndpoint,
    {},
    {
      defaultValues: {
        query: "",
        status: "ACTIVE",
      },
    },
    {
      enabled: true,
      debounceMs: 300, // Debounce form submissions
    },
    logger,
  );

  return (
    <div>
      <Form form={form} onSubmit={submitForm}>
        <FormField name="query" placeholder="Search..." />
        <FormField name="status" />
        <Button type="submit">Search</Button>
      </Form>
      
      {response?.success && (
        <div>
          {response.data.results.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 React Native Usage

**All hooks work identically in React Native:**

```typescript
import { View, Text, TextInput, Button } from "react-native";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";

function LoginScreen() {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const { form, submitForm, mutation } = useApiForm(loginEndpoint, logger);

  return (
    <View>
      <TextInput
        value={form.watch("email")}
        onChangeText={(text) => form.setValue("email", text)}
        placeholder="Email"
      />
      
      <TextInput
        value={form.watch("password")}
        onChangeText={(text) => form.setValue("password", text)}
        placeholder="Password"
        secureTextEntry
      />
      
      <Button
        title={mutation.isPending ? "Logging in..." : "Login"}
        onPress={() => submitForm()}
        disabled={mutation.isPending}
      />
      
      {mutation.isError && (
        <Text style={{ color: "red" }}>
          {mutation.error.error.message}
        </Text>
      )}
    </View>
  );
}
```

---

## 🔑 Key Features

### 1. Type Safety

All hooks are fully type-safe based on endpoint definitions:

```typescript
const { form } = useApiForm(loginEndpoint, logger);

form.setValue("email", "user@example.com"); // ✅ Type-safe
form.setValue("email", 123);                 // ❌ Type error
form.setValue("invalid", "value");           // ❌ Type error
```

### 2. Automatic Validation

Zod schemas from endpoint definitions are automatically used:

```typescript
// In definition.ts
email: z.string().email()

// In component
form.setValue("email", "invalid"); // ❌ Validation error on submit
```

### 3. Form Persistence

Forms can persist to localStorage:

```typescript
const { form } = useApiForm(endpoint, logger, {
  persistForm: true, // Automatically saves/restores form data
});
```

### 4. Auto-Prefill

Forms can auto-fill from GET endpoint data:

```typescript
const user = useEndpoint(
  { GET: getUserEndpoint, PUT: updateUserEndpoint },
  { autoPrefill: true }, // PUT form auto-fills from GET data
  logger,
);
```

---

## 🎯 Summary

**Five hooks for different use cases:**

1. **useEndpoint** - All-in-one CRUD
2. **useApiForm** - Forms with mutations
3. **useApiMutation** - Mutations without forms
4. **useApiQuery** - Queries without forms
5. **useApiQueryForm** - Search/filter forms

**All hooks:**
- Work in React and React Native
- Are fully type-safe
- Handle loading/error states
- Support callbacks
- Use Zod validation

---

**See also:**
- **[Recursive API Folder Structure](RECURSIVE_API_FOLDERS.md)** - How folders map to routes
- **[Endpoint Anatomy](ENDPOINT_ANATOMY.md)** - What goes in each folder
- **[I18n Structure](I18N_STRUCTURE_RULES.md)** - Translation system

