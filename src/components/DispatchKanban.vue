<script setup lang="ts">
import { ref, computed } from "vue";

interface Card {
  id: string;
  sysno: string;
  exec: string;
  content: string;
  from: string;
  to: string;
  priority: "high" | "medium" | "low";
  time: string;
}

const columns = [
  {
    key: "pending",
    label: "待派單",
    color: "#ffab00",
    glow: "rgba(255,171,0,.35)",
  },
  {
    key: "dispatched",
    label: "已派單",
    color: "#00d4ff",
    glow: "rgba(0,212,255,.35)",
  },
  {
    key: "executing",
    label: "執行中",
    color: "#a855f7",
    glow: "rgba(168,85,247,.35)",
  },
  {
    key: "done",
    label: "已完成",
    color: "#00e87a",
    glow: "rgba(0,232,122,.35)",
  },
];

const priorityLabel: Record<Card["priority"], string> = {
  high: "緊急",
  medium: "一般",
  low: "低",
};
const priorityColor: Record<Card["priority"], string> = {
  high: "#ff4757",
  medium: "#00d4ff",
  low: "#5a8ab0",
};

const cards = ref<Record<string, Card[]>>({
  pending: [
    {
      id: "p1",
      sysno: "SYS-2026-0045",
      exec: "daniel",
      content: "藥品配送",
      from: "台中榮總",
      to: "童綜合",
      priority: "high",
      time: "09:15",
    },
    {
      id: "p2",
      sysno: "SYS-2026-0046",
      exec: "張義旻",
      content: "文件配送",
      from: "光田醫院",
      to: "澄清醫院",
      priority: "medium",
      time: "09:30",
    },
    {
      id: "p3",
      sysno: "SYS-2026-0047",
      exec: "",
      content: "病人轉送",
      from: "仁愛醫院",
      to: "中國醫藥",
      priority: "high",
      time: "09:45",
    },
    {
      id: "p4",
      sysno: "SYS-2026-0048",
      exec: "",
      content: "檢體運送",
      from: "台中榮總",
      to: "光田醫院",
      priority: "low",
      time: "10:00",
    },
  ],
  dispatched: [
    {
      id: "d1",
      sysno: "SYS-2026-0040",
      exec: "陳明瑋",
      content: "設備運送",
      from: "澄清醫院",
      to: "台中榮總",
      priority: "medium",
      time: "08:30",
    },
    {
      id: "d2",
      sysno: "SYS-2026-0041",
      exec: "黃馨儀",
      content: "緊急轉診",
      from: "童綜合",
      to: "台中榮總",
      priority: "high",
      time: "08:45",
    },
    {
      id: "d3",
      sysno: "SYS-2026-0042",
      exec: "劉金維",
      content: "藥品配送",
      from: "中國醫藥",
      to: "仁愛醫院",
      priority: "low",
      time: "09:00",
    },
  ],
  executing: [
    {
      id: "e1",
      sysno: "SYS-2026-0035",
      exec: "劉俊翔",
      content: "病人轉送",
      from: "光田醫院",
      to: "台中榮總",
      priority: "high",
      time: "07:50",
    },
    {
      id: "e2",
      sysno: "SYS-2026-0036",
      exec: "daniel",
      content: "文件配送",
      from: "仁愛醫院",
      to: "澄清醫院",
      priority: "medium",
      time: "08:00",
    },
    {
      id: "e3",
      sysno: "SYS-2026-0037",
      exec: "張義旻",
      content: "檢體運送",
      from: "童綜合",
      to: "中國醫藥",
      priority: "medium",
      time: "08:10",
    },
    {
      id: "e4",
      sysno: "SYS-2026-0038",
      exec: "陳明瑋",
      content: "藥品配送",
      from: "台中榮總",
      to: "光田醫院",
      priority: "low",
      time: "08:20",
    },
  ],
  done: [
    {
      id: "f1",
      sysno: "SYS-2026-0030",
      exec: "黃馨儀",
      content: "設備運送",
      from: "澄清醫院",
      to: "仁愛醫院",
      priority: "medium",
      time: "07:00",
    },
    {
      id: "f2",
      sysno: "SYS-2026-0031",
      exec: "劉金維",
      content: "藥品配送",
      from: "中國醫藥",
      to: "台中榮總",
      priority: "low",
      time: "07:15",
    },
    {
      id: "f3",
      sysno: "SYS-2026-0032",
      exec: "劉俊翔",
      content: "病人轉送",
      from: "台中榮總",
      to: "童綜合",
      priority: "high",
      time: "07:30",
    },
    {
      id: "f4",
      sysno: "SYS-2026-0033",
      exec: "daniel",
      content: "緊急轉診",
      from: "光田醫院",
      to: "澄清醫院",
      priority: "high",
      time: "07:40",
    },
    {
      id: "f5",
      sysno: "SYS-2026-0034",
      exec: "張義旻",
      content: "文件配送",
      from: "仁愛醫院",
      to: "中國醫藥",
      priority: "low",
      time: "07:45",
    },
  ],
});

const totals = computed(() =>
  Object.fromEntries(columns.map((c) => [c.key, cards.value[c.key].length])),
);

// Drag state
const dragging = ref<{ card: Card; from: string } | null>(null);

function onDragStart(card: Card, col: string) {
  dragging.value = { card, from: col };
}
function onDrop(toCol: string) {
  if (!dragging.value) return;
  const { card, from } = dragging.value;
  if (from === toCol) {
    dragging.value = null;
    return;
  }
  cards.value[from] = cards.value[from].filter((c) => c.id !== card.id);
  cards.value[toCol] = [card, ...cards.value[toCol]];
  dragging.value = null;
}
function onDragOver(e: DragEvent) {
  e.preventDefault();
}

const dragOver = ref("");
</script>

<template>
  <div class="kb-wrap">
    <!-- Header stats -->
    <div class="kb-header">
      <div
        v-for="col in columns"
        :key="col.key"
        class="kb-stat lg"
        :style="{ '--gc': col.glow }"
      >
        <div class="ks-count" :style="{ color: col.color }">
          {{ totals[col.key] }}
        </div>
        <div class="ks-label">{{ col.label }}</div>
        <div class="ks-bar" :style="{ background: col.color }" />
      </div>
    </div>

    <!-- Kanban board -->
    <div class="kb-board">
      <div
        v-for="col in columns"
        :key="col.key"
        class="kb-col lg"
        :class="{ 'drag-over': dragOver === col.key }"
        :style="{ '--cc': col.color }"
        @dragover="onDragOver"
        @dragenter="dragOver = col.key"
        @dragleave="dragOver = ''"
        @drop="
          onDrop(col.key);
          dragOver = '';
        "
      >
        <!-- Column header -->
        <div class="kc-head">
          <span
            class="kc-dot"
            :style="{
              background: col.color,
              boxShadow: `0 0 8px ${col.color}`,
            }"
          />
          <span class="kc-title" :style="{ color: col.color }">{{
            col.label
          }}</span>
          <span class="kc-badge">{{ totals[col.key] }}</span>
        </div>

        <!-- Cards -->
        <div class="kc-cards">
          <div
            v-for="card in cards[col.key]"
            :key="card.id"
            class="kc-card"
            draggable="true"
            @dragstart="onDragStart(card, col.key)"
          >
            <div class="card-top">
              <span class="card-sysno">{{ card.sysno }}</span>
              <span
                class="card-pri"
                :style="{
                  background: priorityColor[card.priority] + '22',
                  color: priorityColor[card.priority],
                }"
              >
                {{ priorityLabel[card.priority] }}
              </span>
            </div>
            <div class="card-content">{{ card.content }}</div>
            <div class="card-route">
              <span class="cr-from">{{ card.from }}</span>
              <span class="cr-arrow">→</span>
              <span class="cr-to">{{ card.to }}</span>
            </div>
            <div class="card-foot">
              <span class="card-exec" :class="{ unassigned: !card.exec }">
                {{ card.exec || "未指派" }}
              </span>
              <span class="card-time">{{ card.time }}</span>
            </div>
            <div class="card-drag-hint">⠿</div>
          </div>

          <!-- Empty state -->
          <div v-if="cards[col.key].length === 0" class="kc-empty">
            拖曳任務卡至此
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb-wrap {
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

/* ── Header stats ─────────────────────────────────────────── */
.kb-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.kb-stat {
  padding: 14px 18px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 24px var(--gc, rgba(0, 212, 255, 0.2));
}
.ks-count {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.ks-label {
  font-size: 12px;
  color: #8ab0d0;
  margin-top: 4px;
}
.ks-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  opacity: 0.5;
}

/* ── Board ────────────────────────────────────────────────── */
.kb-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  align-items: start;
}

.kb-col {
  min-height: 320px;
  padding: 0;
  overflow: hidden;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.kb-col.drag-over {
  box-shadow:
    0 0 0 2px var(--cc),
    0 0 20px rgba(0, 212, 255, 0.15);
}

/* Column header */
.kc-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.kc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.kc-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
  flex: 1;
}
.kc-badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  color: #8ab0d0;
}

/* Cards list */
.kc-cards {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: 240px;
}

/* Single card */
.kc-card {
  background: rgba(8, 20, 45, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 11px 12px;
  cursor: grab;
  position: relative;
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    border-color 0.15s;
}
.kc-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 212, 255, 0.22);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(0, 212, 255, 0.1);
}
.kc-card:active {
  cursor: grabbing;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.card-sysno {
  font-size: 10px;
  color: #5a8ab0;
  font-family: monospace;
  letter-spacing: 0.5px;
}
.card-pri {
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.card-content {
  font-size: 13px;
  font-weight: 600;
  color: #d8eaff;
  margin-bottom: 7px;
}
.card-route {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #7a9ab8;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.cr-from,
.cr-to {
  color: #a8c8e8;
}
.cr-arrow {
  color: #4a6880;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-exec {
  font-size: 11px;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  padding: 1px 8px;
  border-radius: 8px;
}
.card-exec.unassigned {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}
.card-time {
  font-size: 10px;
  color: #5a7898;
  font-family: monospace;
}
.card-drag-hint {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  pointer-events: none;
}

/* Empty state */
.kc-empty {
  text-align: center;
  font-size: 12px;
  color: #3a5878;
  padding: 30px 0;
  border: 1px dashed rgba(255, 255, 255, 0.07);
  border-radius: 8px;
}

/* ── RWD ──────────────────────────────────────────────── */
@media (max-width: 900px) {
  .kb-header {
    grid-template-columns: repeat(2, 1fr);
  }
  .kb-board {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 540px) {
  .kb-header {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .kb-board {
    grid-template-columns: 1fr;
  }
  .ks-count {
    font-size: 24px;
  }
  .kc-card {
    padding: 9px 10px;
  }
}
</style>
