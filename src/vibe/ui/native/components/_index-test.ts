// overall test
import type * as webComponents from "../../web/components/_index-test-only";
import * as nativeComponents from "./_index-tests";

const test: typeof webComponents = nativeComponents;
void test;

// icons
import type * as webIcons from "../../web/components/icons";
import * as Icons from "./icons";
const testIcons: typeof webIcons = Icons;
void testIcons;
