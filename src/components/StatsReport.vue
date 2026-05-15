<script setup lang="ts">
import { computed, ref } from "vue";

const period = ref<"week" | "month" | "quarter">("week");

// Mock chart data
const barData = computed(() => {
  const sets: Record<
    typeof period.value,
    { label: string; done: number; undone: number }[]
  > = {
    week: [
      { label: "週一", done: 8, undone: 2 },
      { label: "週二", done: 12, undone: 1 },
      { label: "週三", done: 9, undone: 3 },
      { label: "週四", done: 15, undone: 0 },
      { label: "週五", done: 11, undone: 2 },
      { label: "週六", done: 5, undone: 1 },
      { label: "週日", done: 3, undone: 0 },
    ],
    month: [
      { label: "第1週", done: 45, undone: 6 },
      { label: "第2週", done: 52, undone: 4 },
      { label: "第3週", done: 48, undone: 8 },
      { label: "第4週", done: 61, undone: 3 },
    ],
    quarter: [
      { label: "1月", done: 180, undone: 18 },
      { label: "2月", done: 162, undone: 22 },
      { label: "3月", done: 195, undone: 14 },
    ],
  };
  return sets[period.value];
});

const maxBar = computed(() =>
  Math.max(...barData.value.map((d) => d.done + d.undone)),
);

const pieData = [
  { label: "病人轉送", val: 28, color: "#00d4ff" },
  { label: "藥品配送", val: 22, color: "#a855f7" },
  { label: "文件配送", val: 18, color: "#00e87a" },
  { label: "設備運送", val: 14, color: "#ffab00" },
  { label: "緊急轉診", val: 11, color: "#ff6b6b" },
  { label: "檢體運送", val: 7, color: "#38bdf8" },
];
const pieTotal = pieData.reduce((a, d) => a + d.val, 0);
// Build SVG pie arcs
const pieArcs = computed(() => {
  let cumul = 0;
  return pieData.map((d) => {
    const start = (cumul / pieTotal) * 360;
    cumul += d.val;
    const end = (cumul / pieTotal) * 360;
    const r = 80;
    const cx = 100;
    const cy = 100;
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return {
      ...d,
      path: `M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`,
    };
  });
});

const personStats = [
  { name: "daniel", done: 5, undone: 2, rate: 71 },
  { name: "張義旻", done: 4, undone: 2, rate: 67 },
  { name: "陳明瑋", done: 3, undone: 1, rate: 75 },
  { name: "黃馨儀", done: 6, undone: 2, rate: 75 },
  { name: "劉金維", done: 2, undone: 1, rate: 67 },
  { name: "劉俊翔", done: 11, undone: 16, rate: 41 },
];

const kpiCards = [
  {
    label: "本週總任務",
    val: "63",
    unit: "筆",
    color: "#00d4ff",
    glow: "rgba(0,212,255,.3)",
  },
  {
    label: "完成率",
    val: "87",
    unit: "%",
    color: "#00e87a",
    glow: "rgba(0,232,122,.3)",
  },
  {
    label: "平均完成時間",
    val: "1.8",
    unit: "hr",
    color: "#a855f7",
    glow: "rgba(168,85,247,.3)",
  },
  {
    label: "異常任務",
    val: "3",
    unit: "筆",
    color: "#ff4757",
    glow: "rgba(255,71,87,.3)",
  },
];
</script>

<template>
  <div class="sr-wrap">
    <!-- KPI cards -->
    <div class="kpi-row">
      <div
        v-for="k in kpiCards"
        :key="k.label"
        class="kpi-card lg"
        :style="{ '--gc': k.glow }"
      >
        <div class="kpi-val" :style="{ color: k.color }">
          {{ k.val }}<span class="kpi-unit">{{ k.unit }}</span>
        </div>
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-glow-bar" :style="{ background: k.color }" />
      </div>
    </div>

    <div class="charts-row">
      <!-- Bar chart -->
      <div class="chart-box lg">
        <div class="cb-head">
          <span class="cb-title">任務完成趨勢</span>
          <div class="period-tabs">
            <button
              v-for="p in ['week', 'month', 'quarter'] as const"
              :key="p"
              class="pt-btn"
              :class="{ active: period === p }"
              @click="period = p"
            >
              {{ p === "week" ? "本週" : p === "month" ? "本月" : "本季" }}
            </button>
          </div>
        </div>
        <div class="bar-chart">
          <div v-for="d in barData" :key="d.label" class="bar-group">
            <div class="bars">
              <div
                class="bar bar-done"
                :style="{ height: (d.done / maxBar) * 160 + 'px' }"
                :title="`完成: ${d.done}`"
              />
              <div
                class="bar bar-undone"
                :style="{ height: (d.undone / maxBar) * 160 + 'px' }"
                :title="`未完成: ${d.undone}`"
              />
            </div>
            <div class="bar-label">{{ d.label }}</div>
          </div>
        </div>
        <div class="bar-legend">
          <span class="leg-item"
            ><i class="leg-dot" style="background: #00e87a" /> 完成</span
          >
          <span class="leg-item"
            ><i class="leg-dot" style="background: #ff4757" /> 未完成</span
          >
        </div>
      </div>

      <!-- Pie chart -->
      <div class="chart-box lg pie-box">
        <div class="cb-head">
          <span class="cb-title">任務類型分佈</span>
        </div>
        <div class="pie-layout">
          <svg viewBox="0 0 200 200" class="pie-svg">
            <path
              v-for="arc in pieArcs"
              :key="arc.label"
              :d="arc.path"
              :fill="arc.color"
              :fill-opacity="0.85"
              stroke="rgba(3,7,16,.6)"
              stroke-width="1.5"
            />
            <!-- Center hole -->
            <circle cx="100" cy="100" r="42" fill="rgba(5,12,30,.9)" />
            <text
              x="100"
              y="96"
              text-anchor="middle"
              fill="#a8c8e8"
              font-size="11"
            >
              總計
            </text>
            <text
              x="100"
              y="112"
              text-anchor="middle"
              fill="#00d4ff"
              font-size="18"
              font-weight="800"
            >
              {{ pieTotal }}
            </text>
          </svg>
          <div class="pie-legend">
            <div v-for="d in pieData" :key="d.label" class="pl-item">
              <i class="pl-dot" :style="{ background: d.color }" />
              <span class="pl-label">{{ d.label }}</span>
              <span class="pl-val" :style="{ color: d.color }">{{
                d.val
              }}</span>
              <span class="pl-pct"
                >{{ Math.round((d.val / pieTotal) * 100) }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Person performance table -->
    <div class="table-wrap lg">
      <div class="cb-head" style="padding: 14px 16px 0">
        <span class="cb-title">人員績效一覽</span>
      </div>
      <table style="min-width: 560px; margin-top: 8px">
        <thead>
          <tr>
            <th>執行人員</th>
            <th>完成(筆)</th>
            <th>未完成(筆)</th>
            <th>總計(筆)</th>
            <th style="min-width: 160px">完成率</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, i) in personStats"
            :key="p.name"
            class="data-row row-visible"
            :style="{ '--ri': i }"
          >
            <td class="name-cell">{{ p.name }}</td>
            <td>
              <span style="color: #00e87a; font-weight: 600">{{ p.done }}</span>
            </td>
            <td>
              <span style="color: #ff4757">{{ p.undone }}</span>
            </td>
            <td>{{ p.done + p.undone }}</td>
            <td>
              <div class="rate-bar-wrap">
                <div class="rate-bar-bg">
                  <div
                    class="rate-bar-fill"
                    :style="{
                      width: p.rate + '%',
                      background:
                        p.rate >= 70
                          ? '#00e87a'
                          : p.rate >= 50
                            ? '#ffab00'
                            : '#ff4757',
                    }"
                  />
                </div>
                <span
                  class="rate-pct"
                  :style="{
                    color:
                      p.rate >= 70
                        ? '#00e87a'
                        : p.rate >= 50
                          ? '#ffab00'
                          : '#ff4757',
                  }"
                  >{{ p.rate }}%</span
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.sr-wrap {
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

/* KPI row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.kpi-card {
  padding: 16px 20px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(52px) saturate(220%) brightness(1.14) !important;
  -webkit-backdrop-filter: blur(52px) saturate(220%) brightness(1.14) !important;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.03) 55%,
    rgba(0, 212, 255, 0.05) 100%
  ) !important;
  border-top-color: rgba(255, 255, 255, 0.28) !important;
  border-left-color: rgba(255, 255, 255, 0.16) !important;
  box-shadow:
    0 10px 44px rgba(0, 0, 0, 0.58),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.22),
    0 0 0 1px rgba(0, 212, 255, 0.08),
    0 4px 24px var(--gc, rgba(0, 212, 255, 0.2));
}
.kpi-val {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.kpi-unit {
  font-size: 14px;
  font-weight: 400;
  margin-left: 3px;
  opacity: 0.8;
}
.kpi-label {
  font-size: 12px;
  color: #8ab0d0;
  margin-top: 5px;
}
.kpi-glow-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  opacity: 0.6;
}

/* Charts row */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.chart-box {
  padding: 0;
  overflow: hidden;
}
.pie-box {
  overflow: visible;
}

.cb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.cb-title {
  font-size: 13px;
  font-weight: 600;
  color: #c8dff0;
  letter-spacing: 0.4px;
}

/* Period tabs */
.period-tabs {
  display: flex;
  gap: 4px;
}
.pt-btn {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 212, 255, 0.12);
  background: transparent;
  color: #5a8ab0;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}
.pt-btn.active,
.pt-btn:hover {
  background: rgba(0, 212, 255, 0.12);
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.3);
}

/* Bar chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 12px 16px 6px;
  height: 200px;
  overflow-x: auto;
}
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 28px;
}
.bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 160px;
}
.bar {
  width: 12px;
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bar-done {
  background: linear-gradient(180deg, #00e87a, #00a855);
}
.bar-undone {
  background: linear-gradient(180deg, #ff4757, #c0392b);
}
.bar-label {
  font-size: 10px;
  color: #5a7898;
  white-space: nowrap;
}

.bar-legend {
  display: flex;
  gap: 16px;
  padding: 6px 16px 12px;
}
.leg-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #7a9ab8;
}
.leg-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

/* Pie chart */
.pie-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
}
.pie-svg {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}
.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pl-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.pl-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pl-label {
  color: #a8c8e8;
  flex: 1;
}
.pl-val {
  font-weight: 700;
  min-width: 20px;
  text-align: right;
}
.pl-pct {
  color: #5a7898;
  min-width: 32px;
  text-align: right;
}

/* Rate bar */
.rate-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rate-bar-bg {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
.rate-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.rate-pct {
  font-size: 11px;
  font-weight: 600;
  min-width: 32px;
  text-align: right;
}

/* ── RWD ──────────────────────────────────────────────── */
@media (max-width: 900px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-row {
    grid-template-columns: 1fr;
  }
  .pie-layout {
    gap: 12px;
  }
}
@media (max-width: 540px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .kpi-val {
    font-size: 24px;
  }
  .pie-layout {
    flex-direction: column;
    align-items: center;
  }
  .pie-svg {
    width: 160px;
    height: 160px;
  }
  .bar-chart {
    padding: 8px 10px 4px;
  }
}
</style>
