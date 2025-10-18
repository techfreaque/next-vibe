# next-vibe

A lightweight, type-safe API client and server framework for Next.js applications with integrated WebSocket support.

## Features

- 🔒 **Type-safe**: Full TypeScript support with Zod schema validation
- 🚀 **Performance**: Optimized for minimal re-renders and efficient data fetching
- 🧪 **Testing**: Integrated testing utilities with data factories
- 📚 **Documentation**: Automatic API documentation generation
- 🔄 **Real-time**: WebSocket support for real-time updates
- 🧩 **Modular**: Use only what you need
- 🔐 **Role-Based Access Control**: Built-in user role management and authorization
- 📝 **Form Integration**: Form handling with validation and API integration

## Getting Started

### Installation

```bash
npm install next-vibe
# or
yarn add next-vibe
# or
pnpm add next-vibe
```

### Server-Side Setup

Initialize the API library in your application:

```typescript

```

### Define an API Endpoint

```typescript

```

### Implement the API Route Handler

```typescript

```

### Use the API Client in Your Components

```tsx

```

## WebSocket Notifications

next-vibe includes built-in support for WebSockets using Socket.IO, making it easy to implement real-time notifications.

### Setting Up WebSocket Server

The WebSocket server is automatically set up when you initialize the API library with WebSocket options:

```typescript

```

### Using Notifications in Components

```tsx

```

### Sending Notifications from the Server

```typescript

```

## Data Factory System

next-vibe includes a powerful data factory system for generating consistent test data, API examples, and database seeds.

### Creating a Data Factory

```typescript

```

### Using Data Factories in Tests

```typescript

```

### Using Data Factories for Database Seeding

```typescript

```

## Performance Optimizations

next-vibe includes several performance optimizations:

1. **Minimal re-renders**: Hooks are optimized to prevent unnecessary re-renders
2. **Caching**: Responses are cached in memory and can be persisted to localStorage
3. **Deduplication**: Duplicate requests are automatically deduplicated
4. **Stale-while-revalidate**: Data is served from cache while being refreshed in the background
5. **Selective updates**: Only affected components are re-rendered when data changes

## API Reference

### Server-Side APIs

### Client-Side Hooks

### Testing Utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
