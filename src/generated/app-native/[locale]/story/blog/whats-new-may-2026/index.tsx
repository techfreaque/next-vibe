import { createPageWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/app/[locale]/story/blog/whats-new-may-2026/page"),
);
