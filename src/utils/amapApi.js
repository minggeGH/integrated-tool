import AMapLoader from "@amap/amap-jsapi-loader";
export let AMap = null

export class AMAP {
  constructor() {
    window._AMapSecurityConfig = {
      // securityJsCode: 'f17572f55c49236dd03e89fcb9d77fca'
      securityJsCode: 'ef260f61cd4b55e7b8a2bb66887eda05' // 测试
    }
  }
  load() {
    return new Promise((resolve, reject) => {
      AMapLoader.load({
        // key: "878a7990a868b38bf0564eeda94883ce", // 申请好的Web端开发者Key，首次调用 load 时必填
        key: "edd537abd1947c809e5b695723c115e9", // 测试
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.createDefaultLayer', 'AMap.Geolocation', 'AMap.CitySearch', 'AMap.ToolBar', 'AMap.PlaceSearch'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        AMapUI: {
          //是否加载 AMapUI，缺省不加载
          version: "1.1", //AMapUI 版本
          plugins: ["overlay/SimpleMarker"], //需要加载的 AMapUI ui 插件
        },
        Loca: {
          //是否加载 Loca， 缺省不加载
          version: "2.0", //Loca 版本
        }
      })
        .then((AMapRes) => {
          AMap = AMapRes
          resolve(AMap)
        })
        .catch((e) => {
          reject(e)
        });
    })
  }
}
// 获取当前定位
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 设置定位超时时间，默认：无穷大
        offset: [10, 20],  // 定位按钮的停靠位置的偏移量
        zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        position: 'RB', //  定位按钮的排放位置,  RB表示右下
        location_type: 'h5',
        enableHighAccuracy: true,
        convert: true
      })

      geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
          resolve(result)
        } else {
          reject(result)
        }
      });
    })
  })
}

// 获取地址
export function getAddress(lnglat, call) {
  let siteName = ''
  AMap.plugin(['AMap.PlaceSearch'], function () {
    var placeSearch = new AMap.PlaceSearch()
    placeSearch.searchNearBy(
      '', // 关键字
      lnglat, // 中心点经纬度
      '', // 半径
      function (status, result) {
        if (status === 'complete') {
          siteName = result.poiList.pois[0].name
        }
        call(siteName)
      }
    )
  })
}

// 根据地址搜索坐标
export function getCoord(site, call) {
  AMap.plugin(['AMap.PlaceSearch'], function () {
    var placeSearch = new AMap.PlaceSearch()
    placeSearch.search(site, function (status, result) {
      let pois = null
      if (status === 'complete' && result.poiList.pois.length > 0) {
        // 查询成功时，result即对应匹配的POI信息
        pois = [
          result.poiList.pois[0].location.KL,
          result.poiList.pois[0].location.kT
        ]
      }
      call(pois)
    })
  })
}
