import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

testEndpoint(endpoint.GET);

testEndpoint(endpoint.POST);

testEndpoint(endpoint.DELETE);
