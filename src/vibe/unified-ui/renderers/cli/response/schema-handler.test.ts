import { describe, expect, it } from "bun:test";
import { z } from "zod";

import { SchemaUIHandler } from "./schema-handler";

describe("SchemaUIHandler defaults", () => {
  it("retains Zod defaults in CLI field metadata", () => {
    const fields = SchemaUIHandler.parseSchema(
      z.object({
        name: z.string().default("Atlas").optional(),
        retries: z.number().default(0),
        enabled: z.boolean().default(false),
        tags: z.array(z.string()).default(["local"]),
        required: z.string(),
      }),
    );

    const metadata = fields.map(({ name, type, required, defaultValue }) => ({
      name,
      type,
      required,
      defaultValue,
    }));

    expect(metadata).toEqual([
      { name: "name", type: "input", required: false, defaultValue: "Atlas" },
      { name: "retries", type: "number", required: false, defaultValue: 0 },
      {
        name: "enabled",
        type: "confirm",
        required: false,
        defaultValue: false,
      },
      {
        name: "tags",
        type: "checkbox",
        required: false,
        defaultValue: ["local"],
      },
      {
        name: "required",
        type: "input",
        required: true,
        defaultValue: undefined,
      },
    ]);
  });

  it("reads the default getter once per schema parse", () => {
    let calls = 0;
    const schema = z.string().default(() => {
      calls += 1;
      return `default-${calls}`;
    });

    const [field] = SchemaUIHandler.parseSchema(schema);
    expect(field?.defaultValue).toBe("default-1");
    expect(calls).toBe(1);
  });
});
