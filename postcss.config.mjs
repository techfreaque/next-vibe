/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      'postcss-preset-env': {
        stage: 1,
        features: {
          'custom-properties': {
            preserve: true
          },
          'nesting-rules': true,
          // Disable :is() transformation - all modern browsers support it
          'is-pseudo-class': false
        }
      }
    } : {})
  },
};

export default config;
