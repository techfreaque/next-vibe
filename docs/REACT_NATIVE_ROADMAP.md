# React Native Support Roadmap

**Goal: Single codebase for Web (Next.js) + Mobile (React Native/Expo) - Zero extra user code**

---

## 🎯 Vision

NextVibe will support React Native/Expo with **the exact same code**. No separate files, no platform-specific components (unless you want them).

**Key Principles:**

1. **Single codebase** - ONE page.tsx works for both web and native
2. **Framework handles everything** - Automatic mapping from Next.js to Expo
3. **Path override** - Framework remaps UI imports (web → native)
4. **Optional platform extensions** - .native.tsx and .web.tsx only when you need customization
5. **Zero extra user code** - Write once, runs everywhere

---

## 🏗️ Architecture

### How It Works

**Single page.tsx file works everywhere:**

```typescript
// src/app/[locale]/(auth)/login/page.tsx
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useLogin } from "@/app/api/[locale]/v1/core/user/public/login/hooks";

export default function LoginPage() {
  const { form, submitForm } = useLogin();

  return (
    <Div className="flex-1 items-center justify-center">
      <Input
        value={form.watch("email")}
        onChange={(e) => form.setValue("email", e.target.value)}
      />
      <Button onPress={() => submitForm()}>Login</Button>
    </Div>
  );
}
```

**On Web (Next.js):**

- `@/ui/button` → `src/packages/next-vibe-ui/web/ui/button.tsx` (shadcn/ui)
- `<Div>` renders as HTML `<div>`
- `onChange` works

**On Native (Expo):**

- Framework automatically maps `page.tsx` to Expo screen
- `@/ui/button` → `src/packages/next-vibe-ui/native/ui/button.tsx` (react-native-reusables)
- `<Div>` renders as `<View>` (NativeWind)
- `onChange` → `onChangeText` (framework handles)

**Zero changes to user code. Framework does all the mapping.**

---

## 🔧 Technical Implementation

### 1. Path Resolution (Framework-Level)

**The framework automatically remaps UI imports based on platform.**

**User writes:**

```typescript
import { Button } from "@/ui/button";
```

**Framework resolves:**

**Web (Next.js):**

```
@/ui/button → src/packages/next-vibe-ui/web/ui/button.tsx
```

**Native (Expo):**

```
@/ui/button → src/packages/next-vibe-ui/native/ui/packages/reusables/src/components/ui/button.tsx
```

**Implementation:**

**next.config.js:**

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.alias["@/ui"] = path.resolve(__dirname, "src/packages/next-vibe-ui/web/ui");
    return config;
  },
};
```

**metro.config.js (Expo):**

```javascript
module.exports = {
  resolver: {
    extraNodeModules: {
      "@/ui": path.resolve(__dirname, "src/packages/next-vibe-ui/native/ui/packages/reusables/src/components/ui"),
    },
  },
};
```

**User never touches these configs. Framework provides them.**

### 2. UI Component Interface Alignment

**Goal:** Web and Native components have identical interfaces.

**Web (shadcn/ui):**

```typescript
// src/packages/next-vibe-ui/web/ui/button.tsx
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button({ variant, size, children, onPress, ...props }: ButtonProps) {
  return (
    <button onClick={onPress} className={cn(/* ... */)} {...props}>
      {children}
    </button>
  );
}
```

**Native (react-native-reusables):**

```typescript
// src/packages/next-vibe-ui/native/ui/packages/reusables/src/components/ui/button.tsx
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button({ variant, size, children, onPress, ...props }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={cn(/* ... */)} {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
}
```

**Same interface = same user code:**

```typescript
import { Button } from "@/ui/button";

<Button variant="default" size="lg" onPress={() => console.log("clicked")}>
  Login
</Button>
```

**Works on web and native without changes.**

### 3. NativeWind Support

**NativeWind** brings Tailwind CSS to React Native.

**Setup:**

```bash
# Install NativeWind
npm install nativewind
npm install --save-dev tailwindcss
```

**Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Usage:**

```typescript
import { View, Text } from "react-native";

<View className="flex-1 items-center justify-center bg-background">
  <Text className="text-2xl font-bold text-foreground">
    Hello World
  </Text>
</View>
```

**Same Tailwind classes work on web and native!**

### 4. Expo Router Integration

**Framework automatically maps page.tsx to Expo screens.**

**Next.js structure:**

```
src/app/[locale]/(auth)/login/page.tsx
```

**Framework generates Expo structure:**

```
app/(auth)/login.tsx  # Auto-generated, imports page.tsx
```

**Auto-generated Expo screen:**

```typescript
// app/(auth)/login.tsx (generated by framework)
import LoginPage from "@/app/[locale]/(auth)/login/page";

export default LoginPage;
```

**User only writes page.tsx once. Framework handles Expo mapping.**

**No manual screen files. No duplication. Zero extra code.**

### 5. Optional Platform Extensions

**By default, single file works everywhere.**

But when you need platform-specific code:

```typescript
// page.tsx - Default, works on both platforms
export default function LoginPage() {
  return <LoginForm />;
}

// page.web.tsx - Only used on web (optional)
export default function LoginPage() {
  return <LoginFormWithWebOnlyFeature />;
}

// page.native.tsx - Only used on native (optional)
export default function LoginPage() {
  return <LoginFormWithNativeOnlyFeature />;
}
```

**Framework resolution:**

1. Check for `page.web.tsx` (web) or `page.native.tsx` (native)
2. If not found, use `page.tsx`

**Same for components:**

```typescript
// Button.tsx - Works everywhere
// Button.web.tsx - Web-specific (optional)
// Button.native.tsx - Native-specific (optional)
```

**Use extensions only when needed. 99% of code uses single file.**

---

## 📋 Implementation Plan

### Phase 1: Foundation

**Goal:** Setup Expo and path resolution

- [ ] Setup Expo project in same repo
- [ ] Configure metro.config.js for path resolution (@/ui → native)
- [ ] Install NativeWind
- [ ] Setup react-native-reusables
- [ ] Test basic path resolution

### Phase 2: Component Interface Alignment

**Goal:** Make web and native components have identical interfaces

- [ ] Audit all shadcn/ui components
- [ ] Ensure react-native-reusables components match interface
- [ ] Add missing props (e.g., onPress on web Button)
- [ ] Test all components on both platforms
- [ ] Document any unavoidable differences

### Phase 3: Page.tsx → Expo Mapping

**Goal:** Automatic page.tsx to Expo screen generation

- [ ] Build generator that scans src/app/[locale]
- [ ] Generate app/ folder for Expo from page.tsx files
- [ ] Handle route groups (auth), (tabs), etc.
- [ ] Test navigation
- [ ] Test deep linking

### Phase 4: Platform Extension Support

**Goal:** Optional .web.tsx and .native.tsx support

- [ ] Implement resolution logic (check .web/.native first, fallback to base)
- [ ] Test with Metro bundler
- [ ] Test with Next.js webpack
- [ ] Document when to use extensions

### Phase 5: Testing & Polish

**Goal:** Production-ready

- [ ] E2E testing (Detox)
- [ ] Test on iOS and Android
- [ ] Performance optimization
- [ ] Offline support
- [ ] Push notifications
- [ ] App store deployment guides

---

## 🎯 Success Criteria

**When React Native support is complete:**

1. ✅ Write ONE page.tsx, works on web and native
2. ✅ Framework handles all platform mapping
3. ✅ Path resolution automatic (@/ui → web or native)
4. ✅ UI components have identical interfaces
5. ✅ Optional .web.tsx and .native.tsx extensions work
6. ✅ NativeWind working with Tailwind classes
7. ✅ Expo Router auto-generated from page.tsx files
8. ✅ Builds and runs on iOS and Android
9. ✅ Zero extra user code required
10. ✅ Documentation complete

**Key metric: User writes ZERO platform-specific code unless they want to.**

---

## 🚧 Current Status

**Status:** Not started (Milestone 3)

**Blockers:**

1. Translation type errors must be fixed first (Milestone 1)
2. Code quality review needed (Milestone 2)

**Next Steps:**

1. Fix all translation type errors
2. Code quality review and cleanup
3. Begin Phase 1: Foundation

---

## 📚 Resources

- **NativeWind:** <https://www.nativewind.dev/>
- **react-native-reusables:** <https://github.com/mrzachnugent/react-native-reusables>
- **Expo Router:** <https://docs.expo.dev/router/introduction/>
- **shadcn/ui:** <https://ui.shadcn.com/>

---

## ⚠️ Important: Component Colocation is Separate

**Component colocation (moving UI to API folders) is NOT part of React Native support.**

These are two separate milestones:

**Milestone 3: React Native Support**

- Single codebase for web + native
- Path resolution
- page.tsx → Expo mapping
- Platform extensions (.web/.native)

**Milestone 4: Component Colocation** (separate from React Native)

- Move components from src/app/[locale]/(pages) to src/app/api/[locale]/v1/core/(endpoints)/components/
- Colocate UI with business logic
- Page structure becomes composition layer
- Works on BOTH web and native (because React Native is already done)

**They are independent. React Native doesn't require component colocation.**

---

**React Native support will make NextVibe a true universal framework - one codebase, web + mobile, 100% type-safe, zero extra code.**
