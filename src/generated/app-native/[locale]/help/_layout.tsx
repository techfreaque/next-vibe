import { createLayoutWrapperWithImport } from "@/vibe/platforms/react-native/nextjs-compat-wrapper";
export default createLayoutWrapperWithImport(
  () => import("@/_pages/help/layout"),
);
