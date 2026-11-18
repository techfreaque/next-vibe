/**
 * Real, trimmed code used on the developer page.
 * Sources: src/contact/{definition,route}.ts, src/credits/expire/task.ts.
 * Keep in sync with those files.
 */

export const CONTACT_SOURCE_PATH = "src/contact";

export const CONTACT_DEFINITION = `// src/contact/definition.ts (trimmed)
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  aliases: ["contact-form"],
  requiresConfirmation: true, // AI callers must ask the user first
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],

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

export const CONTACT_ROUTE = `// src/contact/route.ts (complete)
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

export const SURFACE_MCP = `// .mcp.json - Claude, Cursor, any MCP client
{
  "mcpServers": {
    "my-app": { "command": "vibe", "args": ["mcp"] }
  }
}

// the client discovers and calls it:
execute-tool {
  "toolName": "contact-form",
  "input": { "name": "Ada", "message": "Self-host for 40 people?" }
}`;

export const SURFACE_AI = `// Same definition, offered to the model as a tool.
// Schema and description come from the fields. No wrapper.

user:  "Ask the team if they do on-prem installs."
model: contact-form({ name: "Ada", message: "Do you do on-prem?" })
       -> requiresConfirmation: the user approves before it sends
tool:  { success: "Thank you for contacting us! ...", messageId: "..." }`;

export const SURFACE_CRON = `// src/credits/expire/task.ts - any endpoint, on a schedule
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

export const FEATURE_TREE = `src/contact/
├── definition.ts   # fields, Zod, roles, errors
├── repository.ts   # logic, returns success/fail
├── route.ts        # definition -> repository
├── widget.tsx      # UI for every surface
├── email.tsx       # confirmation emails
├── db.ts           # Drizzle table
└── i18n/           # en, de, pl, fr`;

export const SURFACE_ADD = `mkdir -p src/my-feature
# definition.ts, repository.ts, route.ts

vibe gen                    # registers every surface
vibe check src/my-feature   # 0 errors or not done
vibe my-feature --help      # live in the CLI`;
