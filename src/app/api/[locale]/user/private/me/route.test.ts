import { testEndpoint } from "../../../system/check/testing/testing-suite";
import endpoint from "./definition";

testEndpoint(endpoint.GET);

testEndpoint(endpoint.POST);

testEndpoint(endpoint.DELETE);
