import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontSize: {
                xs: ['11px', '1.35'],
                sm: ['12px', '1.4'],
                base: ['13px', '1.5'],
                md: ['14px', '1.5'],
                lg: ['16px', '1.45'],
                xl: ['18px', '1.4'],
                '2xl': ['20px', '1.35'],
                '3xl': ['24px', '1.3'],
            },
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
                // ResumeAI new colors
                'bg-primary': '#F0F7FF',
                'bg-secondary': '#FFFFFF',
                'accent-blue': '#3B82F6',
                'accent-light': '#DBEAFE',
                'text-primary': '#1E293B',
                'text-secondary': '#64748B',
                'text-inverse': '#FFFFFF',
                'card-light': '#FFFFFF',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                'card': '0 4px 24px rgba(59, 130, 246, 0.08)',
                'card-hover': '0 12px 32px rgba(59, 130, 246, 0.12)',
                'button': '0 8px 24px rgba(59, 130, 246, 0.3)',
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
            },
            spacing: {
                '4.5': '1.125rem',
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
                "gradient-x": {
                    "0%, 100%": {
                        "background-size": "200% 200%",
                        "background-position": "left center",
                    },
                    "50%": {
                        "background-size": "200% 200%",
                        "background-position": "right center",
                    },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "gradient-x": "gradient-x 15s ease infinite",
                "float": "float 4s ease-in-out infinite",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

export default config;
