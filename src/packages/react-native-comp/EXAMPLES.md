# React Native Override Examples

This document provides examples of how to create platform-specific implementations for React Native while keeping the Next.js web version unchanged.

## How It Works

The Metro bundler is configured to prioritize `.native.tsx` files over `.tsx` files. When you import a component or page:

1. Metro first looks for `filename.native.tsx`
2. If not found, it falls back to `filename.tsx`
3. This allows you to override specific files for React Native without changing the web version

## File Extension Priority

```
.native.tsx  →  Highest priority (React Native only)
.native.ts   →  High priority (React Native only)
.tsx         →  Standard (shared between web and native)
.ts          →  Standard (shared between web and native)
```

## Example 1: Override a Page Component

### Web Version (Unchanged)
**Location:** `src/app/[locale]/help/page.tsx`

```tsx
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Help" };
}

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      <h1>Help Page</h1>
      <Link href="/">Go Home</Link>
    </main>
  );
}
```

### Native Override
**Location:** `src/app/[locale]/help/page.native.tsx`

```tsx
import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";

// Note: generateMetadata is not exported (not used in React Native)

export default function HelpPage() {
  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <Text className="text-2xl font-bold">Help Page</Text>
        <Link href="/">Go Home</Link>
      </View>
    </ScrollView>
  );
}
```

## Example 2: Override a Component

### Web Version (Unchanged)
**Location:** `src/app/[locale]/help/_components/contact-form.tsx`

```tsx
"use client";

import { Button } from "@/packages/next-vibe-ui/web/ui/button";

export default function ContactForm() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Native Override
**Location:** `src/app/[locale]/help/_components/contact-form.native.tsx`

```tsx
import { View, TextInput } from "react-native";
import { Button } from "@/packages/next-vibe-ui/web/ui/button"; // Auto-mapped to native

export default function ContactForm() {
  return (
    <View>
      <TextInput
        className="border p-2 rounded"
        placeholder="Email"
        keyboardType="email-address"
      />
      <Button onPress={() => console.log("Submit")}>
        Submit
      </Button>
    </View>
  );
}
```

## Example 3: Shared Component with Platform-Specific Code

Sometimes you want to share most of the code but have small platform-specific sections:

**Location:** `src/app/[locale]/profile/page.tsx`

```tsx
import { Platform, View, Text } from "react-native";
import type { Metadata } from "next";

// Only exported on web, ignored on native
export const generateMetadata = Platform.OS === "web" ?
  async (): Promise<Metadata> => ({ title: "Profile" }) :
  undefined;

export default function ProfilePage() {
  return (
    <View>
      <Text>Profile Page</Text>
      {Platform.OS === "native" && (
        <Text>Native-only content</Text>
      )}
      {Platform.OS === "web" && (
        <p>Web-only content</p>
      )}
    </View>
  );
}
```

## Example 4: UI Component Auto-Mapping

The Metro bundler automatically maps web UI imports to native equivalents:

```tsx
// This import works on both platforms!
import { Button } from "@/packages/next-vibe-ui/web/ui/button";

// On web: uses src/packages/next-vibe-ui/web/ui/button.tsx
// On native: automatically resolves to src/packages/next-vibe-ui/native/ui/packages/reusables/src/components/ui/button.tsx
```

## Example 5: Creating a Native-Only Feature

**Location:** `src/app/[locale]/camera/page.native.tsx`

```tsx
import { View, Text, Button } from "react-native";
import { Camera } from "expo-camera";
import { useState } from "react";

export default function CameraPage() {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Camera permission required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <Camera className="flex-1" />
  );
}
```

Since there's no `camera/page.tsx` file, this route only exists on React Native!

## Best Practices

### 1. Start with Shared Code
- Always try to share code between platforms first
- Only create `.native.tsx` overrides when absolutely necessary
- Use `Platform.OS` checks for small differences

### 2. UI Component Imports
- Always import from `@/packages/next-vibe-ui/web/ui/...`
- Metro will automatically resolve to native components
- This keeps imports consistent across platforms

### 3. Conditional Exports
```tsx
import { Platform } from "react-native";

// Only export metadata on web
export const generateMetadata = Platform.OS === "web"
  ? async () => ({ title: "Page" })
  : undefined;
```

### 4. Testing Both Platforms
```bash
# Test web version
bun run dev

# Test native version
cd src/packages/react-native-comp
bun run start
```

### 5. TypeScript Support
The tsconfig.json is configured to:
- Include both `.tsx` and `.native.tsx` files
- Exclude `.web.tsx` files (Next.js specific)
- Map UI imports correctly

## Common Patterns

### Navigation
```tsx
// Next.js
import Link from "next/link";
<Link href="/about">About</Link>

// React Native
import { Link } from "expo-router";
<Link href="/about">About</Link>
```

### Styling
```tsx
// Both platforms support Tailwind via NativeWind
<View className="flex-1 bg-blue-500 p-4">
  <Text className="text-white text-2xl">Hello</Text>
</View>
```

### Images
```tsx
// Next.js
import Image from "next/image";
<Image src="/logo.png" alt="Logo" width={100} height={100} />

// React Native
import { Image } from "react-native";
<Image source={require("../../../public/logo.png")} style={{ width: 100, height: 100 }} />
```

## Debugging Tips

1. **Module Resolution Issues**: Check Metro bundler logs for resolution warnings
2. **TypeScript Errors**: Ensure both tsconfig.json files are properly configured
3. **Import Errors**: Verify path aliases in metro.config.cjs and tsconfig.json match
4. **Component Not Found**: Check if native equivalent exists in native UI directory

## Summary

- Metro bundler prioritizes `.native.tsx` over `.tsx`
- UI imports are automatically mapped from web to native
- Share code by default, override only when needed
- Use Platform.OS for conditional logic
- Test both platforms regularly
