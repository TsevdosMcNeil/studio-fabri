//--------------------------------------------------------------------------
// Tailwind site configuration
//--------------------------------------------------------------------------
//
// Use this file to completely define the current sites design system by
// adding and extending to Tailwinds default utility classes.
//

const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  presets: [],
  theme: {
    // Here we define the default colors available. If you want to include
    // all default Tailwind colors you should extend the colors instead.
    colors: {
      black:   '#000',
      white:  '#fff',
      salmon: '#f16e62', //#757575, #A7A7A7
      gray: '#999', //#757575, #A7A7A7
      // Neutrals: neutral colors, with a default fallback if you don't need shades. Always set a DEFAULT when you use shades.
      neutral: {
        DEFAULT: '#000',
        ...colors.slate
      },
      // Primary: primary brand color with a default fallback if you don't need shades. Always set a DEFAULT when you use shades.
      primary: {
        DEFAULT: '#999', //#757575, #A7A7A7
      },
      secondary: {
        DEFAULT: 'rgba(255,255,255,0.5)',
      },
    },
    extend: {
      // Set default transition durations and easing when using the transition utilities.
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDelay: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
        '6000': '6000ms',
        '7000': '7000ms',
        '8000': '8000ms',
        '9000': '9000ms',
        '10000': '10000ms',
        '11000': '11000ms',
        '12000': '12000ms',

      },
      // that is animation class (animate-[animation name]])
      animation: {
        appearsin: 'appearsIn 1.2s ease forwards',
        appearsout: 'appearsOut 0.6s ease forwards',
        fadein: 'fadeIn 0.5s ease-in-out forwards',
        fadeout: 'fadeOut 0.5s ease-in-out forwards',
        moveup: 'moveUp 1s cubic-bezier(0.830, 0.865, 0.515, 0.925) forwards',
        movelittleup: 'moveLittleUp 0.5s cubic-bezier(0.830, 0.865, 0.515, 0.925) forwards',
        movelittledown: 'moveLittleDown 0.5s cubic-bezier(0.830, 0.865, 0.515, 0.925) forwards',
        chgcolour: 'changeColour 1s cubic-bezier(0.830, 0.865, 0.515, 0.925) forwards',
        chgopacity: 'changeOpacity 3s cubic-bezier(0.830, 0.865, 0.515, 0.925) forwards',
        fadeandmovein: 'fadeAndMoveIn 0.7s 0.15s forwards ease',
        fadeandmoveout: 'fadeAndMoveOut 0.7s 0.15s forwards ease',
        opacityin: 'opacityIn 0.7s 0.15s forwards ease',
        opacityout: 'opacityOut 0.7s 0.15s forwards ease',
        menuin: 'menuIn 0.5s ease-in-out forwards',
        menuout: 'menuOut 0.5s ease-in-out forwards',
      },

      // that is actual animation
      keyframes: theme => ({
        appearsIn: {
            '0%': {
              opacity: 0,
              transform: 'translateY(40px)',
              },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
        },
        appearsOut: {
            '0%': {
                opacity: 1,
                transform: 'translateY(0)',
            },
            '100%': {
                opacity: 0,
                transform: 'translateY(40px)',
            },
        },
        fadeAndMoveIn: {
            '0%':{
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%':{
                opacity: 1,
                transform: 'translateY(0)',
            }
        },
        fadeAndMoveOut: {
            '0%':{
                opacity: 1,
                transform: 'translateY(0)',
            },
            '100%':{
                opacity: 0,
                transform: 'translateY(20px)',
            }
        },
        opacityIn: {
            '0%':{
              opacity: 0,
            },
            '100%':{
                opacity: 1,
            }
        },
        opacityOut: {
            '0%':{
                opacity: 1,
            },
            '100%':{
                opacity: 0,
            }
        },
        fadeIn: {
          '0%': {
            opacity: 0,
            scale: 0,
            },
          '100%': {
            opacity: 1,
            scale: 1,
          },
        },
        fadeOut: {
            '0%': {
              opacity: 1,
              scale: 1,
              },
            '100%': {
              opacity: 0,
              scale: 0,
            },
        },
        moveUp: {
            '0%': {
                top: 'calc(100% - 30rem)',
                backgroundColor: 'black',
              },
            '100%': {
                top: 0, // '6.61rem'
                backgroundColor: 'white',
            },
        },
        moveLittleUp: {
            '0%': {
                top: '100%',
              },
            '100%': {
                top: 'calc(100% - 30rem)',
            },
        },
        moveLittleDown: {
            '0%': {
                top: 'calc(100% - 30rem)',
              },
            '100%': {
                top: '100%',
            },
        },
        changeColour: {
            '0%': {
                color: 'white',
                stroke: 'white',
                borderColor: 'white',
              },
            '100%': {
                color: 'black',
                stroke: 'black',
                borderColor: 'black',
            },
        },
        changeOpacity: {
            '0%': {
                opacity: 0,
            },
            '100%': {
                opacity: 0.5,
            },
        },
        menuIn: {
            '0%': {
                opacity: 0,
                zIndex: 10,
            },
            '100%': {
              opacity: 1,
            },
        },
        menuOut: {
              '0%': {
                visibility: 'visible',
                opacity: 1,
                },
              '100%': {
                visibility: 'hidden',
                opacity: 0,
                zIndex: -10,
              },
        },

      }),

      height: {
        '30': '7.5rem',
        '60': '15rem',
        '90': '22.5rem',
        '120': '30rem',
        '240': '60rem',
      },

      padding: {
        '14px': '14px',
        '17px': '17px',
        '20px': '20px',
      },

      spacing: {
        '46': '11.5rem',
        '50': '12.5rem',
      },

      cursor: {
        'lightbox': 'url(../cursors/lightbox.png), pointer',
        'lightboxminus': 'url(../cursors/lightbox_minus.png), pointer',
        'lightbox_back': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA3LTA3VDEzOjEyOjIxKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wNy0zMVQxMjoyMDoyNCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wNy0zMVQxMjoyMDoyNCswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyYmNkZWNlOC1hNDkyLTY4NDctODRmZS0wODZhYjc1YWRmZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MmJjZGVjZTgtYTQ5Mi02ODQ3LTg0ZmUtMDg2YWI3NWFkZmQ1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmJjZGVjZTgtYTQ5Mi02ODQ3LTg0ZmUtMDg2YWI3NWFkZmQ1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyYmNkZWNlOC1hNDkyLTY4NDctODRmZS0wODZhYjc1YWRmZDUiIHN0RXZ0OndoZW49IjIwMjEtMDctMDdUMTM6MTI6MjErMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58QdVEAAAAu0lEQVRYw+3XsQ3CMBCF4d+RS6gQqzAAEzBqKNIyAKtEVKFEPBqKkMYUZxSL9yQXl+Y+WXbkS5IITg8cZ/UFOEU2yMRnD2wXdWi6Cuh7oV4lunqMNtpoo4022mijjTb6uzwL9X+ik6T+PR49ArACDsBu9v0GXIEUsEkZmJIqTLa/ONNTY+Y2dzoD59bONJKi16DPDNE9ukr3pOpv1Wi/PYw22mijjTbaaKONXhd6U6hDZsTojIsJf4xu8AJZjLN0votyQAAAAABJRU5ErkJggg==), pointer',
      },

    },
    // Remove the font families you don't want to use.
    fontFamily: {
      mono: [
        // Use a custom mono font for this site by changing 'Anonymous' to the
        // font name you want and uncommenting the following line.
        // 'Anonymous',
        ...defaultTheme.fontFamily.mono,
      ],
      sans: [
        // Use a custom sans serif font for this site by changing 'Gaultier' to the
        // font name you want and uncommenting the following line.
        'CircularStd',
        ...defaultTheme.fontFamily.sans,
      ],
      serif: [
        // Use a custom serif font for this site by changing 'Lavigne' to the
        // font name you want and uncommenting the following line.
        // 'Lavigne',
        ...defaultTheme.fontFamily.serif,
      ],
    },
    // The font weights available for this site.
    fontWeight: {
      // hairline: 100,
      // thin: 200,
      // light: 300,
      normal: 400,
      // medium: 500,
      // semibold: 600,
      bold: 700,
      // extrabold: 800,
      // black: 900,
    },
    fontSize: {
        xxs: '0.444rem', // 8px
        xs: '0.556rem', // 10px  (old 0.5rem)
        sm: '0.889rem', // 16px (old 0.8rem)
        base: '1rem', // 18px (old 20px)
        header: '18px', //  (old 20px)
        xl: '1.389rem', // 25px (old 1.25rem)
        '2xl': '1.667rem', // 30px (old 1.5rem)
        '3xl': '2.083rem', // 37.5px (old 1.875rem)
        '4xl': '2.222rem', // 40px (old 2rem ) (orig: 2.25rem),
        '5xl': '3.333rem', // 60px  (old 3rem )
        '6xl': '4.167rem', // 75px  (old  3.75rem)
        '7xl': '5rem', // 90px  (old 4.5rem )
        '8xl': '5.833rem', // 105px  (old 5.25rem ) (orig: 6rem),
        '9xl': '18vw', // (orig: 8rem),
    },
    letterSpacing: {
        //tightest: '-.075em',
        //tighter: '-.05em',
        tight: '-2px', // (orig: -.025em)
        normal: '0',
        //wide: '.025em',
        //wider: '.05em',
        //widest: '.1em',
        //widest: '.25em',
    },
    lineHeight: { //leading
        nav: '0.95', // custom
        none: '1',
        compact: '1.1', // custom
        tight: '1.15',   // old  1.25
    },
    typography: {
        DEFAULT: { // this is for prose class
            css: {
                h1: {
                    fontSize: '2rem', // 4xl 40px (base 20px)
                    lineHeight: 1,
                    fontWeight: '400',
                },
                h2: {
                    fontSize: '2rem', // 4xl 40px (base 20px)
                    lineHeight: 1,
                    fontWeight: '400',
                },
                h3: {
                    fontSize: '1rem', // 4xl 40px (base 20px)
                    lineHeight: 1,
                    fontWeight: '400',
                },
                h4: {
                    fontSize: '1rem', // 4xl 40px (base 20px)
                    lineHeight: 1.1,
                    fontWeight: '400',
                },
            },
        },
        xl: { // and this is for prose-xl.
            css: {
                h1: {
                    fontSize: '5.25rem', // 105px (base 20px)
                    letterSpacing: '-2px',

                },
                h2: {
                    fontSize: '5.25rem', // 105px (base 20px)
                    letterSpacing: '-2px',
                },
                h4: {
                    fontSize: '2rem', // 40px (base 20px)
                },
            },
        },
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        ':root': {
            // Fluid typography from 1 rem to 1.2 rem with fallback to 20px.
            //'font-size': 'clamp(1rem, 20px, 1.2rem)',
            fontSize: '18px',

            // Safari resize fix.
            minHeight: '0vw',
        },
        // Default color transition on links unless user prefers reduced motion.
        '@media (prefers-reduced-motion: no-preference)': {
          'a': {
            transition: 'color .3s ease-in-out',
          },
        },
        'html': {
            color: theme('colors.neutral.DEFAULT'),
            //--------------------------------------------------------------------------
            // Set sans, serif or mono stack with optional custom font as default.
            //--------------------------------------------------------------------------
            // fontFamily: theme('fontFamily.mono'),
            fontFamily: theme('fontFamily.sans'),
            // fontFamily: theme('fontFamily.serif'),
        },
        'mark': {
          backgroundColor: theme('colors.primary.DEFAULT'),
          color: theme('colors.white')
        },
      })
    }),

    // Custom components for this particular site.
    plugin(function({ addComponents, theme }) {
      const components = {
        // Overwrites .fluid-container defined in tailwind.config.peak.js
        '.fluid-container': {
            width: '100%',
            maxWidth: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            // Use safe-area-inset together with default padding for Apple devices with a notch.
            paddingLeft: `calc(env(safe-area-inset-left, 0rem) + ${theme('padding.4')})`,
            paddingRight: `calc(env(safe-area-inset-right, 0rem) + ${theme('padding.4')})`,
        },
        // Overwrites .outer-grid defined in tailwind.config.peak.js
        '.outer-grid': {
            paddingTop: 0,
            paddingBottom: '0', //'240px',
            rowGap: 0,
            '& > *:last-child.w-full': {
              marginBottom: 0,
            },
        },
        '@media screen(lg)': {
            // Larger horizontal padding on larger screens.
            '.fluid-container': {
              // Use safe-area-inset together with default padding for Apple devices with a notch.
                paddingLeft: `calc(env(safe-area-inset-left, 0rem) + ${theme('padding.16')})`,
                paddingRight: `calc(env(safe-area-inset-right, 0rem) + ${theme('padding.16')})`,
            },
          },
      }
      addComponents(components)
    }),

    // Custom utilities for this particular site.
    plugin(function({ addUtilities, theme, variants }) {
      const newUtilities = {
      }
      addUtilities(newUtilities)
    }),

    // Custom variants for this particular site.
    plugin(function ({ addVariant }) {
        addVariant('mobile-only', "@media screen and (max-width: theme('screens.sm'))");
        // instead of hard-coded 640px use sm breakpoint value from config. Or anything
        addVariant('tablet-only', "@media screen and (min-width: theme('screens.sm')) and (max-width: calc(theme('screens.xl') - 1px))");
        addVariant('mbtb-only', "@media screen and (max-width: calc(theme('screens.xl') - 1px))");
    }),
  ]
}
