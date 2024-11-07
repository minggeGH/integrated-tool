
// 获取路径中的参数
export function getUrlParams(name) {
  // \b 边界
  // ?<= 向后匹配
  // 字符串转成正则表达式，其中的'\b'类型的特殊字符要多加一个'\'
  let reg = new RegExp(`(?<=\\b${name}=)[^&]*`),
    str = location.href || '',
    target = str.match(reg);

  if (target) {
    return target[0]
  }

  return;
}
// 格式化时间
export const formatTime = function (time, format) {
  time = new Date(time)
  format = format || 'YYYY-MM-DD'

  function tf(i) {
    return (i < 10 ? '0' : '') + i
  }
  return format.replace(/YYYY|MM|DD|hh|mm|ss|WW/g, function (a) {
    switch (a) {
      case 'YYYY':
        return tf(time.getFullYear())
      case 'MM':
        return tf(time.getMonth() + 1)
      case 'DD':
        return tf(time.getDate())
      case 'mm':
        return tf(time.getMinutes())
      case 'hh':
        return tf(time.getHours())
      case 'ss':
        return tf(time.getSeconds())
      case 'WW':
        return ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
    }
  })
}
// 获取终端类型
export const getENVIR = function () {
  const ua = navigator.userAgent.toLowerCase()
  const isWeixin = ua.indexOf('micromessenger') !== -1;
  const isInApp = /(^|;\s)app\//.test(ua);
  if (isWeixin) {
    if (window.__wxjs_environment === 'miniprogram') {
      return 'wxapp';
    } else {
      return 'wxh5';
    }
  } else {
    if (!isInApp) {
      return 'browser';
    } else {
      return 'app';
    }
  }
}

//* 获取assets文件
export const getAssetsFile = function (url) {
  return new URL(`../assets/${url}`, import.meta.url).href
}


