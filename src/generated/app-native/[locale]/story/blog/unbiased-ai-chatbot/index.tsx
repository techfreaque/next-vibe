import { createPageWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/_pages/story/blog/unbiased-ai-chatbot/page"),
);
