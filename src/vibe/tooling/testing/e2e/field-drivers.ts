// Testing infrastructure - messages are for test debugging, not end users

/**
 * Field drivers — how a real user operates each FieldDataType.
 *
 * One driver per widget, keyed by the same FieldDataType the definition
 * declares, so a form is filled purely from `endpoint.fields` + data. Drivers
 * type and click through the visible UI (never `form.setValue`) and confirm
 * the widget took the value — a widget that can't be operated fails here.
 *
 * Every driver is scoped to its field's `[data-field="<path>"]` wrapper
 * (stamped by FormItem in ui/web/components/form/form.tsx). Portaled popups
 * (Radix Select, Popover) are reached through `page`.
 *
 * Adding a widget to the suite = adding its driver here. Field types without
 * a driver are reported as uncovered by coverage-report.ts.
 */

import type { Locator, Page } from "playwright";

import { FieldDataType } from "../../../core/definition/enums";
import type { WidgetData } from "../../../core/utils/json";

export type E2EScalar = string | number | boolean;
export type E2EFieldValue =
  | E2EScalar
  | readonly (string | number)[]
  | File
  | readonly File[];

/** Runtime shape of a form field node as created by requestField(). */
export interface E2EFieldMeta {
  type?: string;
  fieldType?: string;
  schemaType?: string;
  /** Never rendered as an input (set by the definition). */
  hidden?: boolean;
  /** Only rendered for these roles. */
  visibleFor?: readonly string[];
  children?: Record<string, E2EFieldMeta>;
  options?: ReadonlyArray<{
    value: string | number;
    label: string;
    labelParams?: Record<string, string | number>;
  }>;
}

export interface FieldDriverContext {
  page: Page;
  /** The field's `[data-field]` wrapper. */
  scope: Locator;
  field: E2EFieldMeta;
  path: string;
  /** Endpoint-scoped translator — option labels are translation keys. */
  t: (key: string, params?: Record<string, string | number>) => string;
}

export interface FieldDriver {
  enter: (ctx: FieldDriverContext, value: E2EFieldValue) => Promise<void>;
}

const POLL_MS = 50;
const SETTLE_TIMEOUT_MS = 5_000;

async function until(
  check: () => Promise<boolean>,
  describe: () => Promise<string>,
): Promise<void> {
  const deadline = Date.now() + SETTLE_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await check()) {
      return;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL_MS);
    });
  }
  // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
  throw new Error(await describe());
}

function optionLabel(ctx: FieldDriverContext, value: string | number): string {
  const option = ctx.field.options?.find(
    (o) => String(o.value) === String(value),
  );
  if (!option) {
    // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
    throw new Error(
      `[e2e] ${ctx.path}: value "${String(value)}" is not one of the field's options (${(ctx.field.options ?? []).map((o) => String(o.value)).join(", ")})`,
    );
  }
  return ctx.t(option.label, option.labelParams);
}

function expectScalar(
  ctx: FieldDriverContext,
  value: E2EFieldValue,
): E2EScalar {
  if (Array.isArray(value) || value instanceof File) {
    // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
    throw new Error(`[e2e] ${ctx.path}: expected a single scalar value`);
  }
  return value as E2EScalar;
}

/** Plain text-like input: type it, then confirm the DOM holds exactly that. */
const typeInto: FieldDriver = {
  enter: async (ctx, value) => {
    const text = String(expectScalar(ctx, value));
    const input = ctx.scope
      .locator("input:not([type=hidden]):not([aria-hidden=true]), textarea")
      .first();
    await input.fill(text);
    await until(
      async () => (await input.inputValue()) === text,
      async () =>
        `[e2e] ${ctx.path}: typed "${text}" but input holds "${await input.inputValue()}"`,
    );
  },
};

/** Radix Checkbox / Switch — click until aria-checked matches. */
const toggle: FieldDriver = {
  enter: async (ctx, value) => {
    const want = Boolean(expectScalar(ctx, value));
    const control = ctx.scope
      .locator('[role="checkbox"], [role="switch"]')
      .first();
    const isChecked = async (): Promise<boolean> =>
      (await control.getAttribute("aria-checked")) === "true";
    if ((await isChecked()) !== want) {
      await control.click();
    }
    await until(
      async () => (await isChecked()) === want,
      async () => `[e2e] ${ctx.path}: toggle did not become ${String(want)}`,
    );
  },
};

/** Radix Select — open the trigger, pick the option by its visible label. */
const selectOne: FieldDriver = {
  enter: async (ctx, value) => {
    const label = optionLabel(ctx, String(expectScalar(ctx, value)));
    const trigger = ctx.scope.getByRole("combobox").first();
    await trigger.click();
    await ctx.page.getByRole("option", { name: label, exact: true }).click();
    await until(
      async () => ((await trigger.textContent()) ?? "").includes(label),
      async () =>
        `[e2e] ${ctx.path}: picked "${label}" but trigger shows "${(await trigger.textContent()) ?? ""}"`,
    );
  },
};

/** MultiSelect (Popover + cmdk) — toggle each option to match the wanted set. */
const selectMany: FieldDriver = {
  enter: async (ctx, value) => {
    if (!Array.isArray(value)) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(`[e2e] ${ctx.path}: multiselect expects an array`);
    }
    const wanted = new Set(value.map(String));
    await ctx.scope.getByRole("combobox").first().click();
    for (const option of ctx.field.options ?? []) {
      const label = ctx.t(option.label, option.labelParams);
      const item = ctx.page.getByRole("option", { name: label, exact: true });
      const marker = item.locator("[data-checked]").first();
      const isChecked = async (): Promise<boolean> =>
        (await marker.getAttribute("data-checked")) === "true";
      const want = wanted.has(String(option.value));
      if ((await isChecked()) !== want) {
        await item.click();
        await until(
          async () => (await isChecked()) === want,
          async () =>
            `[e2e] ${ctx.path}: option "${label}" did not become ${String(want)}`,
        );
      }
    }
    await ctx.page.keyboard.press("Escape");
  },
};

/** Color field — the hex text input beside the swatch (the swatch mirrors it). */
const pickColor: FieldDriver = {
  enter: async (ctx, value) => {
    const hex = String(expectScalar(ctx, value));
    const input = ctx.scope.locator('input[type="text"]').first();
    await input.fill(hex);
    const swatch = ctx.scope.locator('input[type="color"]').first();
    await until(
      async () => (await swatch.inputValue()) === hex.toLowerCase(),
      async () =>
        `[e2e] ${ctx.path}: typed "${hex}" but swatch shows "${await swatch.inputValue()}"`,
    );
  },
};

/** File field — hand the browser real bytes through the file chooser input. */
const uploadFile: FieldDriver = {
  enter: async (ctx, value) => {
    const files =
      value instanceof File
        ? [value]
        : Array.isArray(value) && value.every((item) => item instanceof File)
          ? value
          : null;
    if (!files || files.length === 0) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(`[e2e] ${ctx.path}: file field expects a File or File[]`);
    }
    const input = ctx.scope.locator('input[type="file"]').first();
    await input.setInputFiles(
      await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          mimeType: file.type,
          buffer: Buffer.from(await file.arrayBuffer()),
        })),
      ),
    );
    const names = files.map((file) => file.name);
    await until(
      async () =>
        await input.evaluate(
          (el, expected) =>
            expected.every((name, i) => {
              const attached = (el as HTMLInputElement).files?.[i];
              return attached?.name === name;
            }),
          names,
        ),
      async () =>
        `[e2e] ${ctx.path}: files ${names.join(", ")} were not attached`,
    );
  },
};

/** TipTap markdown editor — select all in the contenteditable and type over it. */
const typeRichText: FieldDriver = {
  enter: async (ctx, value) => {
    const text = String(expectScalar(ctx, value));
    const editor = ctx.scope.locator('[contenteditable="true"]').first();
    await editor.click();
    await ctx.page.keyboard.press("ControlOrMeta+A");
    await ctx.page.keyboard.press("Delete");
    await ctx.page.keyboard.type(text);
    await until(
      async () => (await editor.innerText()).trim() === text.trim(),
      async () =>
        `[e2e] ${ctx.path}: typed "${text}" but editor shows "${await editor.innerText()}"`,
    );
  },
};

/** Runtime config of an ENTITY_PICKER field (see entity-picker-field/types.ts). */
interface EntityPickerMeta {
  listEndpoint?: () => Promise<{ path: readonly string[]; method: string }>;
  labelField?: string;
}

interface PickerRow {
  [key: string]: WidgetData;
}

/** First array of `{ id }` rows anywhere in a list response's data. */
function findPickerRows(data: WidgetData | undefined): PickerRow[] {
  if (Array.isArray(data)) {
    return data.every((row) => typeof row === "object" && row !== null)
      ? (data as PickerRow[])
      : [];
  }
  if (typeof data === "object" && data !== null) {
    for (const child of Object.values(data)) {
      const rows = findPickerRows(child);
      if (rows.length > 0) {
        return rows;
      }
    }
  }
  return [];
}

/**
 * Entity picker — click "Select …", wait for the list endpoint the picker
 * opens in a modal, find the row whose id is the value, click it by its label
 * like a user would, then confirm the picker shows that label and id.
 */
const pickEntity: FieldDriver = {
  enter: async (ctx, value) => {
    const id = String(expectScalar(ctx, value));
    const meta = ctx.field as EntityPickerMeta;
    if (!meta.listEndpoint) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(`[e2e] ${ctx.path}: entity picker has no listEndpoint`);
    }
    const list = await meta.listEndpoint();
    const listPattern = new RegExp(
      `/api/[^/]+/${list.path
        .map((s) =>
          s.startsWith("[")
            ? "[^/]+"
            : s.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        )
        .join("/")}$`,
    );
    const listResponse = ctx.page.waitForResponse(
      (response) =>
        response.request().method() === list.method &&
        listPattern.test(new URL(response.url()).pathname),
      { timeout: SETTLE_TIMEOUT_MS * 4 },
    );
    await ctx.scope.getByRole("button").first().click();

    const body = (await (await listResponse).json()) as {
      success: boolean;
      data?: WidgetData;
    };
    const row = findPickerRows(body.data).find((r) => String(r["id"]) === id);
    if (!row) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(
        `[e2e] ${ctx.path}: "${id}" is not in the picker list (${list.path.join("/")} → ${JSON.stringify(body).slice(0, 300)})`,
      );
    }
    const label = String(
      row[meta.labelField ?? "name"] ??
        row["name"] ??
        row["title"] ??
        row["label"] ??
        id,
    );
    const dialog = ctx.page.getByRole("dialog").last();
    await dialog.getByText(label, { exact: true }).first().click();

    await until(
      async () => {
        const text = (await ctx.scope.textContent()) ?? "";
        return text.includes(label) && text.includes(id.slice(0, 8));
      },
      async () =>
        `[e2e] ${ctx.path}: picked "${label}" (${id}) but picker shows "${(await ctx.scope.textContent()) ?? ""}"`,
    );
  },
};

/**
 * Registry — the single source of which widgets the E2E suite can operate.
 * Missing entries are surfaced by coverage-report.ts as uncovered types.
 */
export const fieldDrivers: Partial<Record<FieldDataType, FieldDriver>> = {
  [FieldDataType.TEXT]: typeInto,
  [FieldDataType.EMAIL]: typeInto,
  [FieldDataType.PASSWORD]: typeInto,
  [FieldDataType.TEXTAREA]: typeInto,
  [FieldDataType.URL]: typeInto,
  [FieldDataType.NUMBER]: typeInto,
  [FieldDataType.INT]: typeInto,
  [FieldDataType.UUID]: typeInto,
  [FieldDataType.JSON]: typeInto,
  [FieldDataType.COLOR]: pickColor,
  [FieldDataType.FILE]: uploadFile,
  [FieldDataType.MARKDOWN_TEXTAREA]: typeRichText,
  [FieldDataType.BOOLEAN]: toggle,
  [FieldDataType.SELECT]: selectOne,
  [FieldDataType.MULTISELECT]: selectMany,
  [FieldDataType.ENTITY_PICKER]: pickEntity,
};

export function isFieldDataType(value: string): value is FieldDataType {
  return (Object.values(FieldDataType) as string[]).includes(value);
}

export function getFieldDriver(
  fieldType: string | undefined,
): FieldDriver | null {
  if (!fieldType || !isFieldDataType(fieldType)) {
    return null;
  }
  return fieldDrivers[fieldType] ?? null;
}
