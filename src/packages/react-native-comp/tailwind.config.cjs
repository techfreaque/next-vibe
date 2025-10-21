/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../app/**/*.{ts,tsx}',
    '../next-vibe-ui/native/ui/packages/reusables/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
};

