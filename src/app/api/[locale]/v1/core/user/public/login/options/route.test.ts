import { testEndpoint } from "@/app/api/[locale]/v1/core/system/check/testing/testing-suite/test-endpoint";

import endpoint from "./definition";

testEndpoint(endpoint.GET);
