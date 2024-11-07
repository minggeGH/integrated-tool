import request from "@/utils/request";

export * as tool from './modules/tool';


// *ApiJson
export const apiJson = {
  get: (data) => {
    return request({
      url: "/fire/api/get",
      method: "post",
      data
    })
  },
  post: (data) => {
    return request({
      url: "/fire/api/post",
      method: 'post',
      data
    })
  },
  put: (data) => {
    return request({
      url: "/fire/api/put",
      method: 'post',
      data
    })
  },
  delete: (data) => {
    return request({
      url: "/fire/api/delete",
      method: 'post',
      data
    })
  }
}
