/**
 * Speech-to-Text Hotkey Polish translations
 */

export const hotkeyTranslations = {
  platforms: {
    macos: "macOS",
    linuxWayland: "Linux (Wayland)",
    linuxX11: "Linux (X11)",
    windows: "Windows",
  },
  status: {
    idle: "Bezczynny",
    recording: "Nagrywanie",
    processing: "Przetwarzanie",
    completed: "Zakończono",
    error: "Błąd",
  },
  actions: {
    start: "Rozpocznij nagrywanie",
    stop: "Zatrzymaj nagrywanie",
    toggle: "Przełącz nagrywanie",
    status: "Sprawdź status",
  },
  recorderBackends: {
    ffmpegAvfoundation: "FFmpeg (AVFoundation)",
    ffmpegPulse: "FFmpeg (PulseAudio)",
    ffmpegAlsa: "FFmpeg (ALSA)",
    ffmpegDshow: "FFmpeg (DirectShow)",
    wfRecorder: "wf-recorder",
    arecord: "arecord",
  },
  typerBackends: {
    applescript: "AppleScript",
    wtype: "wtype",
    xdotool: "xdotool",
    wlClipboard: "wl-clipboard",
    xclip: "xclip",
    powershell: "PowerShell",
  },
};
