import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "rgb(var(--color-accent) / var(--tw-bg-opacity, 1))",
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translate(var(--tw-translate-x), var(--tw-translate-y))",
          },
          "50%": {
            transform: "translate(var(--tw-translate-x), -20px)",
          },
        },
      },
      animation: {
        float: "float 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
  darkMode: ["selector"],
};
export default config;
