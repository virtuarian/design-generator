/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...existing code...
  
  theme: {
    extend: {
      // ...existing code...
      
      animation: {
        'fadeIn': 'fadeIn 0.7s ease-in-out forwards',
        'claudeSpin': 'claudeSpin 1s linear infinite',
        'claudeFadeIn': 'claudeFadeIn 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        claudeSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        claudeFadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      typography: (theme) => ({
        stone: {
          css: {
            '--tw-prose-headings': theme('colors.stone.800'),
            '--tw-prose-body': theme('colors.stone.700'),
            '--tw-prose-links': theme('colors.amber.700'),
            '--tw-prose-quotes': theme('colors.stone.600'),
          },
        },
      }),
    },
  },
  
  // ...existing code...
};