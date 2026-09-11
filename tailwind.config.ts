import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        note: {
          default: "var(--note-default)",
          blue: "var(--note-blue)",
          purple: "var(--note-purple)",
          green: "var(--note-green)",
          yellow: "var(--note-yellow)",
          orange: "var(--note-orange)",
          red: "var(--note-red)",
          pink: "var(--note-pink)",
        }
      },
    },
  },
  plugins: [],
};
export default config;
