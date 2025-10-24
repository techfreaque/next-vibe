# React Native Expo Router Utilities

This directory contains reusable utilities for bridging Next.js components with Expo Router.

## Next.js Compatibility Wrappers

The `nextjs-compat-wrapper.tsx` module provides utilities to make Next.js 15 async Server Components work seamlessly in Expo Router.

### Key Features

- **Async to Sync Conversion**: Converts Next.js async components to synchronous Expo Router components
- **Params Format Conversion**: Transforms Next.js 15's `Promise<params>` format to Expo Router's synchronous params
- **React 19 Compatible**: Uses `queueMicrotask` to avoid Suspense issues
- **Type-Safe**: Full TypeScript support with generic params
- **Error Handling**: Built-in error states and logging
- **Loading States**: ActivityIndicator during async operations
- **Cancellation Support**: Properly cancels async operations on unmount

### Usage

#### Basic Page Wrapper

For standard pages with loading and error UI:

```tsx
// src/packages/react-native-comp/app/[locale]/profile/index.tsx
import { createPageWrapper } from "@/packages/react-native-comp/utils";
import PageComponent from "./page";

export default createPageWrapper(PageComponent);
```

#### Layout Wrapper

For layouts that use Expo Router's `Slot`:

```tsx
// src/packages/react-native-comp/app/[locale]/_layout.tsx
import { createLayoutWrapper } from "@/packages/react-native-comp/utils";
import LayoutComponent from "./layout";

export default createLayoutWrapper(LayoutComponent);
```

#### Advanced Page Wrapper with Custom Options

For pages that need custom loading/error components:

```tsx
import { createPageWrapperWithOptions } from "@/packages/react-native-comp/utils";
import { ActivityIndicator, Text, View } from "react-native";
import PageComponent from "./page";

export default createPageWrapperWithOptions(PageComponent, {
  // Custom loading component
  loadingComponent: (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 10 }}>Loading awesome content...</Text>
    </View>
  ),

  // Custom error component
  errorComponent: (error, locale) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, color: "red" }}>Oops!</Text>
      <Text style={{ marginTop: 10 }}>{error.message}</Text>
    </View>
  ),

  // Additional params to merge
  additionalParams: {
    source: "mobile-app",
  },
});
```

### Architecture

#### Why These Wrappers?

Next.js 15 introduced async Server Components with this signature:

```tsx
export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  // ...
}
```

Expo Router uses synchronous params:

```tsx
export default function Page() {
  const params = useLocalSearchParams<{ locale: string }>();
  // params.locale is immediately available
}
```

These wrappers bridge the gap, allowing you to:

1. Write components once in Next.js format
2. Reuse them in both Next.js web and Expo Router native apps
3. Maintain type safety across platforms

#### Technical Details

**queueMicrotask Pattern**

We use `queueMicrotask` to defer promise creation outside React's render phase:

```tsx
queueMicrotask(() => {
  void (async () => {
    const result = await Component({ params: Promise.resolve(params) });
    setContent(result);
  })();
});
```

This prevents React 19's Suspense from detecting uncached promises and throwing errors.

**Layout Constraints**

Layout routes in Expo Router can only contain `Screen` children. Therefore, `createLayoutWrapper`:
- Uses `<Slot />` for children rendering
- Cannot show custom loading UI
- Falls back to `<Slot />` on errors

**Cancellation**

All wrappers implement proper cleanup:

```tsx
useEffect(() => {
  let cancelled = false;

  // async operations...

  return () => {
    cancelled = true;
  };
}, [deps]);
```

This prevents state updates on unmounted components.

### Type Definitions

```tsx
// Next.js page props
interface NextPageProps<TParams = Record<string, unknown>> {
  params: Promise<TParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Next.js layout props
interface NextLayoutProps<TParams = Record<string, unknown>> {
  params: Promise<TParams>;
  children: React.ReactNode;
}

// Expo Router params (must include locale)
interface ExpoRouterParams extends Record<string, string | string[]> {
  locale: CountryLanguage;
}
```

### Translation Keys

The wrappers use these translation keys for error messages:

- `packages.react-native-comp.utils.nextjs-compat-wrapper.failedToLoadPage`

Make sure these keys exist in your i18n files for each locale.

### Best Practices

1. **Always use the wrapper**: Never import Next.js page/layout components directly in Expo Router
2. **Keep it simple**: Use `createPageWrapper` and `createLayoutWrapper` for most cases
3. **Custom options sparingly**: Only use `createPageWrapperWithOptions` when you need custom UI
4. **Type your params**: Always provide type parameters for type-safe route params
5. **Test both platforms**: Verify your components work in both Next.js web and Expo native

### Example Project Structure

```
src/packages/react-native-comp/app/[locale]/
├── _layout.tsx          # Uses createLayoutWrapper
├── index.tsx            # Uses createPageWrapper
├── page.tsx             # Next.js page component
├── layout.tsx           # Next.js layout component
├── profile/
│   ├── index.tsx        # Uses createPageWrapper
│   └── page.tsx         # Next.js page component
└── settings/
    ├── index.tsx        # Uses createPageWrapper
    └── page.tsx         # Next.js page component
```

### Related Files

- `platform-helpers.ts`: Platform detection and helpers
- `index.ts`: Main exports for the utils package

### Contributing

When adding new wrapper variants:

1. Follow the existing pattern of `createXWrapper` factory functions
2. Include full JSDoc comments
3. Add examples to this README
4. Ensure type safety with generics
5. Test on both iOS and Android
