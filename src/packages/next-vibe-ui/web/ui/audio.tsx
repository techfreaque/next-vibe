"use client";

import type { JSX } from "react";

type AudioProps = React.AudioHTMLAttributes<HTMLAudioElement>;

export function Audio(props: AudioProps): JSX.Element {
  return <audio {...props} />;
}
