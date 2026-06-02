<!-- 统计页面 -->
<template>
  <q-page class="flex flex-col bg-base-200" :data-theme="currentTheme">
    <div class="w-full max-w-4xl mx-auto p-4 space-y-4">
      <!-- 月度对比卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--bar-chart-rounded] text-xl"></span>
            月度对比
          </h3>

          <!-- 月份选择 -->
          <div class="flex gap-2 mt-2">
            <q-btn
              :color="selectedMonth === 'current' ? 'primary' : 'base-200'"
              :text-color="selectedMonth === 'current' ? 'white' : 'base-content'"
              label="本月"
              class="flex-1"
              @click="selectedMonth = 'current'"
            />
            <q-btn
              :color="selectedMonth === 'last' ? 'primary' : 'base-200'"
              :text-color="selectedMonth === 'last' ? 'white' : 'base-content'"
              label="上月"
              class="flex-1"
              @click="selectedMonth = 'last'"
            />
          </div>

          <!-- 对比图表 -->
          <div class="mt-4 space-y-3">
            <!-- 余额对比 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">余额</span>
              </div>
              <div class="flex items-end gap-4 h-24">
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">上月</div>
                  <div
                    class="w-full bg-secondary rounded-t transition-all duration-500"
                    :style="{ height: getLastMonthHeight('balance') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ lastMonthData.balance || 0 }}</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">本月</div>
                  <div
                    class="w-full bg-primary rounded-t transition-all duration-500"
                    :style="{ height: getCurrentMonthHeight('balance') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ currentMonthData.balance || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- 扣除项对比 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">扣除项合计</span>
              </div>
              <div class="flex items-end gap-4 h-24">
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">上月</div>
                  <div
                    class="w-full bg-warning rounded-t transition-all duration-500"
                    :style="{ height: getLastMonthHeight('subtract') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ lastMonthData.subtractTotal || 0 }}</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">本月</div>
                  <div
                    class="w-full bg-accent rounded-t transition-all duration-500"
                    :style="{ height: getCurrentMonthHeight('subtract') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ currentMonthData.subtractTotal || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- 伙食费对比 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">伙食费</span>
              </div>
              <div class="flex items-end gap-4 h-24">
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">上月</div>
                  <div
                    class="w-full bg-info rounded-t transition-all duration-500"
                    :style="{ height: getLastMonthHeight('food') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ lastMonthData.foodTotal || 0 }}</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="text-xs text-base-content/60 mb-1">本月</div>
                  <div
                    class="w-full bg-success rounded-t transition-all duration-500"
                    :style="{ height: getCurrentMonthHeight('food') + '%' }"
                  ></div>
                  <div class="text-xs mt-1">{{ currentMonthData.foodTotal || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 月度总结列表 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <h3 class="card-title text-base">
              <span class="icon-[material-symbols--list-alt-rounded] text-xl"></span>
              月度总结
            </h3>
            <q-btn
              flat
              dense
              color="primary"
              label="保存本月"
              icon="icon-[material-symbols--save-rounded]"
              @click="saveCurrentMonth"
            />
          </div>

          <div class="mt-4 space-y-2">
            <div
              v-for="(month, idx) in monthSummaries"
              :key="month.month"
              class="bg-base-200 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold">{{ month.month }}</span>
                <q-btn
                  flat
                  round
                  dense
                  icon="icon-[material-symbols--delete-rounded]"
                  color="negative"
                  size="sm"
                  @click="deleteMonthSummary(idx)"
                />
              </div>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div class="text-base-content/60">余额</div>
                  <div class="font-medium text-primary">{{ month.balance }}</div>
                </div>
                <div>
                  <div class="text-base-content/60">扣除项</div>
                  <div class="font-medium text-secondary">{{ month.subtractTotal }}</div>
                </div>
                <div>
                  <div class="text-base-content/60">伙食费</div>
                  <div class="font-medium text-accent">{{ month.foodTotal }}</div>
                </div>
              </div>
              <div class="divider my-2"></div>
              <div class="flex justify-between text-sm">
                <span class="text-base-content/60">剩余可用</span>
                <span class="font-bold text-lg" :class="month.remaining >= 0 ? 'text-positive' : 'text-negative'">
                  {{ month.remaining }}
                </span>
              </div>
            </div>
            <div v-if="!monthSummaries.length" class="text-base-content/40 text-sm italic text-center py-8">
              暂无月度总结，点击上方按钮保存本月数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, LocalStorage } from "quasar";
import { useTheme } from "@/utils/theme";

const $q = useQuasar();
const currentTheme = useTheme();

const selectedMonth = ref("current");
const monthSummaries = ref([]);

// 获取当前月份数据
const currentMonthData = computed(() => {
  const cached = LocalStorage.getItem("accounting_data");
  if (!cached) return { balance: 0, subtractTotal: 0, foodTotal: 0 };

  const balance = Number(cached.balance) || 0;
  const subtractItems = Array.isArray(cached.subtractItems) ? cached.subtractItems : [];
  const subtractTotal = subtractItems.reduce((s, item) => s + (Number(item.value) || 0), 0);
  const dailyFoodCost = Number(cached.dailyFoodCost) || 0;

  // 计算剩余天数（支持自定义日期）
  let remainingDays = 0;
  const dateSettings = LocalStorage.getItem("date_settings");
  if (dateSettings && dateSettings.useCustomDate && dateSettings.startDate && dateSettings.endDate) {
    const start = new Date(dateSettings.startDate);
    const end = new Date(dateSettings.endDate);
    const today = new Date();
    if (today >= start && today <= end) {
      const timeDiff = end.getTime() - today.getTime();
      remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    }
  } else {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    remainingDays = lastDay - currentDay + 1;
  }

  const foodTotal = dailyFoodCost * remainingDays;

  return { balance, subtractTotal, foodTotal };
});

// 获取上月数据（从月度总结中查找）
const lastMonthData = computed(() => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const summary = monthSummaries.value.find(m => m.month === lastMonthStr);
  if (summary) {
    return {
      balance: summary.balance,
      subtractTotal: summary.subtractTotal,
      foodTotal: summary.foodTotal
    };
  }
  return { balance: 0, subtractTotal: 0, foodTotal: 0 };
});

// 计算图表高度百分比
function getCurrentMonthHeight(type) {
  const current = currentMonthData.value[type === "balance" ? "balance" : type === "subtract" ? "subtractTotal" : "foodTotal"];
  const last = lastMonthData.value[type === "balance" ? "balance" : type === "subtract" ? "subtractTotal" : "foodTotal"];
  const max = Math.max(current, last, 1);
  return (current / max) * 100;
}

function getLastMonthHeight(type) {
  const current = currentMonthData.value[type === "balance" ? "balance" : type === "subtract" ? "subtractTotal" : "foodTotal"];
  const last = lastMonthData.value[type === "balance" ? "balance" : type === "subtract" ? "subtractTotal" : "foodTotal"];
  const max = Math.max(current, last, 1);
  return (last / max) * 100;
}

// 保存本月总结
function saveCurrentMonth() {
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // 检查是否已存在
  const existingIdx = monthSummaries.value.findIndex(m => m.month === monthStr);
  const summary = {
    month: monthStr,
    balance: currentMonthData.value.balance,
    subtractTotal: currentMonthData.value.subtractTotal,
    foodTotal: currentMonthData.value.foodTotal,
    remaining: currentMonthData.value.balance - currentMonthData.value.subtractTotal - currentMonthData.value.foodTotal,
    timestamp: now.getTime()
  };

  if (existingIdx >= 0) {
    monthSummaries.value[existingIdx] = summary;
  } else {
    monthSummaries.value.unshift(summary);
  }

  LocalStorage.set("month_summaries", monthSummaries.value);
  $q.notify({ message: "保存成功", color: "positive", position: "top", icon: "check" });
}

// 删除月度总结
function deleteMonthSummary(idx) {
  $q.dialog({
    title: "确认删除",
    message: `确定要删除「${monthSummaries.value[idx].month}」的总结吗？`,
    ok: "删除",
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    monthSummaries.value.splice(idx, 1);
    LocalStorage.set("month_summaries", monthSummaries.value);
    $q.notify({ message: "已删除", color: "positive", position: "top", icon: "check" });
  });
}

onMounted(() => {
  const cached = LocalStorage.getItem("month_summaries");
  if (cached && Array.isArray(cached)) {
    monthSummaries.value = cached;
  }
});
</script>
