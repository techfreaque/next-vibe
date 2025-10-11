/**
 * Integration Tests for Builder and Release Tool
 * Tests both systems working together and independently
 */

import { testBuilderSelfBuild } from "./builder/build-orchestration/repository.test";
import { testReleaseToolDryRun } from "./release-tool/release-orchestration/execute/repository.test";

async function runIntegrationTests(): Promise<void> {
  console.log("🚀 Starting integration tests...\n");

  try {
    // Test 1: Builder builds itself
    console.log("=".repeat(60));
    console.log("🏗️  TEST 1: Builder System Self-Build");
    console.log("=".repeat(60));

    await testBuilderSelfBuild();
    console.log("✅ Builder self-build test passed!\n");

    // Test 2: Release tool dry run
    console.log("=".repeat(60));
    console.log("🚀 TEST 2: Release Tool Dry Run");
    console.log("=".repeat(60));

    await testReleaseToolDryRun();
    console.log("✅ Release tool dry run test passed!\n");

    // Final summary
    console.log("=".repeat(60));
    console.log("🎉 ALL INTEGRATION TESTS PASSED!");
    console.log("=".repeat(60));
    console.log("✅ Builder system can build itself into standalone packages");
    console.log("✅ Release tool can perform dry runs without git operations");
    console.log(
      "✅ Both systems are working correctly with proper error handling",
    );
    console.log("✅ Configuration is properly driven by definition.ts files");
  } catch (error) {
    console.error("❌ Integration tests failed:");
    console.error(error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  runIntegrationTests().catch((error) => {
    console.error("❌ Failed to run integration tests:", error);
    process.exit(1);
  });
}

export { runIntegrationTests };
