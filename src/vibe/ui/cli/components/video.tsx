type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function Video(): null {
  return null;
}

// Silence unused type warning - VideoProps is re-exported for type compatibility
export type { VideoProps };
