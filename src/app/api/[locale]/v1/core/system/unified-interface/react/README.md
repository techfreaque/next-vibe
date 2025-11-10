# React Integration

**Type-safe React hooks for API endpoints**

## Overview

React integration provides type-safe hooks for calling API endpoints. Uses React Query for caching, optimistic updates, and automatic refetching.

## Quick Start

```typescript
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import definitions from "./definition";

function CreateUserForm() {
  const endpoint = useEndpoint(definitions);

  const handleSubmit = async (data) => {
    const result = await endpoint.create?.mutateAsync(data);
    if (result?.success) {
      console.log("User created:", result.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* form fields */}
    </Form>
  );
}
```

## Hook API

### useEndpoint

Main hook for interacting with endpoints.

```typescript
const endpoint = useEndpoint(
  definitions, // Endpoint definitions
  { queryOptions }, // React Query options (optional)
);
```

**Returns**:

```typescript
{
  // For GET requests
  read?: {
    response: ResponseType | undefined,
    isLoading: boolean,
    error: ErrorResponseType | null,
    refetch: () => Promise<void>,
  },

  // For POST/PUT/PATCH requests (create/update)
  create?: {
    values: RequestOutput,
    setValue: (name: string, value: unknown) => void,
    onSubmit: (e?: FormEvent) => Promise<void>,
    mutateAsync: (data: RequestOutput) => Promise<ResponseOutput>,
    reset: () => void,
    isSuccess: boolean,
    isDirty: boolean,
    isSubmitting: boolean,
    error: ErrorResponseType | null,
  },

  // For DELETE requests
  delete?: {
    mutateAsync: (data: RequestOutput) => Promise<ResponseOutput>,
    isSubmitting: boolean,
    error: ErrorResponseType | null,
  },

  // Combined states
  isLoading: boolean,
  error: ErrorResponseType | null,
  alert: FormAlertState | null,
}
```

### GET Requests

```typescript
const endpoint = useEndpoint(definitions, {
  enabled: true, // Auto-fetch on mount
  refetchOnWindowFocus: true, // Refetch on focus
  staleTime: 60000, // 1 minute
});

// Access data
const { response, isLoading, error } = endpoint.read || {};

// Manual refetch
await endpoint.read?.refetch();
```

### POST/PUT/PATCH Requests (Create/Update)

```typescript
const endpoint = useEndpoint(definitions);

// Async mutation
const result = await endpoint.create?.mutateAsync({
  email: "john@example.com",
  name: "John Doe",
});

// Form submission
await endpoint.create?.onSubmit(e);

// Check states
if (endpoint.create?.isSubmitting) {
  // Show loading state
}

if (endpoint.create?.isSuccess) {
  // Show success message
}
```

### DELETE Requests

```typescript
const endpoint = useEndpoint(definitions);

// Async deletion
const result = await endpoint.delete?.mutateAsync({ id: userId });
```

## Type Safety

All types are automatically inferred from definitions:

```typescript
// definition.ts
export type UserCreateRequestInput = typeof POST.types.RequestInput;
export type UserCreateRequestOutput = typeof POST.types.RequestOutput;
export type UserCreateResponseInput = typeof POST.types.ResponseInput;
export type UserCreateResponseOutput = typeof POST.types.ResponseOutput;

// React component
const endpoint = useEndpoint(definitions);

// TypeScript knows the exact types
const result = await endpoint.create?.mutateAsync({
  email: "john@example.com", // ✓ Type-safe
  name: "John Doe", // ✓ Type-safe
  // invalid: "field"         // ✗ Type error
});
```

## Caching

React Query handles caching automatically:

```typescript
const endpoint = useEndpoint(definitions, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Optimistic Updates

Optimistic updates can be implemented at the React Query level by accessing the underlying mutation:

```typescript
// The useEndpoint hook internally uses React Query
// For advanced use cases, use useApiMutation directly
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-api-mutation";

const mutation = useApiMutation(definitions.POST, {
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(["users"]);

    // Snapshot previous value
    const previous = queryClient.getQueryData(["users"]);

    // Optimistically update
    queryClient.setQueryData(["users"], (old) => [...old, newData]);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(["users"], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(["users"]);
  },
});
```

## Error Handling

```typescript
const endpoint = useEndpoint(definitions);

// Error state is automatically tracked
if (endpoint.error) {
  console.error(endpoint.error.message);
}

// Alert state provides formatted errors
if (endpoint.alert?.variant === "destructive") {
  // Show error alert
}

// Manual error handling
try {
  const result = await endpoint.create?.mutateAsync(data);
  if (!result.success) {
    // Handle API error
    console.error(result.message);
  }
} catch (error) {
  // Handle network error
  console.error(error);
}
```

## Loading States

```typescript
function UserList() {
  const endpoint = useEndpoint(definitions);

  if (endpoint.isLoading) {
    return <Spinner />;
  }

  if (endpoint.error) {
    return <Error message={endpoint.error.message} />;
  }

  return (
    <ul>
      {endpoint.read?.response?.data?.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Pagination

```typescript
function UserList() {
  const [page, setPage] = useState(1);

  // For pagination, pass page in URL params or request data
  const endpoint = useEndpoint(definitions, {
    urlPathParams: { page },
  });

  return (
    <>
      <ul>
        {endpoint.read?.response?.data?.users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={() => setPage(p => p - 1)}>Previous</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </>
  );
}
```

## Infinite Scroll

```typescript
// Infinite scroll is not directly supported by useEndpoint
// For infinite scroll, use React Query's useInfiniteQuery directly
import { useInfiniteQuery } from '@tanstack/react-query';

function UserList() {
  const query = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <>
      {query.data?.pages.map(page => (
        page.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))
      ))}
      {query.hasNextPage && (
        <button onClick={() => query.fetchNextPage()}>
          Load More
        </button>
      )}
    </>
  );
}
```

## Dependent Queries

```typescript
function UserProfile({ userId }) {
  // First query
  const userEndpoint = useEndpoint(userDefinitions, {
    urlPathParams: { userId },
  });

  // Second query depends on first
  const postsEndpoint = useEndpoint(postsDefinitions, {
    urlPathParams: { userId },
    enabled: !!userEndpoint.read?.response?.success,
  });

  return (
    <>
      <h1>{userEndpoint.read?.response?.data?.name}</h1>
      <ul>
        {postsEndpoint.read?.response?.data?.posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
```

## Mutations with Invalidation

```typescript
function CreateUserForm() {
  const queryClient = useQueryClient();
  const endpoint = useEndpoint(definitions);

  const handleSubmit = async (data) => {
    const result = await endpoint.create?.mutateAsync(data);
    if (result?.success) {
      // Invalidate and refetch
      queryClient.invalidateQueries(['users']);
    }
  };

  return <Form onSubmit={handleSubmit}>{/* ... */}</Form>;
}
```

## Best Practices

### 1. Use URL Path Params

```typescript
const endpoint = useEndpoint(definitions, {
  urlPathParams: { userId }, // Pass dynamic URL parameters
});
```

### 2. Handle Loading States

```typescript
if (endpoint.isLoading) return <Spinner />;
if (endpoint.error) return <Error />;
```

### 3. Invalidate After Mutations

```typescript
const handleSubmit = async (data) => {
  const result = await endpoint.create?.mutateAsync(data);
  if (result?.success) {
    queryClient.invalidateQueries(["users"]);
  }
};
```

### 4. Use Alert State

```typescript
{endpoint.alert && (
  <Alert variant={endpoint.alert.variant}>
    <AlertTitle>{t(endpoint.alert.title.message)}</AlertTitle>
    <AlertDescription>{t(endpoint.alert.message.message)}</AlertDescription>
  </Alert>
)}
```

## Troubleshooting

**"Hook not updating"**

- Check urlPathParams are correctly passed
- Verify staleTime configuration
- Use invalidateQueries after mutations

**"Type errors"**

- Ensure definitions are correctly exported
- Check Zod schemas in definition.ts
- Verify endpoint method types match

**"Network errors"**

- Check API endpoint is running
- Verify authentication is working
- Check endpoint route.ts exists

## Related

- [Main README](../README.md)
- [AI README](../ai/README.md)
- [CLI README](../cli/README.md)
- [React Native README](../react-native/README.md)
