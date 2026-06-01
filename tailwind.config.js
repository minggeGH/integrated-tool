/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import { addDynamicIconSelectors } from "@iconify/tailwind";
export default {
  content: ["./src/**/*.{html,js,vue}"],
  darkMode: ['class', '[class="dark"]'],
  prefix: '',
  plugins: [daisyui, addDynamicIconSelectors()],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#1976D2",
          secondary: "#26A69A",
          accent: "#9C27B0",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e0e0e0",
          "base-content": "#1d1d1d",
          info: "#31CCEC",
          success: "#21BA45",
          warning: "#F2C037",
          error: "#C10015",
        },
      },
      {
        dark: {
          primary: "#BB86FC",
          secondary: "#03DAC6",
          accent: "#03A9F4",
          neutral: "#1f2937",
          "base-100": "#1E1E1E",
          "base-200": "#121212",
          "base-300": "#0a0a0a",
          "base-content": "#e0e0e0",
          info: "#29B6F6",
          success: "#00C853",
          warning: "#FFC107",
          error: "#D32F2F",
        },
      },
    ],
  },
}
