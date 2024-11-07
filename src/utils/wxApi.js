import wx from "weixin-webview-jssdk";
import * as Api from '@/api/api.js'
import axios from 'axios';
import { getUrlParams } from "@/utils/utils.js";
export class Wx {
  constructor() {
  };
  getWx() {
    Api.system.getJsSDKConfig({ url: getStringBeforeHash(location.href) }).then(({ data }) => {
      if (data) {
        wx.isAuthorization = false
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['getLocation'], // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
          wx.isAuthorization = true
          // getPhoneNumber(data.accessToken)
        })
      }
    })
  };
}

const getPhoneNumber = (accessToken) => {
  if (accessToken) {
    let url = `/wxa/business/getuserphonenumber?access_token=${accessToken}&code=${getUrlParams('phoneCode')}`
    axios({ url, method: 'POST' }).then((res) => {
      alert(JSON.stringify(res))
    }).catch(err => {
      alert(JSON.stringify(err))

    })
  }
}
function getStringBeforeHash(url) {
  return url.split('#')[0];
}
