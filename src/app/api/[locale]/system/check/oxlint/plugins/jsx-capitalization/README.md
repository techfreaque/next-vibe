# oxlint-plugin-jsx-capitalization

Oxlint plugin that enforces the use of capitalized JSX components from `next-vibe-ui` instead of lowercase HTML elements.

## Features

- ✅ Detects lowercase JSX elements (div, p, a, button, etc.)
- ✅ Provides helpful error messages with suggested imports
- ✅ Automatically excludes files in `/src/packages/next-vibe-ui/web/` directory
- ✅ Supports disable comments

## Installation

This plugin is part of the monorepo and is built automatically.

```bash
npm run build
```

## Usage

The plugin is configured in the oxlint configuration file:

```json
{
  "jsPlugins": [
    "oxlint-plugin-jsx-capitalization"
  ],
  "rules": {
    "oxlint-plugin-jsx-capitalization/jsx-capitalization": "error"
  }
}
```

## Error Examples

### Common UI Components

#### ❌ Bad
```tsx
function MyComponent() {
  return <div>Hello World</div>;
}
```

**Error message:**
```
Use platform-independent <Div> component instead of <div>.
import { Div } from "next-vibe-ui/ui/div";
```

#### ✅ Good
```tsx
import { Div } from "next-vibe-ui/ui/div";

function MyComponent() {
  return <Div>Hello World</Div>;
}
```

### Typography Components

#### ❌ Bad
```tsx
function Article() {
  return (
    <>
      <h2>Title</h2>
      <p>Paragraph text</p>
    </>
  );
}
```

**Error messages:**
```
Use typography component <H2> instead of <h2>.
import { H2 } from "next-vibe-ui/ui/typography";

Use typography component <P> instead of <p>.
import { P } from "next-vibe-ui/ui/typography";
```

#### ✅ Good
```tsx
import { H2, P } from "next-vibe-ui/ui/typography";

function Article() {
  return (
    <>
      <H2>Title</H2>
      <P>Paragraph text</P>
    </>
  );
}
```

### Image Components

#### ❌ Bad
```tsx
function Avatar() {
  return <img src="/avatar.png" alt="User" />;
}
```

**Error message:**
```
Use platform-independent <Image> component instead of <img>.
import { Image } from "next-vibe-ui/ui/image";
```

#### ✅ Good
```tsx
import { Image } from "next-vibe-ui/ui/image";

function Avatar() {
  return <Image src="/avatar.png" alt="User" />;
}
```

### SVG Elements

#### ❌ Bad
```tsx
function Icon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
    </svg>
  );
}
```

**Error message:**
```
SVG element <svg> detected. For icons, use components from
next-vibe-ui/ui/icons instead. For custom SVG, create
platform-independent components using react-native-svg that
work on both web and native.
```

#### ✅ Good
```tsx
// Option 1: Use existing icon components
import { CheckIcon } from "next-vibe-ui/ui/icons/Check";

function Success() {
  return <CheckIcon />;
}

// Option 2: Create custom SVG component with react-native-svg
import Svg, { Path } from "react-native-svg";

function CustomIcon() {
  return (
    <Svg viewBox="0 0 24 24">
      <Path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
    </Svg>
  );
}
```

## Excluded Paths

Files in the following directory are automatically excluded:
- `/src/packages/next-vibe-ui/web/`

## Disable Comments

You can disable the rule for specific lines using comments:

```tsx
// eslint-disable-next-line oxlint-plugin-jsx-capitalization/jsx-capitalization
<div>This is allowed</div>

// oxlint-disable-next-line jsx-capitalization
<p>This is also allowed</p>
```

## Element Categories

The plugin checks for **ALL lowercase JSX elements** and provides context-specific error messages:

### 1. Typography Components
Import from `next-vibe-ui/ui/typography`:
- **Headings:** h1, h2, h3, h4 → H1, H2, H3, H4
- **Text:** p → P
- **Quotes:** blockquote → BlockQuote
- **Code:** code → Code

### 2. Standalone UI Components
Import individually from `next-vibe-ui/ui/{component}`:
- **Text:** span → Span (from `next-vibe-ui/ui/span`)
- **Code blocks:** pre → Pre (from `next-vibe-ui/ui/pre`)

### 3. Common UI Components
Import from `next-vibe-ui/ui/{element}`:
- **Containers:** div, section, article, aside, header, footer, main, nav
- **Interactive:** button, input, textarea, select, label, form
- **Lists:** ul, ol, li
- **Tables:** table, thead, tbody, tr, th, td
- **Links:** link
- **And many more...**

### 4. Image Components
Import from `next-vibe-ui/ui/image`:
- **Images:** img, picture → Image

### 5. SVG Elements
**Suggests using icon components or react-native-svg:**
- svg, path, circle, rect, polygon, etc.
- For icons: Use components from `next-vibe-ui/ui/icons`
- For custom SVG: Use `react-native-svg` for platform independence

### 6. Unknown Elements
For any element without a known wrapper component, the plugin suggests:
1. Creating `next-vibe-ui/web/ui/{element}.tsx` for web
2. Creating `next-vibe-ui/native/ui/{element}.tsx` for React Native
3. Or using an existing component if available

**Note:** The plugin uses dynamic lowercase detection, so it catches **any** element starting with a lowercase letter.

## Development

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run dev
```

### Clean

```bash
npm run clean
```

## License

MIT
