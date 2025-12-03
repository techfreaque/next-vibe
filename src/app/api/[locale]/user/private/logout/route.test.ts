import { testEndpoint } from "@/app/api/[locale]/system/check/testing/testing-suite/test-endpoint";

import endpoint from "./definition";

testEndpoint(endpoint.POST);
