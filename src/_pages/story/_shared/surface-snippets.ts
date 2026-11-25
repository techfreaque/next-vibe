/**
 * Real, trimmed code used on the developer page.
 * Sources: src/contact/{definition,repository,route}.ts,
 * src/credits/expire/task.ts.
 * Keep in sync with those files.
 */

export const CONTACT_SOURCE_PATH = "src/contact";

export const CONTACT_DEFINITION = `// src/contact/definition.ts (trimmed)
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  aliases: ["contact-form"],
  // AI callers must ask the user first
  requiresConfirmation: true,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN /* , ... */],
  // title, description, category, icon, tags: required too

  fields: customWidgetObject({
    render: ContactFormWidget, // one widget, every surface
    usage: { request: "data", response: true } as const,
    children: {
      name: requestField(scopedTranslation, {
        schema: z.string().min(2),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
      }),
      message: requestField(scopedTranslation, {
        // real file: superRefine, lets "" through to the repository check
        schema: z.string().min(10),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
      }),
      // email, subject, priority: same pattern
      success: responseField(scopedTranslation, {
        schema: translatedValueSchema,
        type: WidgetType.ALERT,
      }),
    },
  }),
  errorTypes: { /* all 9 EndpointErrorTypes, required */ },
  successTypes: { /* title + description */ },
  examples: { /* typed request + response samples */ },
});`;

export const CONTACT_REPOSITORY = `// src/contact/repository.ts (trimmed)
export class ContactRepository {
  static async submitContactForm(
    data: ContactRequest, // typed from the definition
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ContactT,
  ): Promise<ResponseType<ContactResponse>> {
    if (isContactMessageEmpty(data.message)) {
      return fail({ // no throw, anywhere
        message: t("errors.validation.messageEmpty"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const [contact] = await db
      .insert(contacts) // Drizzle table from ./db.ts
      .values({
        name: data.name,
        email: data.email ?? null,
        subject: data.subject,
        message: data.message,
        status: ContactStatus.NEW,
      })
      .returning();
    if (!contact) {
      return fail({
        message: t("errors.repositoryCreateFailedForEmail", {
          email: data.email ?? "unknown",
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
    return success({
      success: t("response.success"),
      messageId: contact.id,
      status: [ContactStatus.NEW],
    });
  }
}`;

export const CONTACT_ROUTE = `// src/contact/route.ts (imports omitted)
export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [
      { template: contactFormEmailTemplate, ignoreErrors: false },
      { template: adminContactFormEmailTemplate, ignoreErrors: false },
    ],
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(data, user, locale, logger, t),
  },
});`;

export const SURFACE_CLI = `$ vibe contact-form \\
    --name="Ada Lovelace" \\
    --email="ada@example.com" \\
    --message="Can we self-host this for a team of 40?"

# flags come from the Zod fields
# vibe contact-form --help prints them, with examples`;

/** What `bun i` writes to .mcp.json (Claude Code), shape from mcp.template.json. */
export const SURFACE_MCP = `{
  "mcpServers": {
    "atlas": {
      "command": "bun",
      "args": [
        "--preload",
        "<repo>/src/vibe/platforms/cli/runtime/env-preload.ts",
        "<repo>/src/vibe/platforms/cli/vibe-runtime.ts",
        "mcp"
      ],
      "env": { "PROJECT_ROOT": "<repo>" }
    }
  }
}`;

/** The MCP tools/call an agent sends: endpoints run through `execute-tool`. */
export const SURFACE_MCP_CALL = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "execute-tool",
    "arguments": {
      "toolName": "contact-form",
      "input": {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "message": "Can we self-host this for a team of 40?"
      }
    }
  }
}`;

export const SURFACE_AI = `// Same definition, offered to the model as a tool.
// Schema and description come from the fields. No wrapper.

user:  "Ask the team if they do on-prem installs."
model: contact-form({ name: "Ada", message: "Do you do on-prem?" })
       -> requiresConfirmation: the user approves before it sends
tool:  { success: "Thank you for contacting us! ...", messageId: "..." }`;

export const SURFACE_CRON = `// src/credits/expire/task.ts (trimmed)
// any endpoint, on a schedule
const creditExpirationTask = createCronTask(
  creditExpirationTaskDefinition.POST,
  tools.POST, // the same handler the web, CLI and MCP call
  {
    id: "credits-expire",
    schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
    category: TaskCategory.MAINTENANCE,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.SHORT,
    enabled: true,
    taskInput: undefined,
  },
);`;

export const FEATURE_TREE = `src/contact/          (trimmed)
├── definition.ts   # fields, Zod, roles, errors
├── repository.ts   # logic, returns success/fail
├── route.ts        # definition -> repository
├── widget.tsx      # UI for every surface
├── email.tsx       # confirmation emails
├── db.ts           # Drizzle table
├── i18n/           # en, de, pl, fr, es, it
└── ...             # enums, SMS, tests`;

export const SURFACE_ADD = `mkdir -p src/my-feature
# add definition.ts, repository.ts, route.ts

# register every surface
vibe gen

# 0 errors or not done
vibe check src/my-feature

# live in the CLI
vibe my-feature --help`;
