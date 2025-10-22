// Stub navigation hooks for React Native to avoid circular dependency
// React Native doesn't use pathname-based routing in TranslationProvider
export const usePathname = () => "/";
export const useRouter = () => ({ push: () => {}, replace: () => {} });
