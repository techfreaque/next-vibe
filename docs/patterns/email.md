# Email Integration Patterns

> **Part of NextVibe Framework** (GPL-3.0) - React Email integration for transactional and notification emails

**Send beautiful, type-safe emails from your API endpoints.**

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Email Function Pattern](#email-function-pattern)
4. [Email Template Components](#email-template-components)
5. [Route Integration](#route-integration)
6. [Translation Keys](#translation-keys)
7. [Best Practices](#best-practices)
8. [Testing Emails](#testing-emails)
9. [Common Patterns](#common-patterns)

---

## Overview

NextVibe uses **React Email** for email templates. Emails are co-located with endpoints in `email.tsx` files.

**Key Principles:**

1. **Co-located**: Email files live next to the routes that use them
2. **Type-safe**: Full TypeScript typing from request/response types
3. **Translatable**: All text uses translation keys (en, de, pl)
4. **Trackable**: Built-in analytics tracking with leadId/userId
5. **Error-safe**: Configurable error handling (blocking vs non-blocking)

---

## File Structure

### Standard Pattern

```
subdomain/
├── definition.ts
├── route.ts
├── email.tsx          # Email render functions
├── repository.ts
└── enum.ts
```

**When to use `email.tsx`:**

- Email templates don't need repository imports
- Simple transactional or notification emails
- Most common pattern

**File is OPTIONAL** - only create when endpoint needs email functionality.

---

## Email Function Pattern

### EmailFunctionType Signature

```typescript
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";

export const renderCompanyMail: EmailFunctionType<
  RequestType,
  ResponseType,
  never
> = ({ requestData, responseData, locale, t, user, logger }) => {
  // Return success or error response
  return success({
    toEmail: "recipient@example.com",
    toName: "Recipient Name",
    subject: t("app.api.module.email.subject"),
    replyToEmail: requestData.email,
    replyToName: requestData.name,
    jsx: <YourEmailComponent />,
  });
};
```

### Available Props

| Prop              | Type              | Description                              |
| ----------------- | ----------------- | ---------------------------------------- |
| **requestData**   | `TRequest`        | Validated request data from endpoint     |
| **responseData**  | `TResponse`       | Response data from handler               |
| **user**          | `JwtPayloadType`  | Current user (id, leadId, roles, etc.)   |
| **locale**        | `CountryLanguage` | Current locale (en-US, de-DE, pl-PL)     |
| **t**             | `TFunction`       | Translation function                     |
| **logger**        | `EndpointLogger`  | Endpoint logger instance                 |
| **urlPathParams** | `TUrlVariables`   | URL path parameters (for dynamic routes) |

### Return Types

**Success Response:**

```typescript
return success({
  toEmail: "recipient@example.com",      // Required
  toName: "Recipient Name",              // Required
  subject: "Email Subject",              // Required
  jsx: <EmailComponent />,               // Required
  replyToEmail: "reply@example.com",     // Optional
  replyToName: "Reply Name",             // Optional
});
```

**Error Response:**

```typescript
return fail({
  message: "app.api.module.error.email_send_failed",
  errorType: ErrorResponseTypes.INTERNAL_ERROR,
});
```

---

## Email Template Components

### Using EmailTemplate Wrapper

```typescript
import {
  createTrackingContext,
  EmailTemplate,
} from "@/app/api/[locale]/emails/smtp-client/components";

function YourEmailContent({
  requestData,
  t,
  locale,
}: {
  requestData: RequestType;
  t: TFunction;
  locale: CountryLanguage;
}): JSX.Element {
  const tracking = createTrackingContext(
    locale,
    leadId,      // From form submission or user.leadId
    userId,      // From JWT if logged in
    campaignId,  // For campaign emails (optional)
  );

  return (
    <EmailTemplate
      t={t}
      locale={locale}
      title={t("app.api.module.email.title")}
      previewText={t("app.api.module.email.preview")}
      tracking={tracking}
    >
      <Span>Your content here</Span>
    </EmailTemplate>
  );
}
```

### React Email Components

```typescript
import {
  Button,
  Hr,
  Link,
  Section,
  Text as Span,
} from "@react-email/components";

<Section style={{ backgroundColor: "#f9fafb", padding: "16px" }}>
  <Span style={{ fontSize: "16px", color: "#374151" }}>
    {t("app.api.module.email.content")}
  </Span>

  <Button
    href={`${env.NEXT_PUBLIC_APP_URL}/admin/dashboard`}
    style={{
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      padding: "10px 20px",
    }}
  >
    {t("app.api.module.email.button")}
  </Button>
</Section>
```

### Consistent Styling

```typescript
const styles = {
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#374151",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: "6px",
    color: "#ffffff",
    padding: "10px 20px",
  },
};
```

---

## Route Integration

### Standard Pattern

```typescript
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { renderCompanyMail, renderPartnerMail } from "./email";
import { repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderCompanyMail,
        ignoreErrors: false, // Email failure blocks the request
      },
      {
        render: renderPartnerMail,
        ignoreErrors: false, // Email failure blocks the request
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      // Main business logic
      return await repository.processRequest(data, user, locale, logger);
    },
  },
});
```

### Email Property Configuration

```typescript
email: [
  {
    render: renderEmailFunction,
    ignoreErrors: false, // Email failure blocks the request (default)
  },
  {
    render: renderOptionalEmail,
    ignoreErrors: true, // Email failure doesn't block the request
  },
];
```

**When to use `ignoreErrors: true`:**

- Non-critical notification emails
- Admin notifications that shouldn't block user actions
- Optional confirmation emails

**When to use `ignoreErrors: false`:**

- Password reset emails (critical for user)
- Email verification (required for signup)
- Order confirmations (critical for business)

---

## Translation Keys

### Email Translation Pattern

All email text must use translation keys following the path-to-key formula:

```typescript
// Email subjects
t("app.api.module.email.subject", { name: "John" });

// Email content
t("app.api.module.email.greeting");
t("app.api.module.email.content");
t("app.api.module.email.button");

// Common translations
t("config.appName");
```

### Example i18n Structure

```typescript
// i18n/en/index.ts
export const translations = {
  email: {
    subject: "Contact Form: {{subject}}",
    greeting: "Hello {{name}},",
    content: "Thank you for contacting us.",
    button: "View Details",
  },
};
```

---

## Best Practices

### 1. Error Handling

Always wrap email rendering in try-catch:

```typescript
export const renderEmail: EmailFunctionType<...> = ({ ... }) => {
  try {
    return success({
      // Email config
    });
  } catch {
    return fail({
      message: "app.api.module.error.email_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
```

### 2. Tracking Context

Include tracking for analytics:

```typescript
const tracking = createTrackingContext(
  locale,
  leadId, // From form submission
  userId, // From JWT if logged in
  campaignId, // For campaign emails (optional)
);
```

### 3. Reusable Components

Create shared email content components:

```typescript
function ContactDetailsSection({
  data,
  t,
}: {
  data: ContactData;
  t: TFunction;
}) {
  return (
    <Section style={{ backgroundColor: "#f9fafb", padding: "16px" }}>
      <Span style={{ fontWeight: "700" }}>
        {t("app.api.contact.email.name")}:
      </Span>
      <Span>{data.name}</Span>
    </Section>
  );
}
```

### 4. Conditional Rendering

```typescript
{requestData.company && (
  <Span>
    <Span style={{ fontWeight: "700" }}>
      {t("app.api.contact.email.company")}:
    </Span>{" "}
    {requestData.company}
  </Span>
)}
```

### 5. Reply-To Configuration

Set appropriate reply-to addresses:

```typescript
// For user-facing emails - reply to support
replyToEmail: contactClientRepository.getSupportEmail(locale),
replyToName: t("config.appName"),

// For admin emails - reply to user
replyToEmail: requestData.email,
replyToName: requestData.name,
```

---

## Testing Emails

### CLI Test Command

```bash
vibe leads:campaigns:emails:test-mail \
  --emailId="campaign-email-id" \
  --testEmail="test@example.com" \
  --leadData='{"businessName":"Test Business","contactName":"Test Contact"}'
```

### Manual Testing

Use the test-mail endpoint for previewing:

```typescript
POST /api/leads/campaigns/emails/test-mail
{
  "emailId": "campaign-email-id",
  "testEmail": "test@example.com",
  "leadData": {
    "businessName": "Test Business",
    "contactName": "Test Contact"
  }
}
```

---

## Common Patterns

### Transactional Emails

Contact form confirmations, password resets, account verification, order confirmations, subscription updates.

**Example:**

```typescript
export const renderConfirmationMail: EmailFunctionType<
  ContactRequestOutput,
  ContactResponseOutput,
  never
> = ({ requestData, locale, t, user }) => {
  try {
    return success({
      toEmail: requestData.email,
      toName: requestData.name,
      subject: t("app.api.contact.email.partner.subject"),
      replyToEmail: contactClientRepository.getSupportEmail(locale),
      replyToName: t("config.appName"),
      jsx: ContactEmailContent({ requestData, t, locale, userId: user?.id }),
    });
  } catch {
    return fail({
      message: "app.api.contact.error.email_failed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
```

### Notification Emails

Admin notifications, status updates, system alerts, activity summaries.

**Example:**

```typescript
export const renderAdminNotificationMail: EmailFunctionType<
  LeadCreateType,
  LeadCreatePostResponseOutput,
  never
> = ({ responseData, locale, t }) => {
  try {
    return success({
      toEmail: contactClientRepository.getSupportEmail(locale),
      toName: t("config.appName"),
      subject: t("app.api.leads.create.email.admin.newLead.subject"),
      replyToEmail: responseData.lead.summary.email,
      jsx: AdminNotificationEmailContent({
        lead: responseData.lead,
        t,
        locale,
      }),
    });
  } catch {
    return fail({
      message: "app.api.leads.create.email.error.general",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
};
```

### Welcome Emails

**Example:**

```typescript
export const renderWelcomeMail: EmailFunctionType<
  SignupPostRequestOutput,
  SignupPostResponseOutput,
  Record<string, string>
> = async ({ requestData, locale, t, logger }) => {
  const userResponse = await userRepository.getUserByEmail(
    requestData.personalInfo.email,
    UserDetailLevel.STANDARD,
    locale,
    logger,
  );

  if (!userResponse.success) {
    return fail({
      message: "app.api.user.errors.not_found",
      errorType: ErrorResponseTypes.NOT_FOUND,
      cause: userResponse,
    });
  }

  return success({
    toEmail: userResponse.data.email,
    toName: userResponse.data.privateName,
    subject: t("app.api.user.public.signup.email.subject"),
    jsx: WelcomeEmailContent({ user: userResponse.data, t, locale }),
  });
};
```

---

## Quick Reference

### Import Paths

| Component                  | Import Path                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **EmailFunctionType**      | `@/app/api/[locale]/emails/smtp-client/email-handling/types` |
| **EmailTemplate**          | `@/app/api/[locale]/emails/smtp-client/components`           |
| **React Email Components** | `@react-email/components`                                    |
| **Response Utils**         | `next-vibe/shared/types/response.schema`                     |

### Email Config

| Property         | Required | Type        | Description              |
| ---------------- | -------- | ----------- | ------------------------ |
| **toEmail**      | Yes      | string      | Recipient email address  |
| **toName**       | Yes      | string      | Recipient display name   |
| **subject**      | Yes      | string      | Email subject line       |
| **jsx**          | Yes      | JSX.Element | Email template component |
| **replyToEmail** | No       | string      | Reply-to email address   |
| **replyToName**  | No       | string      | Reply-to display name    |

---

## Quick Checklist

Before committing email code:

- [ ] Email function uses correct `EmailFunctionType` signature
- [ ] All text uses translation keys (no hardcoded strings)
- [ ] Error handling with try-catch
- [ ] `EmailTemplate` wrapper used correctly
- [ ] Tracking context included when appropriate
- [ ] Route integration uses correct `email` property
- [ ] `ignoreErrors` set appropriately (critical vs optional)
- [ ] Reply-to addresses configured correctly
- [ ] Inline styles used (consistent design tokens)
- [ ] Tested via CLI or test-mail endpoint

---

## See Also

- [i18n Patterns](i18n.md) - Translation keys for emails
- [Testing Patterns](testing.md) - Testing email integration
- [Repository Patterns](repository.md) - Accessing data for emails
- [Definition Patterns](definition.md) - Request/response types for email functions
