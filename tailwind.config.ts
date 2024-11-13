import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    // Background color
    ...['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'indigo', 'teal', 'orange']
      .flatMap(color => [`bg-${color}-500`, `bg-${color}-600`, `bg-${color}-700`]),

    // Text color
    ...['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'indigo', 'teal', 'orange']
      .flatMap(color => [`text-${color}-500`, `text-${color}-600`, `text-${color}-700`]),

    // Text decoration
    'underline',
    'line-through',
    'no-underline',
    ...['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'indigo', 'teal', 'orange']
      .flatMap(color => [`decoration-${color}-500`, `decoration-${color}-600`, `decoration-${color}-700`]),

    // Spaced
    ...Array.from({ length: 21 }, (_, i) => `p-${i}`), // padding 0 - 20
    ...Array.from({ length: 21 }, (_, i) => `m-${i}`), // margin 0 - 20

    // Flex & Grid
    'flex',
    'grid',
    'inline-flex',
    'inline-grid',
    'justify-center',
    'justify-between',
    'items-center',
    'items-start',
    'items-end',

    // Borders
    'rounded',
    ...['sm', 'md', 'lg', 'full'].map(size => `rounded-${size}`),
    ...['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'indigo', 'teal', 'orange']
      .flatMap(color => [`border-${color}-500`, `border-${color}-600`]),

    // Shadows
    'shadow',
    'shadow-md',
    'shadow-lg',

    // Opacity 
    ...Array.from({ length: 10 }, (_, i) => `opacity-${(i + 1) * 10}`), // opacity-10, opacity-20, ...

    // Other examples
    'overflow-hidden',
    'overflow-scroll',
    'w-full',
    'h-screen',
    'max-w-lg',
  ],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config