# Repository Patterns

Repositories (`repository.ts`) contain all business logic and data access. Implemented as **static classes**.

## Core Principles

### 1. Static Class Pattern

```typescript
// ✅ CORRECT
export class UserRepository {
  static async getById(id: string, logger: EndpointLogger): Promise<ResponseType<UserGetResponseOutput>> {
    // ...
  }
}
// Usage: UserRepository.getById(id, logger)

// ❌ WRONG - No instances
export const userRepository = new UserRepositoryImpl();
```

### 2. Private Helpers

Internal methods marked `private static`:

```typescript
export class AuthRepository {
  static async login(data: LoginRequestOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<LoginResponseOutput>> {
    const validationResult = await this.validateCredentials(data, logger);
    if (!validationResult.success) return validationResult;
    return await this.createSession(validationResult.data, logger);
  }

  private static async validateCredentials(data: LoginRequestOutput, logger: EndpointLogger): Promise<ResponseType<ValidatedUser>> {
    // Internal logic
  }

  private static async createSession(user: ValidatedUser, logger: EndpointLogger): Promise<ResponseType<LoginResponseOutput>> {
    // Internal logic
  }
}
```

### 3. ResponseType Everywhere

**ALL methods** (public AND private) return `Promise<ResponseType<T>>` or `ResponseType<T>`. **No exceptions.**

```typescript
export class ItemRepository {
  static async getById(urlPathParams: ItemGetUrlVariablesOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<ItemGetResponseOutput>> {
    const ownershipCheck = await this.validateOwnership(urlPathParams.id, user, logger);
    if (!ownershipCheck.success) return ownershipCheck; // Propagate failure

    const [item] = await db.select().from(items).where(eq(items.id, urlPathParams.id)).limit(1);
    if (!item) {
      return fail({ message: "app.api.items.errors.notFound", errorType: ErrorResponseTypes.NOT_FOUND });
    }
    return success({ id: item.id, name: item.name });
  }

  private static async validateOwnership(itemId: string, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<{ ownerId: string }>> {
    const [item] = await db.select({ userId: items.userId }).from(items).where(eq(items.id, itemId)).limit(1);
    if (!item) {
      return fail({ message: "app.api.items.errors.notFound", errorType: ErrorResponseTypes.NOT_FOUND });
    }
    if (item.userId !== user.id) {
      return fail({ message: "app.api.items.errors.forbidden", errorType: ErrorResponseTypes.FORBIDDEN });
    }
    return success({ ownerId: item.userId });
  }
}
```

### 4. Type Alignment - CRITICAL

**Repository methods MUST use types directly from `definition.ts`. NO transformations.**

```typescript
// definition.ts
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", ":id"],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    { request: "urlPathParams", response: true },
    {
      // Request
      id: requestUrlPathParamsField(
        { type: WidgetType.FORM_FIELD, fieldType: FieldDataType.TEXT },
        z.string()
      ),
      // Response
      id: responseField({ type: WidgetType.TEXT }, z.string()),
      name: responseField({ type: WidgetType.TEXT }, z.string()),
      email: responseField({ type: WidgetType.TEXT }, z.string()),
    }
  ),
});

export type UserGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type UserGetResponseOutput = typeof GET.types.ResponseOutput;

// ✅ CORRECT - Repository returns EXACT type from definition
export class UserRepository {
  static async getById(
    urlPathParams: UserGetUrlVariablesOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, urlPathParams.id)).limit(1);
      if (!user) {
        return fail({
          message: "app.api.users.errors.notFound",
          errorType: ErrorResponseTypes.NOT_FOUND
        });
      }

      // Return EXACT shape from definition - no transformation
      return success({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      logger.error("Failed to get user by ID", { error: parseError(error) });
      return fail({
        message: "app.api.users.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

// ❌ WRONG - Transformation logic doesn't belong here
export class UserRepository {
  static async getById(
    data: UserGetRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<any>> {
    const optionsResult = await this.getOptions(data.id, logger);
    if (!optionsResult.success) return optionsResult;

    const options = optionsResult.data;
    const language = getLanguageFromLocale(locale);

    // ❌ Building complex transformed response
    return success({
      response: {
        success: true,
        message: translateKey("some.key", language),
        data: {
          transformed: options.someField,
          nested: {
            // ... complex transformation
          }
        }
      }
    });
  }
}
```

**Database Types Must Align With Definition Types:**

```typescript
// db.ts
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  // DB has extra fields that definition doesn't need
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// definition.ts - Only expose what's needed
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", ":id"],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    { request: "urlPathParams", response: true },
    {
      id: requestUrlPathParamsField({ type: WidgetType.FORM_FIELD }, z.string()),
      // Response - no passwordHash, no createdAt
      id: responseField({ type: WidgetType.TEXT }, z.string()),
      name: responseField({ type: WidgetType.TEXT }, z.string()),
      email: responseField({ type: WidgetType.TEXT }, z.string()),
    }
  ),
});

// repository.ts - Select what definition needs
static async getById(
  urlPathParams: UserGetUrlVariablesOutput,
  logger: EndpointLogger
): Promise<ResponseType<UserGetResponseOutput>> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, urlPathParams.id))
      .limit(1);

    if (!user) {
      return fail({
        message: "app.api.users.errors.notFound",
        errorType: ErrorResponseTypes.NOT_FOUND
      });
    }

    // Type already matches definition exactly
    return success(user);
  } catch (error) {
    logger.error("Failed to get user by ID", { error: parseError(error) });
    return fail({
      message: "app.api.users.errors.internal.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(error).message },
    });
  }
}
```

**Key Rules:**
1. Repository methods that are called from routes MUST return types from `definition.ts`
2. NO transformations, translations, or data massage in repository
3. If definition expects `{ id, name }`, repository returns exactly `{ id, name }`
4. DB schema can have extra fields, but SELECT only what definition needs
5. Type alignment is checked at compile time - if it doesn't match, TypeScript will error

## File Structure

### Single File

For simple repositories:

```typescript
import "server-only";
import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { myTable } from "./db";
import type { MyGetResponseOutput, MyGetUrlVariablesOutput } from "./definition";

export class MyRepository {
  static async getById(urlPathParams: MyGetUrlVariablesOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<MyGetResponseOutput>> {
    try {
      logger.debug("Getting item by ID", { id: urlPathParams.id });
      const [item] = await db.select().from(myTable).where(eq(myTable.id, urlPathParams.id)).limit(1);
      if (!item) {
        return fail({ message: "app.api.my.errors.notFound", errorType: ErrorResponseTypes.NOT_FOUND });
      }
      return success({ id: item.id, name: item.name });
    } catch (error) {
      logger.error("Failed to fetch item", parseError(error));
      return fail({ message: "app.api.my.errors.server", errorType: ErrorResponseTypes.INTERNAL_ERROR });
    }
  }
}
```

### Folder Structure

For complex repositories:

```
my-feature/
├── route.ts
├── definition.ts
├── db.ts
└── repository/
    ├── index.ts          # Main class (public API)
    ├── queries.ts        # Database operations
    └── validation.ts     # Validation logic
```

#### `repository/index.ts` - Main Entry

```typescript
import "server-only";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { OrderGetResponseOutput, OrderGetUrlVariablesOutput, OrderCreateRequestOutput, OrderCreateResponseOutput } from "../definition";
import { OrderQueries } from "./queries";
import { OrderValidation } from "./validation";

export class OrderRepository {
  static async getById(urlPathParams: OrderGetUrlVariablesOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<OrderGetResponseOutput>> {
    const orderResult = await OrderQueries.findById(urlPathParams.id, logger);
    if (!orderResult.success) return orderResult;

    const accessResult = await OrderValidation.checkAccess(orderResult.data, user, logger);
    if (!accessResult.success) return accessResult;

    const order = orderResult.data;
    return success({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    });
  }

  static async create(data: OrderCreateRequestOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<OrderCreateResponseOutput>> {
    const validationResult = await OrderValidation.validateCreate(data, logger);
    if (!validationResult.success) return validationResult;

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const insertResult = await OrderQueries.insert({
      userId: user.id!,
      status: "pending",
      items: data.items,
      total,
    }, logger);
    if (!insertResult.success) return insertResult;

    return success({ id: insertResult.data.id });
  }
}
```

#### `repository/queries.ts` - Database Operations

```typescript
import "server-only";
import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success, fail, ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { orders, type Order, type NewOrder } from "../db";

export class OrderQueries {
  static async findById(id: string, logger: EndpointLogger): Promise<ResponseType<Order>> {
    try {
      logger.debug("Finding order by ID", { id });
      const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!order) {
        return fail({ message: "app.api.orders.errors.notFound", errorType: ErrorResponseTypes.NOT_FOUND });
      }
      return success(order);
    } catch (error) {
      logger.error("Failed to find order", parseError(error));
      return fail({ message: "app.api.orders.errors.server", errorType: ErrorResponseTypes.INTERNAL_ERROR });
    }
  }

  static async insert(data: NewOrder, logger: EndpointLogger): Promise<ResponseType<Order>> {
    try {
      logger.debug("Inserting order", { userId: data.userId });
      const [order] = await db.insert(orders).values(data).returning();
      if (!order) {
        return fail({ message: "app.api.orders.errors.insertFailed", errorType: ErrorResponseTypes.DATABASE_ERROR });
      }
      return success(order);
    } catch (error) {
      logger.error("Failed to insert order", parseError(error));
      return fail({ message: "app.api.orders.errors.server", errorType: ErrorResponseTypes.INTERNAL_ERROR });
    }
  }
}
```

#### `repository/validation.ts` - Validation Logic

```typescript
import "server-only";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success, fail, ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { Order } from "../db";
import type { OrderCreateRequestOutput } from "../definition";

export class OrderValidation {
  static async checkAccess(order: Order, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<{ hasAccess: true }>> {
    logger.debug("Checking order access", { orderId: order.id, userId: user.id });
    if (order.userId === user.id) return success({ hasAccess: true });
    if (user.roles?.includes("admin")) return success({ hasAccess: true });
    return fail({ message: "app.api.orders.errors.forbidden", errorType: ErrorResponseTypes.FORBIDDEN });
  }

  static async validateCreate(data: OrderCreateRequestOutput, logger: EndpointLogger): Promise<ResponseType<{ validated: true }>> {
    if (!data.items?.length) {
      return fail({ message: "app.api.orders.errors.emptyOrder", errorType: ErrorResponseTypes.VALIDATION_FAILED });
    }
    return success({ validated: true });
  }
}
```

### Folder Pattern Rules

1. **`index.ts` is the public API** - Only class called from routes
2. **Helper classes are internal** - Only used by `index.ts`
3. **ALL methods return `ResponseType<T>`** - No exceptions
4. **Single responsibility** per helper: queries, validation, notifications, external
5. **No circular deps** - Helpers don't import from `index.ts`
6. **No useless abstractions** - Do transformations inline, no converter/mapper methods
7. **One class per file** - Never put multiple repository classes in the same file

### When to Use Folder

- Multiple distinct responsibilities that benefit from separation
- Complex business logic with clear separation of concerns
- Note: File size alone is NOT a reason to split - 1000+ lines is fine

## Parameter Order

```typescript
static async submit(
  data: SubmitRequestOutput,          // 1. Request body
  urlPathParams: SubmitUrlVariablesOutput,  // 2. URL params
  user: JwtPayloadType,               // 3. JWT payload
  locale: CountryLanguage,            // 4. Locale (if needed)
  request: NextRequest,               // 5. Request (if needed)
  logger: EndpointLogger,             // 6. Logger
  platform: Platform,                 // 7. Platform (if needed)
): Promise<ResponseType<SubmitResponseOutput>>
```

## Conditional Logic Based on User Type

Auth is handled at route level via roles. Only use user checks for **conditional responses**:

```typescript
static async getCharacters(user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<CharactersResponseOutput>> {
  if (user.id) {
    const charactersResult = await this.getAllCharacters(user.id, logger);
    if (!charactersResult.success) return charactersResult;
    return success({ characters: charactersResult.data });
  }
  return this.getDefaultCharacters(logger);
}

private static async getDefaultCharacters(logger: EndpointLogger): Promise<ResponseType<CharactersResponseOutput>> {
  return success({ characters: DEFAULT_PERSONAS });
}
```

## Logging

```typescript
logger.debug("Creating item", { userId: user.id, itemName: data.name });
logger.error("Failed to create item", parseError(error));
```

## Cross-Repository Calls

```typescript
import { CreditRepository } from "@/app/api/[locale]/credits/repository";

export class OrderRepository {
  static async create(data: OrderCreateRequestOutput, user: JwtPayloadType, logger: EndpointLogger): Promise<ResponseType<OrderCreateResponseOutput>> {
    const creditCheck = await CreditRepository.checkBalance(user.id, data.amount, logger);
    if (!creditCheck.success) return creditCheck;
    // ...
  }
}
```

## Naming Conventions

| Pattern | Example                                     |
| ------- | ------------------------------------------- |
| Class   | `UserRepository`, `ChatFavoritesRepository` |
| List    | `list`, `getAll`, `search`                  |
| Get     | `getById`, `getByEmail`                     |
| Create  | `create`, `add`                             |
| Update  | `update`, `patch`                           |
| Delete  | `delete`, `remove`                          |
| Private | `validateOwnership`, `buildResponse`        |

---

## See Also

- [Route Patterns](route.md)
- [Definition Patterns](definition.md)
- [Database Patterns](database.md)
- [Native Repository Patterns](repository-native.md) - HTTP-based implementation for React Native
