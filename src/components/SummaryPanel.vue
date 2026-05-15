<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { people, doneData, undoneData } from "../data";
import { useTilt } from "../composables/useTilt";
import type { SummaryRow } from "../types";

const emit = defineEmits<{
  "go-done": [name: string];
  "go-undone": [name: string];
  "go-pay": [name: string];
  "view-all-done": [];
  "view-all-undone": [];
  "view-all-pay": [];
}>();

const sExec = ref("全選");

const summaryRows = computed<SummaryRow[]>(() => {
  const base = people.map((p) => ({
    name: p,
    done: doneData.filter((r) => r.exec === p).length,
    undone: undoneData.filter((r) => r.exec === p).length,
    pay: doneData.filter((r) => r.exec === p).reduce((a, r) => a + r.pay, 0),
    fee: 0,
  }));
  return sExec.value === "全選"
    ? base
    : base.filter((r) => r.name === sExec.value);
});

const stats = computed(() => {
  const d = summaryRows.value;
  const tot = d.reduce(
    (a, r) => ({
      done: a.done + r.done,
      undone: a.undone + r.undone,
      pay: a.pay + r.pay,
    }),
    { done: 0, undone: 0, pay: 0 },
  );
  return {
    count: d.length,
    done: tot.done,
    undone: tot.undone,
    all: tot.done + tot.undone,
    pay: tot.pay,
    err: undoneData.filter(
      (r) => r.type === "任務異常" && d.find((x) => x.name === r.exec),
    ).length,
  };
});

function reset() {
  sExec.value = "全選";
}

// Tilt refs for stat cards
const tilt0 = useTilt(5);
const tilt1 = useTilt(5);
const tilt2 = useTilt(5);
const tilt3 = useTilt(5);
const tilt4 = useTilt(5);
const tilt5 = useTilt(5);
const tilts = [tilt0, tilt1, tilt2, tilt3, tilt4, tilt5];

const statDefs = computed(() => [
  { label: "執行人員總數", val: stats.value.count, cls: "", suffix: "" },
  { label: "完成任務數(筆)", val: stats.value.done, cls: "green", suffix: "" },
  {
    label: "未完成任務數(筆)",
    val: stats.value.undone,
    cls: "amber",
    suffix: "",
  },
  { label: "總派任務數(筆)", val: stats.value.all, cls: "cyan", suffix: "" },
  { label: "應付酬勞總額(元)", val: stats.value.pay, cls: "", suffix: "" },
  { label: "異常任務數(筆)", val: stats.value.err, cls: "red", suffix: "" },
]);

// Animate rows on mount
const rowsVisible = ref(false);
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
      <select v-model="sExec" class="fs">
        <option v-for="o in ['全選', ...people]" :key="o">{{ o }}</option>
      </select>
      <button class="btn btn-clear" @click="reset">✕ 清除重填</button>
      <button class="btn btn-search">🔍 查詢</button>
      <button class="btn btn-export">↓ 匯出EXCEL</button>
    </div>

    <!-- Stat cards -->
    <div class="stats-grid">
      <div
        v-for="(s, i) in statDefs"
        :key="s.label"
        :ref="
          (el) => {
            if (el) tilts[i].elRef.value = el as HTMLElement;
          }
        "
        class="stat-card lg"
        :style="{ '--i': i }"
      >
        <!-- Dynamic specular highlight (moved by tilt) -->
        <div class="spec-hl" />
        <div class="sc-label">{{ s.label }}</div>
        <div class="sc-val" :class="s.cls">
          {{
            typeof s.val === "number" && s.val >= 1000
              ? s.val.toLocaleString()
              : s.val
          }}
        </div>
        <!-- Subtle liquid drip line -->
        <div class="drip" />
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap lg">
      <table style="min-width: 640px">
        <thead>
          <tr>
            <th style="width: 42px">No.</th>
            <th style="width: 90px">執行人員</th>
            <th>完成任務數(筆)</th>
            <th>未完成任務數(筆)</th>
            <th>總派任務數(筆)</th>
            <th>應付酬勞數(元)</th>
            <th>收取費用數(元)</th>
          </tr>
        </thead>
        <tbody>
          <!-- Total row -->
          <tr class="tr-total">
            <td colspan="2">合計</td>
            <td>
              <span class="lnk" @click="emit('view-all-done')">{{
                stats.done
              }}</span>
            </td>
            <td>
              <span class="lnk" @click="emit('view-all-undone')">{{
                stats.undone
              }}</span>
            </td>
            <td>{{ stats.all }}</td>
            <td>
              <span class="lnk" @click="emit('view-all-pay')">{{
                stats.pay.toLocaleString()
              }}</span>
            </td>
            <td class="muted">0</td>
          </tr>
          <!-- Data rows -->
          <tr
            v-for="(r, i) in summaryRows"
            :key="r.name"
            class="data-row"
            :class="{ 'row-visible': rowsVisible }"
            :style="{ '--ri': i }"
          >
            <td class="no-cell">{{ i + 1 }}</td>
            <td class="name-cell">{{ r.name }}</td>
            <td>
              <span
                v-if="r.done > 0"
                class="lnk"
                @click="emit('go-done', r.name)"
                >{{ r.done }}</span
              >
              <span v-else class="muted">0</span>
            </td>
            <td>
              <span
                v-if="r.undone > 0"
                class="lnk"
                @click="emit('go-undone', r.name)"
                >{{ r.undone }}</span
              >
              <span v-else class="muted">0</span>
            </td>
            <td :class="r.done + r.undone === 0 ? 'muted' : ''">
              {{ r.done + r.undone }}
            </td>
            <td>
              <span
                v-if="r.pay > 0"
                class="lnk"
                @click="emit('go-pay', r.name)"
                >{{ r.pay.toLocaleString() }}</span
              >
              <span v-else class="muted">0</span>
            </td>
            <td class="muted">0</td>
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

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 16px;
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

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.stat-card {
  padding: 16px 18px;
  cursor: default;
  will-change: transform;
  animation: card-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: calc(var(--i) * 70ms);
  /* strengthen liquid glass beyond global .lg */
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
    0 0 0 1px rgba(0, 212, 255, 0.08) !important;
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: perspective(700px) translateY(18px) rotateX(8deg);
  }
  to {
    opacity: 1;
    transform: perspective(700px) translateY(0) rotateX(0deg);
  }
}

/* Dynamic specular highlight (position set by useTilt JS) */
.spec-hl {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  transition: background 0.12s ease;
}

.sc-label {
  font-size: 11px;
  color: #5580a0;
  margin-bottom: 8px;
  letter-spacing: 0.4px;
  position: relative;
  z-index: 3;
}
.sc-val {
  font-size: 26px;
  font-weight: 800;
  color: #dce8f8;
  text-shadow: 0 0 8px rgba(220, 232, 248, 0.12);
  position: relative;
  z-index: 3;
  font-variant-numeric: tabular-nums;
}
.sc-val.cyan {
  color: #00d4ff;
  text-shadow: 0 0 18px rgba(0, 212, 255, 0.55);
}
.sc-val.green {
  color: #00e87a;
  text-shadow: 0 0 18px rgba(0, 232, 122, 0.55);
}
.sc-val.amber {
  color: #ffab00;
  text-shadow: 0 0 18px rgba(255, 171, 0, 0.55);
}
.sc-val.red {
  color: #ff4757;
  text-shadow: 0 0 18px rgba(255, 71, 87, 0.55);
}

/* Liquid "drip" detail at bottom of card */
.drip {
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 212, 255, 0.3),
    transparent
  );
  animation: drip-glow 4s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.6s);
}
@keyframes drip-glow {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleX(0.6);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.1);
  }
}

/* Table wrap */
.table-wrap {
  overflow-x: auto;
}

/* Staggered row entry */
.data-row {
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease,
    background 0.18s,
    box-shadow 0.18s;
  transition-delay: calc(var(--ri) * 55ms);
}
.data-row.row-visible {
  opacity: 1;
  transform: translateX(0);
}
.data-row:hover {
  background: rgba(0, 212, 255, 0.04) !important;
  box-shadow: inset 3px 0 0 rgba(0, 212, 255, 0.35);
}
</style>
