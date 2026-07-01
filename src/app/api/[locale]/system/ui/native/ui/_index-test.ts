// overall test
import type * as webComponents from "next-vibe/ui/web/ui/_index-test-only";

import * as nativeComponents from "./_index-tests";

const test: typeof webComponents = nativeComponents;
void test;

// icons
import * as Icons from "next-vibe/ui/native/ui/icons";
import type * as webIcons from "next-vibe/ui/web/ui/icons";
const testIcons: typeof webIcons = Icons;
void testIcons;
