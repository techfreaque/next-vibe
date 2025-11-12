/**
 * Speech-to-Text Hotkey German translations
 */

export const hotkeyTranslations = {
  platforms: {
    macos: "macOS",
    linuxWayland: "Linux (Wayland)",
    linuxX11: "Linux (X11)",
    windows: "Windows",
  },
  status: {
    idle: "Leerlauf",
    recording: "Aufnahme",
    processing: "Verarbeitung",
    completed: "Abgeschlossen",
    error: "Fehler",
  },
  actions: {
    start: "Aufnahme starten",
    stop: "Aufnahme stoppen",
    toggle: "Aufnahme umschalten",
    status: "Status prüfen",
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
