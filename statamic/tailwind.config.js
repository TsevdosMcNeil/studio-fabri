//--------------------------------------------------------------------------
// Tailwind configuration
//--------------------------------------------------------------------------
//
// Use the Tailwind configuration to completely define the current sites
// design system by adding and extending to Tailwinds default utility
// classes. Various aspects of the config are split inmultiple files.
//

/** @type {import('tailwindcss').Config} */
module.exports = {
  // The various configurable Tailwind configuration files.
  presets: [
    require('tailwindcss/defaultConfig'),
    require('./tailwind.config.typography.js'),
    require('./tailwind.config.peak.js'),
    require('./tailwind.config.site.js'),
  ],
  // Configure files to scan for utility classes (JIT).
  content: [
    './resources/views/**/*.blade.php',
    './resources/views/**/*.html',
    './resources/js/**/*.js',
    './vendor/studio1902/**/*.blade.php',
    './vendor/studio1902/**/*.html',
    './vendor/studio1902/**/*.js',
  ],
  safelist: [
    {
      pattern: /col-start-([0-9]|1[0-2])/,
      variants: ['md'],
    },
    {
        pattern: /col-span-([0-9]|1[0-2])/,
        variants: ['md'],
    },
    {
        pattern: /row-span-([0-6])/,
        variants: ['md'],
    },
    {
        pattern: /p(t|r|b|l)-(4|8|12|16|20|24|28|32|36|40)/,
        variants: ['md'],
    }
  ],
}
