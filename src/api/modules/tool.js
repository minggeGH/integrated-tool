import request from "@/utils/request";

export function getToolData(params) {
  return request({
    url: '/toolServe',
    method: 'get',
    params
  });
}

export function updataToolData(data) {
  return request({
    url: '/toolServe/edit',
    method: 'post',
    data
  });
}