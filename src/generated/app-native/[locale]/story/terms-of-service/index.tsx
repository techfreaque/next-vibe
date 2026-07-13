import { createPageWrapperWithImport } from "@/vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/_pages/story/terms-of-service/page"),
);
