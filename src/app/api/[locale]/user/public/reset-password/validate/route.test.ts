import { testEndpoint } from "../../../../system/check/testing/testing-suite";
import { resetPasswordValidateEndpoint } from "./definition";

testEndpoint(resetPasswordValidateEndpoint.GET);
