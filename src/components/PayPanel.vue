<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { people, doneData } from "../data";
import { fmtDate, tagClass } from "../utils";
import type { DoneRecord, FilterTrigger } from "../types";

const props = defineProps<{
  initFilter?: FilterTrigger;
}>();

const execFilter = ref("全選");
const filterLabel = ref<string | null>(null);
const rows = ref<DoneRecord[]>([...doneData]);
const rowsVisible = ref(false);

const total = computed(() => rows.value.reduce((a, r) => a + r.pay, 0));

function applyFilter() {
  const ex = execFilter.value;
  rows.value =
    ex === "全選" ? [...doneData] : doneData.filter((r) => r.exec === ex);
  filterLabel.value = ex === "全選" ? null : "執行人員：" + ex;
  rowsVisible.value = false;
  setTimeout(() => {
    rowsVisible.value = true;
  }, 60);
}

function clear() {
  execFilter.value = "全選";
  rows.value = [...doneData];
  filterLabel.value = null;
  rowsVisible.value = false;
  setTimeout(() => {
    rowsVisible.value = true;
  }, 60);
}

watch(
  () => props.initFilter,
  (v) => {
    if (!v || !v.person) return;
    execFilter.value = v.person;
    applyFilter();
  },
);

onMounted(() => {
  setTimeout(() => {
    rowsVisible.value = true;
  }, 100);
});
</script>

<template>
  <div class="panel">
    <!-- Toolbar -->
    <div class="toolbar lg">
      <label class="fl">查詢區間</label>
      <input type="date" value="2026-04-18" class="fi" />
      <span class="sep">～</span>
      <input type="date" value="2026-04-24" class="fi" />
      <label class="fl">執行人員</label>
      <select v-model="execFilter" class="fs">
        <option v-for="o in ['全選', ...people]" :key="o">{{ o }}</option>
      </select>
      <button class="btn btn-search" @click="applyFilter">🔍 查詢</button>
      <button class="btn btn-export">↓ 匯出EXCEL</button>
    </div>

    <!-- Filter badge -->
    <div v-if="filterLabel" class="filter-hdr lg">
      <button class="btn btn-back" @click="clear">← 返回全部</button>
      <span class="filter-lbl">顯示：{{ filterLabel }} 的酬勞明細</span>
      <span class="filter-count">共 {{ rows.length }} 筆</span>
    </div>

    <!-- Pay summary card -->
    <div class="pay-sum lg">
      <div class="spec-hl" />
      <div class="ps-label">合計酬勞（元）</div>
      <div class="ps-val">{{ total.toLocaleString() }}</div>
      <div class="ps-bar">
        <div
          class="ps-bar-fill"
          :style="{ width: Math.min(total / 20, 100) + '%' }"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap lg">
      <table style="min-width: 880px">
        <thead>
          <tr>
            <th style="width: 42px">No.</th>
            <th style="width: 82px">執行人員</th>
            <th style="width: 100px">派單日期</th>
            <th style="width: 155px">系統編號</th>
            <th style="width: 82px">型態</th>
            <th style="width: 90px">起始地機構</th>
            <th style="width: 90px">完成地機構</th>
            <th>派遣內容</th>
            <th style="width: 62px">酬勞</th>
            <th style="width: 115px">酬勞調整說明</th>
            <th style="width: 115px">功能</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rows.length">
            <tr
              v-for="(r, i) in rows"
              :key="r.sysno"
              class="data-row"
              :class="{ 'row-visible': rowsVisible }"
              :style="{ '--ri': i }"
            >
              <td class="no-cell">{{ i + 1 }}</td>
              <td class="name-cell">{{ r.exec }}</td>
              <td>{{ fmtDate(r.date) }}</td>
              <td class="sysno-cell">{{ r.sysno }}</td>
              <td>
                <span class="tag" :class="tagClass(r.type)">{{ r.type }}</span>
              </td>
              <td class="sm-cell">{{ r.from }}</td>
              <td class="sm-cell">{{ r.to }}</td>
              <td class="content-cell">{{ r.content }}</td>
              <td class="pay-cell">{{ r.pay }}</td>
              <td class="muted">-</td>
              <td><button class="func-btn">歷程/編輯/記錄單</button></td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="11" class="empty-cell">無符合條件的資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.panel {
  animation: panel-in 0.32s ease both;
}
@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.fl {
  font-size: 12px;
  color: #7a9ab8;
  white-space: nowrap;
}
.sep {
  color: #4a7090;
  font-size: 13px;
}

.filter-hdr {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 9px 14px;
}
.filter-lbl {
  font-size: 13px;
  color: #00d4ff;
  font-weight: 600;
}
.filter-count {
  font-size: 11px;
  color: #3a6080;
  margin-left: auto;
}

/* Pay summary */
.pay-sum {
  display: inline-flex;
  flex-direction: column;
  padding: 14px 22px;
  margin-bottom: 16px;
  min-width: 200px;
  cursor: default;
}
.ps-label {
  font-size: 11px;
  color: #2a5040;
  margin-bottom: 6px;
}
.ps-val {
  font-size: 28px;
  font-weight: 800;
  color: #00e87a;
  text-shadow: 0 0 20px rgba(0, 232, 122, 0.55);
  font-variant-numeric: tabular-nums;
}
.ps-bar {
  margin-top: 8px;
  height: 3px;
  background: rgba(0, 232, 122, 0.1);
  border-radius: 2px;
  overflow: hidden;
}
.ps-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #00e87a, #00b85a);
  box-shadow: 0 0 8px rgba(0, 232, 122, 0.5);
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.table-wrap {
  overflow-x: auto;
}

.data-row {
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity 0.38s ease,
    transform 0.38s ease,
    background 0.18s,
    box-shadow 0.18s;
  transition-delay: calc(var(--ri) * 45ms);
}
.data-row.row-visible {
  opacity: 1;
  transform: translateX(0);
}
.data-row:hover {
  background: rgba(0, 232, 122, 0.03) !important;
  box-shadow: inset 3px 0 0 rgba(0, 232, 122, 0.3);
}
</style>
