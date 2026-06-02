<!-- 记账页面 -->
<template>
  <q-page class="flex flex-col bg-base-200" :data-theme="currentTheme">
    <div class="w-full max-w-4xl mx-auto p-4 space-y-4 flex-1">
      <!-- 余额概览卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="card-title text-base-content/70">
              <span class="icon-[material-symbols--account-balance-wallet] text-xl"></span>
              余额
            </h2>
            <div class="text-3xl font-bold text-primary">{{ balanceDisplay }}</div>
          </div>

          <!-- 减去值列表 -->
          <div class="divider my-2">扣除项</div>
          <div class="flex flex-wrap gap-2">
            <div v-for="(item, idx) in subtractItems" :key="'item-' + idx"
              class="flex items-center gap-2 px-3 py-2 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
              @click="editItem(idx)">
              <span class="badge badge-sm" :class="getTagColor(item.tag)">{{ item.tag }}</span>
              <span class="font-semibold">- {{ item.value }}</span>
            </div>
            <div v-if="!subtractItems.length" class="text-base-content/40 text-sm italic text-center py-4 w-full">
              暂无扣除项，点击下方添加
            </div>
          </div>
          <div v-if="subtractItems.length" class="mt-2 text-sm text-base-content/60 flex justify-between">
            <span>合计：<span class="font-semibold text-secondary">{{ sumSubtract }}</span></span>
            <span>共 {{ subtractItems.length }} 项</span>
          </div>

          <!-- 伙食费 -->
          <div class="divider my-2">伙食费</div>
          <div class="bg-base-200 rounded-lg p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-base-content/60">每日标准</span>
              <span class="text-lg font-semibold text-accent">{{ dailyFoodDisplay }} 元</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-base-content/60">本月剩余</span>
              <span class="text-lg font-semibold text-info">{{ remainingDays }} 天</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">预计总伙食费</span>
              <span class="text-xl font-bold text-accent">{{ totalFoodExpense }} 元</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 计算结果卡片 -->
      <div class="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-80">剩余可用</div>
              <div class="text-4xl font-bold mt-1">{{ countResult }}</div>
            </div>
            <span class="icon-[material-symbols--savings-rounded] text-6xl opacity-20"></span>
          </div>
          <div class="card-actions justify-end mt-3">
            <q-btn outline color="white" label="重置" class="flex-1" @click="onClear" />
            <q-btn outline color="white" label="复制" class="flex-1" @click="copyText(countText)" />
          </div>
        </div>
      </div>

      <!-- 添加扣除项 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--add-circle-rounded] text-xl"></span>
            添加扣除项
          </h3>

          <!-- 标签选择 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-medium">标签</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <div v-for="tag in presetTags" :key="tag"
                class="badge badge-lg cursor-pointer transition-all duration-200"
                :class="selectedTag === tag ? 'badge-primary' : 'badge-ghost'" @click="selectedTag = tag">
                {{ tag }}
              </div>
            </div>
          </div>

          <!-- 自定义标签 -->
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text font-medium">自定义标签</span>
            </label>
            <q-input v-model="customTag" placeholder="输入自定义标签（可选）" outlined dense class="bg-base-200 rounded-lg"
              clearable />
          </div>

          <!-- 金额输入 -->
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text font-medium">金额</span>
            </label>
            <q-input v-model="subtractInput" placeholder="请输入金额" type="number" outlined dense
              class="bg-base-200 rounded-lg" clearable @keyup.enter="onAddItem">
              <template v-slot:append>
                <q-btn color="primary" label="添加" @click="onAddItem" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- 编辑数据 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--edit-rounded] text-xl"></span>
            编辑数据
          </h3>

          <!-- 余额输入 -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-medium">余额</span>
            </label>
            <q-input v-model="balance" placeholder="请输入余额" type="number" outlined dense class="bg-base-200 rounded-lg"
              clearable />
          </div>

          <!-- 每日伙食费 -->
          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text font-medium">每日伙食费</span>
              <span class="label-text-alt text-base-content/50">本月 {{ remainingDays }} 天</span>
            </label>
            <q-input v-model="dailyFoodCost" placeholder="请输入每日伙食费" type="number" outlined dense
              class="bg-base-200 rounded-lg" clearable />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar, LocalStorage } from "quasar";
import * as Api from "@/api/api";
import { useTheme } from "@/utils/theme";

const $q = useQuasar();
const currentTheme = useTheme();

// 数据
const balance = ref("");
const subtractItems = ref([]); // { tag, value }
const subtractInput = ref("");
const dailyFoodCost = ref("");
const selectedIndex = ref(-1);

// 标签
const presetTags = ["外卖", "购物", "话费", "交通", "娱乐", "其他"];
const selectedTag = ref("外卖");
const customTag = ref("");

// 预设标签颜色
const tagColors = {
  "外卖": "badge-warning",
  "购物": "badge-primary",
  "话费": "badge-info",
  "交通": "badge-secondary",
  "娱乐": "badge-accent",
  "其他": "badge-ghost"
};

function getTagColor(tag) {
  return tagColors[tag] || "badge-ghost";
}

// 计算本月剩余天数
const remainingDays = computed(() => {
  // 检查是否使用自定义日期
  const dateSettings = LocalStorage.getItem("date_settings");
  if (dateSettings && dateSettings.useCustomDate && dateSettings.startDate && dateSettings.endDate) {
    const start = new Date(dateSettings.startDate);
    const end = new Date(dateSettings.endDate);
    const today = new Date();

    // 如果今天不在日期范围内，返回 0
    if (today < start || today > end) {
      return 0;
    }

    // 计算从今天到结束日期的天数（包含今天）
    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return daysDiff;
  }

  // 默认使用本月剩余天数
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  return lastDay - currentDay + 1; // 包含今天
});

// 计算属性
const sumSubtract = computed(() => {
  return subtractItems.value.reduce((s, item) => s + (Number(item.value) || 0), 0);
});

const dailyFoodDisplay = computed(() => {
  const n = Number(dailyFoodCost.value);
  return Number.isFinite(n) ? n : 0;
});

const totalFoodExpense = computed(() => {
  return dailyFoodDisplay.value * remainingDays.value;
});

const balanceDisplay = computed(() => {
  if (balance.value === "" || balance.value === null) return 0;
  const n = Number(balance.value);
  return Number.isFinite(n) ? n : 0;
});

const countResult = computed(() => {
  if (balance.value === "" || balance.value === null) return "";
  const base = Number(balance.value) || 0;
  return base - sumSubtract.value - totalFoodExpense.value;
});

const countText = computed(() => {
  const base = Number(balance.value) || 0;
  const items = subtractItems.value.map(item => `${item.tag}:${item.value}`).join(", ");
  const food = totalFoodExpense.value;
  return `余额 ${base} - 扣除项(${items || "无"}) - 伙食费(${dailyFoodDisplay.value}×${remainingDays.value}=${food})`;
});

// 方法
function onAddItem() {
  if (!subtractInput.value) {
    $q.notify({ message: "请输入金额", color: "negative", position: "top", icon: "warning" });
    return;
  }
  const num = Number(subtractInput.value);
  if (!Number.isFinite(num)) {
    $q.notify({ message: "请输入有效数字", color: "negative", position: "top", icon: "warning" });
    return;
  }

  const tag = customTag.value.trim() || selectedTag.value;
  subtractItems.value.push({ tag, value: num });
  selectedIndex.value = subtractItems.value.length - 1;
  subtractInput.value = "";
  customTag.value = "";

  $q.notify({ message: "添加成功", color: "positive", position: "top", icon: "check" });
}

function selectItem(idx) {
  selectedIndex.value = idx;
}

function editItem(idx) {
  const item = subtractItems.value[idx];
  const editTag = ref(item.tag);
  const editValue = ref(item.value);

  $q.dialog({
    title: "编辑扣除项",
    message: `
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">金额</label>
          <input class="input input-bordered w-full" type="number" id="editValue" value="${item.value}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">标签</label>
          <div class="flex flex-wrap gap-2" id="tagSelector">
            ${presetTags.map(tag => `<div class="badge badge-lg cursor-pointer ${item.tag === tag ? 'badge-primary' : 'badge-ghost'}" data-tag="${tag}">${tag}</div>`).join('')}
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-error btn-outline flex-1" id="deleteBtn">删除</button>
        </div>
      </div>
    `,
    html: true,
    cancel: "取消",
    ok: "保存",
    persistent: true
  }).onOk((data) => {
    const valueInput = document.getElementById('editValue');
    const selectedTagEl = document.querySelector('#tagSelector .badge-primary');

    subtractItems.value[idx].tag = selectedTagEl ? selectedTagEl.dataset.tag : editTag.value;
    subtractItems.value[idx].value = Number(valueInput ? valueInput.value : data);
    $q.notify({ message: "修改成功", color: "positive", position: "top", icon: "check" });
  });

  // 添加标签选择事件
  setTimeout(() => {
    const tagSelector = document.getElementById('tagSelector');
    if (tagSelector) {
      tagSelector.addEventListener('click', (e) => {
        const badge = e.target.closest('.badge');
        if (badge && badge.dataset.tag) {
          tagSelector.querySelectorAll('.badge').forEach(b => {
            b.classList.remove('badge-primary');
            b.classList.add('badge-ghost');
          });
          badge.classList.remove('badge-ghost');
          badge.classList.add('badge-primary');
        }
      });
    }

    // 添加删除按钮事件
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        $q.dialog({
          title: "确认删除",
          message: `确定要删除「${subtractItems.value[idx].tag}: ${subtractItems.value[idx].value}」吗？`,
          ok: "删除",
          cancel: "取消",
          persistent: true
        }).onOk(() => {
          subtractItems.value.splice(idx, 1);
          if (selectedIndex.value === idx) {
            selectedIndex.value = Math.min(idx, subtractItems.value.length - 1);
            if (subtractItems.value.length === 0) selectedIndex.value = -1;
          } else if (selectedIndex.value > idx) {
            selectedIndex.value -= 1;
          }
          $q.notify({ message: "删除成功", color: "positive", position: "top", icon: "check" });
        });
      });
    }
  }, 100);
}

function removeItem(idx) {
  $q.dialog({
    title: "确认删除",
    message: `确定要删除「${subtractItems.value[idx].tag}: ${subtractItems.value[idx].value}」吗？`,
    ok: "删除",
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    subtractItems.value.splice(idx, 1);
    if (selectedIndex.value === idx) {
      selectedIndex.value = Math.min(idx, subtractItems.value.length - 1);
      if (subtractItems.value.length === 0) selectedIndex.value = -1;
    } else if (selectedIndex.value > idx) {
      selectedIndex.value -= 1;
    }
  });
}

function onClear() {
  $q.dialog({
    title: "提示",
    message: "是否重置所有数据？",
    ok: "确认",
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    balance.value = "";
    subtractItems.value = [];
    subtractInput.value = "";
    dailyFoodCost.value = "";
    selectedIndex.value = -1;
    LocalStorage.remove("accounting_data");
    $q.notify({ message: "已重置", color: "positive", position: "top", icon: "check" });
  });
}

function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  $q.notify({ message: "复制成功", color: "positive", position: "top", icon: "check" });
}

// 数据持久化
watch([balance, subtractItems, dailyFoodCost], () => {
  try {
    Api.tool.updataToolData({ countText: countText.value, countResult: countResult.value });
    LocalStorage.set("accounting_data", {
      balance: balance.value,
      subtractItems: subtractItems.value,
      dailyFoodCost: dailyFoodCost.value,
      countText: countText.value,
      countResult: countResult.value,
      timestamp: new Date().getTime()
    });
  } catch (e) { }
}, { deep: true });

onMounted(() => {
  const cached = LocalStorage.getItem("accounting_data");
  if (cached) {
    balance.value = cached.balance ?? "";
    subtractItems.value = Array.isArray(cached.subtractItems) ? cached.subtractItems : [];
    dailyFoodCost.value = cached.dailyFoodCost ?? "";
    selectedIndex.value = subtractItems.value.length ? 0 : -1;
  }
});
</script>
