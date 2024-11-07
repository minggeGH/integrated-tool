// todo 案件常量
import { getAssetsFile } from "@/utils/utils";
// *案件类型
export const caseTypes = [
  {
    key: "1",
    label: "火灾",
    icon: "bi-fire",
    img: () => getAssetsFile("images/caseType/icon-1.png"),
    color: "red",
  },
  {
    key: "2",
    label: "抢险救援",
    icon: "mdi-tow-truck",
    img: () => getAssetsFile("images/caseType/icon-2.png"),
    color: "blue",
  },
  {
    key: "3",
    label: "社会救助",
    icon: "mdi-heart-multiple",
    img: () => getAssetsFile("images/caseType/icon-3.png"),
    color: "green",
  },
  {
    key: "4",
    label: "反恐排爆",
    icon: "security",
    img: () => getAssetsFile("images/caseType/icon-4.png"),
    color: "negative",
  },
  {
    key: "5",
    label: "训练",
    icon: "groups",
    img: () => getAssetsFile("images/caseType/icon-5.png"),
    color: "accent",
  },
  {
    key: "6",
    label: "安保",
    icon: "local_police",
    img: () => getAssetsFile("images/caseType/icon-6.png"),
    color: "positive",
  },
  {
    key: "99",
    label: "其他",
    icon: "more",
    img: () => getAssetsFile("images/caseType/icon-99.png"),
    color: "primary",
  },
];

// *案件状态
export const caseStates = [
  {
    key: "1", // 代码值
    label: "立案", // 标签
    abbreviation: "立", // 简称
    color: "green", // 代表颜色
    progress: 0.1, // 进度值
  },
  {
    key: "1",
    label: "通知",
    abbreviation: "通",
    color: "orange",
    progress: 0.1,
  },
  {
    key: "1",
    label: "接收",
    abbreviation: "接",
    color: "orange",
    progress: 0.1,
  },
  {
    key: "1",
    label: "人工接收",
    abbreviation: "接",
    color: "orange",
    progress: 0.15,
  },
  {
    key: "1",
    label: "出动",
    abbreviation: "出",
    color: "red",
    progress: 0.2,
  },
  {
    key: "1",
    label: "到场",
    abbreviation: "到",
    color: "red",
    progress: 0.3,
  },
  {
    key: "1",
    label: "展开",
    abbreviation: "展",
    color: "red",
    progress: 0.35,
  },
  {
    key: "1",
    label: "出水",
    abbreviation: "水",
    color: "red",
    progress: 0.4,
  },
  {
    key: "1",
    label: "控制",
    abbreviation: "控",
    color: "red",
    progress: 0.5,
  },
  {
    key: "1",
    label: "熄灭",
    abbreviation: "熄",
    color: "red",
    progress: 0.6,
  },
  {
    key: "1",
    label: "停水",
    abbreviation: "停",
    color: "red",
    progress: 0.7,
  },
  {
    key: "1",
    label: "返队",
    abbreviation: "返",
    color: "red",
    progress: 0.8,
  },
  {
    key: "1",
    label: "归队",
    abbreviation: "归",
    color: "grey",
    progress: 0.9,
  },
  {
    key: "1",
    label: "结案",
    abbreviation: "结",
    color: "grey",
    progress: 1,
  },
  {
    key: "1",
    label: "归档",
    abbreviation: "档",
    color: "grey",
    progress: 1,
  },
];

export const filterData = (type, key) => {
  let outData = null;
  switch (type) {
    case "caseTypes":
      outData = caseTypes.find((item) => item.key == key);
      break;
    default:
      break;
  }
  return outData;
};
