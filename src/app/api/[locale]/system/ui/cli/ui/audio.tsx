type AudioProps = React.AudioHTMLAttributes<HTMLAudioElement>;

export function Audio(): null {
  return null;
}

// Silence unused type warning - AudioProps is re-exported for type compatibility
export type { AudioProps };
