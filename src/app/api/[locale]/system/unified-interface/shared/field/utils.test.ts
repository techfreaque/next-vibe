/**
 * Tests for extractSchemaDefaults utility function
 *
 * These tests verify that default values are correctly extracted from Zod schemas
 * for form initialization in the unified interface system.
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

import { extractSchemaDefaults } from "./utils";

describe("extractSchemaDefaults", () => {
  describe("ZodDefault handling", () => {
    it("extracts default value from a string field with default", () => {
      const schema = z.string().default("hello");
      const result = extractSchemaDefaults(schema);
      expect(result).toBe("hello");
    });

    it("extracts default value from a number field with default", () => {
      const schema = z.number().default(42);
      const result = extractSchemaDefaults(schema);
      expect(result).toBe(42);
    });

    it("extracts default value from a boolean field with default", () => {
      const schema = z.boolean().default(true);
      const result = extractSchemaDefaults(schema);
      expect(result).toBe(true);
    });

    it("extracts default value from an enum field with default", () => {
      const schema = z.enum(["asc", "desc"]).default("desc");
      const result = extractSchemaDefaults(schema);
      expect(result).toBe("desc");
    });

    it("extracts default value from a nativeEnum field with default", () => {
      enum SortOrder {
        ASC = "asc",
        DESC = "desc",
      }
      const schema = z.nativeEnum(SortOrder).default(SortOrder.DESC);
      const result = extractSchemaDefaults(schema);
      expect(result).toBe(SortOrder.DESC);
    });
  });

  describe("ZodObject handling", () => {
    it("returns empty object for object with no defaults", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({});
    });

    it("extracts defaults from object with some fields having defaults", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().default(18),
        active: z.boolean().default(true),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        age: 18,
        active: true,
      });
    });

    it("extracts defaults from nested objects", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          settings: z.object({
            theme: z.string().default("dark"),
            notifications: z.boolean().default(true),
          }),
        }),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        user: {
          settings: {
            theme: "dark",
            notifications: true,
          },
        },
      });
    });

    it("handles deeply nested defaults (like sortingOptions pattern)", () => {
      const schema = z.object({
        sortingOptions: z.object({
          sortBy: z.string().optional().default("createdAt"),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        }),
        paginationInfo: z.object({
          page: z.number().optional().default(1),
          limit: z.number().optional().default(20),
        }),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        sortingOptions: {
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        paginationInfo: {
          page: 1,
          limit: 20,
        },
      });
    });
  });

  describe("ZodOptional handling", () => {
    it("extracts default from optional field with default", () => {
      const schema = z.string().optional().default("default value");
      const result = extractSchemaDefaults(schema);
      expect(result).toBe("default value");
    });

    it("returns undefined for optional field without default", () => {
      const schema = z.string().optional();
      const result = extractSchemaDefaults(schema);
      expect(result).toBeUndefined();
    });

    it("extracts defaults through optional object wrapper", () => {
      const schema = z.object({
        filter: z
          .object({
            status: z.string().default("active"),
          })
          .optional(),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        filter: {
          status: "active",
        },
      });
    });
  });

  describe("ZodNullable handling", () => {
    it("extracts default from nullable field with default", () => {
      const schema = z.string().nullable().default("default value");
      const result = extractSchemaDefaults(schema);
      expect(result).toBe("default value");
    });

    it("returns undefined for nullable field without default", () => {
      const schema = z.string().nullable();
      const result = extractSchemaDefaults(schema);
      expect(result).toBeUndefined();
    });

    it("extracts defaults through nullable wrapper in object", () => {
      const schema = z.object({
        maybeValue: z.number().nullable().default(100),
      });
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        maybeValue: 100,
      });
    });
  });

  describe("ZodArray handling", () => {
    it("returns undefined for array without default", () => {
      const schema = z.array(z.string());
      const result = extractSchemaDefaults(schema);
      expect(result).toBeUndefined();
    });

    it("extracts default array value", () => {
      const schema = z.array(z.string()).default(["a", "b"]);
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual(["a", "b"]);
    });
  });

  describe("Complex schema patterns (real-world use cases)", () => {
    it("handles leads list endpoint-like schema", () => {
      enum LeadSortField {
        CREATED_AT = "createdAt",
        BUSINESS_NAME = "businessName",
      }
      const SortOrder = ["asc", "desc"] as const;

      const schema = z.object({
        statusFilters: z
          .object({
            search: z.string().optional(),
            status: z.array(z.string()).optional(),
          })
          .nullable()
          .optional(),
        sortingOptions: z.object({
          sortBy: z.nativeEnum(LeadSortField).optional().default(LeadSortField.CREATED_AT),
          sortOrder: z.enum(SortOrder).optional().default("desc"),
        }),
        paginationInfo: z.object({
          page: z.coerce.number().optional().default(1),
          limit: z.coerce.number().optional().default(20),
        }),
      });

      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        statusFilters: {},
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: "desc",
        },
        paginationInfo: {
          page: 1,
          limit: 20,
        },
      });
    });

    it("handles schema with mixed required and optional fields", () => {
      const schema = z.object({
        required: z.string(), // no default
        withDefault: z.string().default("has default"),
        optionalNoDefault: z.string().optional(),
        optionalWithDefault: z.string().optional().default("optional default"),
        nested: z.object({
          deep: z.object({
            value: z.number().default(999),
          }),
        }),
      });

      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        withDefault: "has default",
        optionalWithDefault: "optional default",
        nested: {
          deep: {
            value: 999,
          },
        },
      });
    });
  });

  describe("Edge cases", () => {
    it("handles empty object schema", () => {
      const schema = z.object({});
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({});
    });

    it("handles primitive schemas without defaults", () => {
      expect(extractSchemaDefaults(z.string())).toBeUndefined();
      expect(extractSchemaDefaults(z.number())).toBeUndefined();
      expect(extractSchemaDefaults(z.boolean())).toBeUndefined();
    });

    it("returns empty values for primitives when forFormInit is true", () => {
      expect(extractSchemaDefaults(z.string(), undefined, "", true)).toBe("");
      expect(extractSchemaDefaults(z.number(), undefined, "", true)).toBe(0);
      expect(extractSchemaDefaults(z.boolean(), undefined, "", true)).toBe(false);
      expect(extractSchemaDefaults(z.array(z.string()), undefined, "", true)).toEqual([]);
    });

    it("returns empty values for transformed string when forFormInit is true", () => {
      const schema = z.string().transform((x) => x.toLowerCase());
      expect(extractSchemaDefaults(schema, undefined, "", true)).toBe("");
    });

    it("handles nested objects with forFormInit", () => {
      const schema = z.object({
        email: z.string().email().transform((x) => x.toLowerCase()),
        password: z.string().min(1),
        rememberMe: z.boolean().optional().default(false),
      });
      const result = extractSchemaDefaults(schema, undefined, "", true);
      expect(result).toEqual({
        email: "",
        password: "",
        rememberMe: false,
      });
    });

    it("handles null default value", () => {
      const schema = z.string().nullable().default(null);
      const result = extractSchemaDefaults(schema);
      expect(result).toBeNull();
    });

    it("handles object default value that overrides inner defaults", () => {
      const schema = z
        .object({
          a: z.string().default("inner-a"),
          b: z.number().default(10),
        })
        .default({ a: "outer-a", b: 20 });

      const result = extractSchemaDefaults(schema);
      // The outer default should be merged with inner defaults
      // Outer default takes precedence
      expect(result).toEqual({
        a: "outer-a",
        b: 20,
      });
    });

    it("handles coerced types with defaults", () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(20),
        enabled: z.coerce.boolean().default(true),
      });

      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({
        page: 1,
        limit: 20,
        enabled: true,
      });
    });
  });

  describe("Logger integration", () => {
    it("handles invalid schema gracefully", () => {
      // Create a mock schema that will cause hasZodDef to return false
      const badSchema = {
        _def: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as z.ZodTypeAny;

      // Should return undefined without throwing
      const result = extractSchemaDefaults(badSchema);
      expect(result).toBeUndefined();
    });

    it("works without logger", () => {
      const schema = z.object({
        value: z.string().default("test"),
      });

      // No logger passed - should not throw
      const result = extractSchemaDefaults(schema);
      expect(result).toEqual({ value: "test" });
    });

    it("works with logger", () => {
      const schema = z.object({
        value: z.string().default("test"),
      });

      /* eslint-disable @typescript-eslint/no-empty-function */
      const mockLogger = {
        error: (): void => {},
        info: (): void => {},
        warn: (): void => {},
        debug: (): void => {},
        vibe: (): void => {},
        isDebugEnabled: false,
      };
      /* eslint-enable @typescript-eslint/no-empty-function */

      const result = extractSchemaDefaults(schema, mockLogger);
      expect(result).toEqual({ value: "test" });
    });
  });
});
