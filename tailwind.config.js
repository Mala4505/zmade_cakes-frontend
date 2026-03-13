module.exports = {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'selector',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        "2xl": '1400px'
      }
    },
    extend: {
      fontFamily: {
        heading: ['Playball', 'cursive'],
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        'muted-foreground': 'var(--muted-foreground)',
        'popover-foreground': 'var(--popover-foreground)',
        'card-foreground': 'var(--card-foreground)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'accent-foreground': 'var(--accent-foreground)',
        'destructive-foreground': 'var(--destructive-foreground)',
        'zm-teal': 'var(--zm-teal)',
        'zm-teal-light': 'var(--zm-teal-light)',
        'zm-teal-hover': 'var(--zm-teal-hover)',
        'zm-warm': 'var(--zm-warm)',
        'zm-gold': 'var(--zm-gold)',
        'zm-gold-light': 'var(--zm-gold-light)',
        'zm-success': 'var(--zm-success)',
        'zm-success-light': 'var(--zm-success-light)',
        'zm-warning': 'var(--zm-warning)',
        'zm-warning-light': 'var(--zm-warning-light)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': {
            opacity: 1
          },
          '20%,50%': {
            opacity: 0
          }
        },
        'accordion-down': {
          from: {
            height: 0
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: 0
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      }
    }
  }
}