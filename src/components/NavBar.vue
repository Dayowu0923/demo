<script setup lang="ts">
const props = defineProps<{ activePage?: string }>();
const emit = defineEmits<{ (e: "navigate", page: string): void }>();
</script>

<template>
  <nav class="navbar">
    <!-- Left brand -->
    <div class="brand">
      <div class="brand-gem">
        <div class="gem-inner" />
        <div class="gem-ring" />
      </div>
      <span class="brand-name">天眼 <em>i</em> 助理</span>
    </div>

    <!-- Center nav links -->
    <div class="nav-links">
      <span
        class="nl"
        :class="{ 'nl-active': props.activePage === 'kanban' }"
        @click="emit('navigate', 'kanban')"
        >派單進度看板</span
      >
      <span
        class="nl"
        :class="{ 'nl-active': props.activePage === 'dispatch' }"
        @click="emit('navigate', 'dispatch')"
        >派單管理</span
      >
      <span
        class="nl"
        :class="{ 'nl-active': props.activePage === 'stats' }"
        @click="emit('navigate', 'stats')"
        >統計報表</span
      >
      <span
        class="nl"
        :class="{ 'nl-active': props.activePage === 'settings' }"
        @click="emit('navigate', 'settings')"
        >系統設定</span
      >
    </div>

    <!-- Right user area -->
    <div class="nav-right">
      <span class="nav-user">天眼衛星・客戶測試　您好</span>
      <button class="logout-btn">登出</button>
    </div>

    <!-- Animated glow line at bottom -->
    <div class="glow-line" />
  </nav>
</template>

<style scoped>
.navbar {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  gap: 20px;
  /* Liquid glass navbar */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.055) 0%,
    rgba(4, 10, 24, 0.88) 100%
  );
  backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 40px rgba(0, 212, 255, 0.04);
}

/* Specular top highlight – glass surface simulation */
.navbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 212, 255, 0.6) 35%,
    rgba(124, 58, 237, 0.5) 65%,
    transparent 100%
  );
  animation: glow-shift 6s ease-in-out infinite;
}
@keyframes glow-shift {
  0%,
  100% {
    opacity: 0.45;
    background-position: 0% 50%;
  }
  50% {
    opacity: 1;
    background-position: 100% 50%;
  }
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}
.brand-gem {
  position: relative;
  width: 28px;
  height: 28px;
}
.gem-inner {
  position: absolute;
  inset: 4px;
  border-radius: 6px;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  box-shadow:
    0 0 14px rgba(0, 212, 255, 0.75),
    0 0 30px rgba(124, 58, 237, 0.5);
  animation: gem-pulse 3s ease-in-out infinite;
}
.gem-ring {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.5);
  animation: ring-expand 3s ease-in-out infinite;
}
@keyframes gem-pulse {
  0%,
  100% {
    box-shadow:
      0 0 14px rgba(0, 212, 255, 0.75),
      0 0 28px rgba(124, 58, 237, 0.45);
  }
  50% {
    box-shadow:
      0 0 24px rgba(0, 212, 255, 1),
      0 0 50px rgba(124, 58, 237, 0.7);
  }
}
@keyframes ring-expand {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.25);
    opacity: 0;
  }
}
.brand-name {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}
.brand-name em {
  font-style: normal;
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Nav links */
.nav-links {
  display: flex;
  gap: 2px;
  margin-left: 8px;
}
.nl {
  color: rgba(180, 210, 248, 0.85);
  font-size: 12.5px;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.22s;
  letter-spacing: 0.4px;
  position: relative;
  white-space: nowrap;
}
.nl:hover {
  background: rgba(0, 212, 255, 0.07);
  color: #fff;
}
.nl-active {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.55);
  box-shadow:
    inset 0 0 16px rgba(0, 212, 255, 0.06),
    0 0 0 1px rgba(0, 212, 255, 0.15);
}
.nl-active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  border-radius: 1px;
}

/* Right */
.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.nav-user {
  color: rgba(180, 210, 248, 0.8);
  font-size: 12px;
  white-space: nowrap;
}
.logout-btn {
  font-size: 12px;
  padding: 5px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: rgba(180, 210, 240, 0.75);
  /* Neumorphism 2.0 dark */
  background: #0a1326;
  box-shadow:
    4px 4px 9px rgba(0, 0, 0, 0.6),
    -2px -2px 6px rgba(255, 255, 255, 0.025),
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px rgba(0, 212, 255, 0.1);
  transition: all 0.2s;
}
.logout-btn:hover {
  color: #00d4ff;
  box-shadow:
    4px 4px 9px rgba(0, 0, 0, 0.6),
    -2px -2px 6px rgba(255, 255, 255, 0.025),
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px rgba(0, 212, 255, 0.3),
    0 0 14px rgba(0, 212, 255, 0.12);
}
.logout-btn:active {
  box-shadow:
    inset 3px 3px 7px rgba(0, 0, 0, 0.7),
    inset -1px -1px 4px rgba(255, 255, 255, 0.018);
  transform: scale(0.96);
}
</style>
