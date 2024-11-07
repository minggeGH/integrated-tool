// 主题处理
import tailwindConfig from "app/tailwind.config";
import { Dark, setCssVar } from 'quasar';
import chroma from "chroma-js";
// 主题配置
const $themeConfig = {
  defaultTheme: 'winter',
  themes: [{ label: '标准蓝', value: 'winter' }, { label: '暗黑', value: 'mytheme' }]
}
const theme = {
  themes: $themeConfig.themes, // 主题列表
  setTheme(themeName) {
    const html = document.getElementsByTagName('html')[0];
    html.dataset.theme = themeName;
    if (tailwindConfig.daisyui.darkThemes.includes(themeName)) {
      document.documentElement.classList.add('dark');
      Dark.set(true);
    } else {
      document.documentElement.classList.remove('dark');
      Dark.set(false);
    }

    const vars = [
      ['primary', '--p'],
      ['secondary', '--s'],
      ['accent', '--a'],
      ['dark', '--n'],
      ['positive', '--su'],
      ['negative', '--er'],
      ['info', '--in'],
      ['warning', '--wa'],
    ];

    vars.forEach(([qVar, dVar]) => {
      this.setColorVar(qVar, dVar);
    });
  },
  setColorVar(qVar, dVar) {
    const oklch = getComputedStyle(document.documentElement)
      .getPropertyValue(dVar)
      .trim()
      .split(' ');
    if (oklch) {
      let v0 = parseFloat(oklch[0]);
      let v1 = parseFloat(oklch[1]);
      let v2 = parseFloat(oklch[2]);
      if (oklch[0].indexOf('%') > -1) v0 = v0 / 100;

      setCssVar(qVar, chroma.oklch(v0, v1, v2).hex());
    }
  }
}

export default ({ app, router, store, urlPath }) => {
  // 设置config 到$q.config 便于项目应用
  theme.setTheme($themeConfig.defaultTheme)
  app.config.globalProperties.$theme = theme
}
