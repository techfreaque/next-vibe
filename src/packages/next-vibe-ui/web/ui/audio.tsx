"use client";

import type { JSX } from "react";

type AudioProps = React.AudioHTMLAttributes<HTMLAudioElement>;

export function Audio(props: AudioProps): JSX.Element {
  // eslint-disable-next-line jsx-a11y/media-has-caption, jsx-capitalization/jsx-capitalization
  return <audio {...props} />;
}
