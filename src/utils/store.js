
import wx from "weixin-webview-jssdk";

export const LOGIN_DATA = "LOGIN_DATA";
export const PHONE_JSON = "PHONE_JSON";
export const NO_PHONE_JSON = "NO_PHONE_JSON";
export const USER_INFO = "USER_INFO";

// 用户登录开发接口修改
export const setLoginJson = function (data) {
  wx.setStorageSync(LOGIN_DATA, data);
}
export const getLoginJson = function () {
  return wx.getStorageSync(LOGIN_DATA);
}
export const rmLoginJson = function () {
  wx.removeStorageSync(LOGIN_DATA);
}
// 用户手机号码相关
export const setPhoneJson = function (data) {
  wx.setStorageSync(PHONE_JSON, data);
}
export const setNoPhoneJson = function () {
  wx.setStorageSync(PHONE_JSON, NO_PHONE_JSON);
}
export const getPhoneJson = function () {
  return wx.getStorageSync(PHONE_JSON);
}
export const checkIsNoPhoneJson = function () {
  const val = getPhoneJson();
  return val === NO_PHONE_JSON;
}
export const checkPhoneJsonPass = function () {
  const val = getPhoneJson();
  return !val || val === '' || val === 'NO_PHONE_JSON';
  // return !val || val === '';
}
export const rmPhoneJson = function () {
  wx.removeStorageSync(PHONE_JSON);
}

// 用户信息相关
export const setUserInfo = function (userInfo) {
  wx.setStorageSync(USER_INFO, userInfo);
}
export const getUserInfo = function () {
  return wx.getStorageSync(USER_INFO);
}
export const rmUserInfo = function () {
  wx.removeStorageSync(USER_INFO);
}
