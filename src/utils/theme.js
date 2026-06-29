import { Dark, LocalStorage } from "quasar";
import { ref } from "vue"

/**
 * 主题管理工具
 * 支持亮色和暗色主题切换，使用 DaisyUI 主题系统
 */

// 主题类型
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

// 全局响应式主题状态
const currentTheme = ref('dark')

/**
 * 初始化主题
 * 在应用启动时调用，加载保存的主题设置
 */
export function initTheme() {
  let savedTheme = LocalStorage.getItem('theme')
  if (!savedTheme) {
    // 如果没有保存的主题，则跟随系统偏好
    savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
  }
  applyTheme(savedTheme)
  return savedTheme
}

/**
 * 应用主题
 * @param {string} theme - 主题名称 ('light' 或 'dark')
 */
export function applyTheme(theme) {
  // 设置 html 元素的 data-theme 属性（DaisyUI 要求）
  document.documentElement.setAttribute('data-theme', theme)
  
  // 同步 Quasar 的暗色模式
  Dark.set(theme === THEMES.DARK)
  
  // 保存到本地存储
  LocalStorage.set('theme', theme)
  
  // 更新全局响应式状态
  currentTheme.value = theme
}

/**
 * 切换主题
 * @returns {string} 新主题名称
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || THEMES.DARK
  const newTheme = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  applyTheme(newTheme)
  return newTheme
}

/**
 * 获取当前主题
 * @returns {string} 当前主题名称
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || THEMES.DARK
}

/**
 * 检查是否为暗色主题
 * @returns {boolean}
 */
export function isDark() {
  return getCurrentTheme() === THEMES.DARK
}

/**
 * 获取全局响应式主题状态
 * @returns {Ref} 响应式主题引用
 */
export function useTheme() {
  return currentTheme
}

export default {
  THEMES,
  initTheme,
  applyTheme,
  toggleTheme,
  getCurrentTheme,
  isDark,
  useTheme
}
