<script setup lang="ts">
import { ref, computed } from "vue";
import CosmosBackground from "./components/CosmosBackground.vue";
import NavBar from "./components/NavBar.vue";
import AppFooter from "./components/AppFooter.vue";
import SummaryPanel from "./components/SummaryPanel.vue";
import DonePanel from "./components/DonePanel.vue";
import UndonePanel from "./components/UndonePanel.vue";
import PayPanel from "./components/PayPanel.vue";
import DispatchKanban from "./components/DispatchKanban.vue";
import SystemSettings from "./components/SystemSettings.vue";
import type { FilterTrigger } from "./types";

// Top-level page (controlled by navbar)
const activePage = ref("stats"); // stats = 統計報表 (contains the 4 tabs)

const pageInfo = computed(() => {
  const map: Record<string, { bcParts: string[] }> = {
    kanban: { bcParts: ["首頁", "派單進度看板"] },
    dispatch: { bcParts: ["首頁", "派單管理"] },
    stats: { bcParts: ["首頁", "統計報表", "任務查詢總表"] },
    settings: { bcParts: ["首頁", "系統設定"] },
  };
  return map[activePage.value] ?? map["stats"];
});

// Sub-tabs for the 統計報表 page
const activeTab = ref("summary");
const tabDefs = [
  { key: "summary", label: "任務總表" },
  { key: "done", label: "完成任務表" },
  { key: "undone", label: "未完成任務表" },
  { key: "pay", label: "酬勞表" },
];

const doneInit = ref<FilterTrigger>({ person: "", ver: 0 });
const undoneInit = ref<FilterTrigger>({ person: "", ver: 0 });
const payInit = ref<FilterTrigger>({ person: "", ver: 0 });

function goToDone(name: string) {
  doneInit.value = { person: name, ver: doneInit.value.ver + 1 };
  activeTab.value = "done";
}
function goToUndone(name: string) {
  undoneInit.value = { person: name, ver: undoneInit.value.ver + 1 };
  activeTab.value = "undone";
}
function goToPay(name: string) {
  payInit.value = { person: name, ver: payInit.value.ver + 1 };
  activeTab.value = "pay";
}
function viewAllDone() {
  doneInit.value = { person: "", ver: 0 };
  activeTab.value = "done";
}
function viewAllUndone() {
  undoneInit.value = { person: "", ver: 0 };
  activeTab.value = "undone";
}
function viewAllPay() {
  payInit.value = { person: "", ver: 0 };
  activeTab.value = "pay";
}
</script>

<template>
  <!-- Fixed animated background -->
  <CosmosBackground />

  <div class="app-shell">
    <!-- Navigation -->
    <NavBar :active-page="activePage" @navigate="activePage = $event" />

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <template v-for="(p, i) in pageInfo.bcParts" :key="i">
        <span v-if="i < pageInfo.bcParts.length - 1">{{ p }} / </span>
        <span v-else class="bc-accent">{{ p }}</span>
      </template>
    </div>

    <!-- Main content -->
    <div class="container">
      <!-- 派單進度看板 -->
      <div v-if="activePage === 'kanban'">
        <DispatchKanban />
      </div>

      <!-- 派單管理 (placeholder) -->
      <div v-else-if="activePage === 'dispatch'" class="placeholder-page">
        <div class="ph-icon">&#128196;</div>
        <div class="ph-title">派單管理</div>
        <div class="ph-desc">功能開發中，敬請期待</div>
      </div>

      <!-- 統計報表 (has sub-tabs) -->
      <div v-else-if="activePage === 'stats'">
        <!-- Tab bar -->
        <div class="tabs-bar">
          <button
            v-for="tab in tabDefs"
            :key="tab.key"
            class="tab-btn"
            :class="{ 'tab-active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span v-if="activeTab === tab.key" class="tab-indicator" />
          </button>
        </div>

        <div v-show="activeTab === 'summary'">
          <SummaryPanel
            @go-done="goToDone"
            @go-undone="goToUndone"
            @go-pay="goToPay"
            @view-all-done="viewAllDone"
            @view-all-undone="viewAllUndone"
            @view-all-pay="viewAllPay"
          />
        </div>
        <div v-show="activeTab === 'done'">
          <DonePanel :init-filter="doneInit" />
        </div>
        <div v-show="activeTab === 'undone'">
          <UndonePanel :init-filter="undoneInit" />
        </div>
        <div v-show="activeTab === 'pay'">
          <PayPanel :init-filter="payInit" />
        </div>
      </div>

      <!-- 系統設定 -->
      <div v-else-if="activePage === 'settings'">
        <SystemSettings />
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
/* ── App shell ─────────────────────────────────────────────── */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* ── Breadcrumb ──────────────────────────────────────────────── */
.breadcrumb {
  padding: 7px 24px;
  font-size: 12px;
  color: #a8c8e8;
  background: rgba(3, 7, 16, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.05);
  letter-spacing: 0.3px;
}
.bc-accent {
  color: #00d4ff;
  font-weight: 600;
}

/* ── Container ───────────────────────────────────────────────── */
.container {
  flex: 1;
  padding: 18px 24px;
  max-width: 1480px;
  margin: 0 auto;
  width: 100%;
}

/* ── Tab bar ──────────────────────────────────────────────────── */
.tabs-bar {
  display: flex;
  gap: 3px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.12);
  padding-bottom: 0;
}

.tab-btn {
  position: relative;
  overflow: hidden;
  padding: 9px 22px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  color: #90b8d8;
  letter-spacing: 0.35px;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 7px 7px 0 0;
  background: transparent;
  transition: all 0.22s;
}
.tab-btn:not(.tab-active):hover {
  background: rgba(0, 212, 255, 0.05);
  color: #6a8fb0;
  border-color: rgba(0, 212, 255, 0.08);
}

.tab-active {
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.12) 0%,
    rgba(0, 212, 255, 0.04) 100%
  );
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.2);
  text-shadow: 0 0 14px rgba(0, 212, 255, 0.55);
  box-shadow:
    0 -1px 18px rgba(0, 212, 255, 0.1),
    inset 0 1px 0 rgba(0, 212, 255, 0.14);
}

/* Glowing indicator bar */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  animation: tab-glow 2s ease-in-out infinite;
}
@keyframes tab-glow {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 10px 10px;
  }
  .tab-btn {
    padding: 7px 12px;
    font-size: 12px;
  }
}

/* bc-accent for breadcrumb last segment */
.bc-accent {
  color: #00d4ff;
  font-weight: 600;
}

/* Placeholder page */
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 340px;
  gap: 14px;
}
.ph-icon {
  font-size: 52px;
  opacity: 0.35;
}
.ph-title {
  font-size: 20px;
  font-weight: 700;
  color: #5a8ab0;
}
.ph-desc {
  font-size: 13px;
  color: #3a5878;
}
</style>
