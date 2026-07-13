import { createPageWrapperWithImport } from "@/vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/_pages/story/blog/referral-for-affiliate-pros/page"),
);
