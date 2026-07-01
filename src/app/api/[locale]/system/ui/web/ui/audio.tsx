"use client";

import type { JSX } from "react";

type AudioProps = React.AudioHTMLAttributes<HTMLAudioElement> & {
  track?: React.TrackHTMLAttributes<HTMLTrackElement>;
};

export function Audio({ track, children, ...props }: AudioProps): JSX.Element {
  return (
    <audio {...props}>
      <track kind="captions" {...track} />
      {children}
    </audio>
  );
}
