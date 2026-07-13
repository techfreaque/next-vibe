import { createLayoutWrapperWithImport } from "@/vibe/platforms/react-native/nextjs-compat-wrapper";
export default createLayoutWrapperWithImport(
  () => import("@/_pages/user/(auth)/signup/layout"),
);
