/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * createEndpoint Tests
 *
 * Verifies that endpoints can be declared with inline copy - no i18n/ folder,
 * no scopedTranslation at all - and that the copy stays literal text.
 *
 * The `_`-prefixed type aliases at the bottom are compile-time assertions -
 * they fail the build if inference regresses, and are unused by design.
 */

import { describe, expect, it } from "bun:test";
import { createEndpoint } from "../definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../definition/enums";
import { UserRole } from "../../identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils";
import { z } from "zod";

// Helper types to assert exact type equality at compile time
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["tests", "inline"],
  title: "Create company",
  titleShort: "Create",
  description: "Register a new company under your account.",
  category: "companies",
  tags: ["companies", "onboarding"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "building",

  fields: objectField({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Company name",
        description: "The legal name of the company.",
        placeholder: "Acme GmbH",
        schema: z.string().min(1).max(255),
      }),
      seats: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "Seats",
        schema: z.coerce.number().int().min(1),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        label: "Company ID",
        schema: z.uuid(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Invalid company details",
      description: "Check the highlighted fields and try again.",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Sign in required",
      description: "Sign in to create a company.",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Not allowed",
      description: "Your account cannot create companies.",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Company already exists",
      description: "A company with that name is already registered.",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Server error",
      description: "Something broke on our side. Try again shortly.",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Unknown error",
      description: "The request failed for an unknown reason.",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Connection lost",
      description: "Check your connection and try again.",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Not found",
      description: "The requested company does not exist.",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Unsaved changes",
      description: "Save or discard your changes before leaving.",
    },
  },

  successTypes: {
    title: "Company created",
    description: "Ready to use.",
  },

  examples: {
    requests: {
      default: { name: "Acme GmbH", seats: 10 },
      minimal: { name: "Solo Ventures", seats: 1 },
    },
    responses: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
      minimal: { id: "456e7890-e89b-12d3-a456-426614174001" },
    },
  },
});

describe("createEndpoint", () => {
  it("keeps inline copy on the definition verbatim", () => {
    expect(POST.title).toBe("Create company");
    expect(POST.description).toBe("Register a new company under your account.");
    expect(POST.tags).toEqual(["companies", "onboarding"]);
    expect(POST.successTypes.title).toBe("Company created");
  });

  it("carries only a pass-through translator, never a real scope", () => {
    // `scopedTranslation` stays a required property so the widget layer can keep
    // inferring TKey from it - but for inline endpoints it must not translate:
    // whatever goes in comes straight back out.
    const { t } = POST.scopedTranslation.scopedT("en-US");
    expect(String(t("Create company"))).toBe("Create company");
    expect(String(t("anything at all"))).toBe("anything at all");
  });

  it("exposes error and success copy as literal text", () => {
    expect(POST.errorTypes[EndpointErrorTypes.CONFLICT].title).toBe(
      "Company already exists",
    );
    expect(POST.successTypes.description).toBe("Ready to use.");
  });

  it("generates request/response schemas exactly as createEndpoint does", () => {
    const parsedRequest = POST.requestSchema.safeParse({
      name: "Acme GmbH",
      seats: "10",
    });
    expect(parsedRequest.success).toBe(true);
    // z.coerce.number() must still run - proves schema generation is untouched.
    expect(parsedRequest.data).toEqual({ name: "Acme GmbH", seats: 10 });

    expect(POST.requestSchema.safeParse({ name: "", seats: 1 }).success).toBe(
      false,
    );

    const parsedResponse = POST.responseSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(parsedResponse.success).toBe(true);
  });

  it("keys the returned object by method and reports auth correctly", () => {
    expect(POST.method).toBe(Methods.POST);
    expect(POST.requiresAuthentication()).toBe(true);
  });
});

// --- COMPILE-TIME ASSERTIONS ---
// Inline copy must not weaken field-driven type inference.

type RequestOutput = typeof POST.types.RequestOutput;
type ResponseOutput = typeof POST.types.ResponseOutput;

type _RequestInferred = Expect<
  Equal<RequestOutput, { name: string; seats: number }>
>;
type _ResponseInferred = Expect<Equal<ResponseOutput, { id: string }>>;

// Translation keys widen to `string` - any literal is accepted, by design.
type _KeysAreInlineStrings = Expect<
  Equal<typeof POST.types.ScopedTranslationKey, string>
>;
