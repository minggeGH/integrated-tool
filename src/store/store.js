// 案件类型
export const caseType = [
  {
    label: "火灾",
    icon: "icon-[bi--fire]",
    color: "red",
    type: 1,
    to: "/selfServiceAlarm",
  },
  {
    label: "抢险救援",
    icon: "icon-[game-icons--tow-truck]",
    color: "indigo",
    type: 2,
    to: "/selfServiceAlarm",
  },
  {
    label: "社会救助",
    icon: "icon-[mdi--heart-multiple] ",
    color: "green",
    type: 3,
    to: "/selfServiceAlarm",
  },
  {
    label: "消防隐患举报",
    icon: "icon-[whh--warningsign]",
    color: "orange",
    type: 10,
    to: "/selfServiceAlarm",
  },
];
// 处理状态
export const treatmentState = {
  0: { class: "bg-light-green-11 text-dark" },
  1: { class: "bg-green-7 text-white" },
  2: { class: "bg-red-8 text-white" },
  3: { class: "bg-grey-4 text-dark" },
  99: { class: "bg-blue-6 text-white" },
};
