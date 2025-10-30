declare module '@rn-primitives/portal' {
  // Re-export all original types
  export * from '@rn-primitives/portal/dist/index';

  // Portal doesn't have component props that need className augmentation
  // It only exports Portal, PortalHost, and useModalPortalRoot
}
