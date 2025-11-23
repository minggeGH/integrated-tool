/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import { addDynamicIconSelectors } from "@iconify/tailwind";
export default {
  content: ["./src/**/*.{html,js,vue}"],
  darkMode: ['class', '[class="dark"]'],
  prefix: '',
  plugins: [daisyui, addDynamicIconSelectors()],
}
