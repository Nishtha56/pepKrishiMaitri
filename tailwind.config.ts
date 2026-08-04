import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Apple-like font stack
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Enhanced theme colors for farmer-friendly UI
        offwhite: {
          DEFAULT: '#faf8f4',
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f0e8',
        },

        // Deep Green gradient palette (complete shades)
        deepGreen: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2e7d32',
          600: '#1b5e20',
          700: '#1a5424',
          800: '#155118',
          900: '#0d3a10',
        },

        // Fresh Green gradient (complete shades)
        freshGreen: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },

        // Yellow/Amber gradient (complete shades)
        warmAmber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },

        // Orange gradient (complete shades)
        vibrantOrange: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ff9800',
          500: '#ff6d00',
          600: '#ff5722',
          700: '#f4511e',
          800: '#e64a19',
          900: '#d84315',
        },

        // NEW: Forest Green - Deep muted green for navbar
        forestGreen: {
          50: '#eef5f0',
          100: '#d4e9d9',
          200: '#a8d4b3',
          300: '#6ba870',
          400: '#4a8f4f',
          500: '#2d6b32',
          600: '#1f5425',
          700: '#1a3d2e',
          800: '#142d22',
          900: '#0d2a1f',
        },

        // NEW: Muted Amber - Earthy gold tones
        mutedAmber: {
          50: '#fdf8f0',
          100: '#faefd8',
          200: '#f5ddb0',
          300: '#e8c864',
          400: '#d4a846',
          500: '#b8922e',
          600: '#9a7824',
          700: '#7d601d',
          800: '#664d18',
          900: '#4a3811',
        },

        // NEW: Ocean Blue - Muted sky blue
        oceanBlue: {
          50: '#f0f5f9',
          100: '#d9e6f0',
          200: '#b3cce0',
          300: '#6b9bc4',
          400: '#4a7fa8',
          500: '#2d5a7a',
          600: '#224560',
          700: '#1a3548',
          800: '#132630',
          900: '#0d1a20',
        },

        // NEW: Plum Violet - Muted purple
        plumViolet: {
          50: '#f5f0f9',
          100: '#e8daf0',
          200: '#d1b5e0',
          300: '#9678b8',
          400: '#7b5a9e',
          500: '#5a3d7a',
          600: '#462f5f',
          700: '#332346',
          800: '#241830',
          900: '#160d1c',
        },

        // NEW: Terracotta - Warm earthy orange
        terracotta: {
          50: '#fdf5f0',
          100: '#fae6d8',
          200: '#f5c9a8',
          300: '#e49654',
          400: '#d97d3a',
          500: '#bf5b22',
          600: '#9a481b',
          700: '#753615',
          800: '#52260f',
          900: '#331809',
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // Enhanced border radius for modern look
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },

      // Soft shadows for depth
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'glow-green': '0 0 20px rgba(76, 175, 80, 0.3)',
        'glow-amber': '0 0 20px rgba(255, 193, 7, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 152, 0, 0.3)',
      },

      // Letter spacing for Apple-like typography
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
      },

      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },

      // Backdrop blur utilities
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
