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
    // Used by views that exist on the server but are not in git (resources/views/vendor/* is
    // gitignored: Laravel pagination + published Peak form views). Keeps a fresh build from
    // dropping them. Safe to remove once those views are committed or added to `content`.
    '-ml-px',
    'active:bg-gray-100',
    'active:text-gray-500',
    'active:text-gray-700',
    'border-gray-300',
    'caret-primary',
    'duration-150',
    'file:bg-white',
    'file:border-2',
    'file:border-primary',
    'file:border-solid',
    'file:font-bold',
    'file:mr-4',
    'file:px-4',
    'file:py-2',
    'file:rounded',
    'file:text-primary',
    'file:text-xs',
    'file:uppercase',
    'flex-1',
    'focus-visible:border-red-600',
    'focus:z-10',
    'h-32',
    'hover:text-gray-400',
    'hover:text-gray-500',
    'pb-1',
    'rounded-l-md',
    'rounded-md',
    'rounded-r-md',
    'sm:flex-1',
    'sm:hidden',
    'sm:items-center',
    'sm:justify-between',
    'text-gray-500',
    'text-gray-700',
    'z-0',
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
