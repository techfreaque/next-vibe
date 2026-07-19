import { createPageWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/_pages/story/blog/type-checker-made-ai-stop-lying/page"),
);
