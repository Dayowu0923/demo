<script setup lang="ts">
// Static footer
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">天眼衛星科技股份有限公司</div>
      <div class="footer-info">
        414 臺中市烏日區高鐵一路268號22樓之二　
        電話：04-24513012　傳真：04-24513018
      </div>
      <div class="footer-copy">
        ©2024 SkyEyes GPS Technology Co., Ltd. All Rights Reserved.
      </div>
    </div>
    <div class="footer-glow" />
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  text-align: center;
  padding: 16px 24px;
  font-size: 11px;
  color: #5a8ab0;
  border-top: 1px solid rgba(0, 212, 255, 0.06);
  background: rgba(2, 4, 10, 0.88);
  backdrop-filter: blur(20px);
  overflow: hidden;
}
.footer-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.footer-brand {
  color: #7aaac8;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
}
.footer-info {
  color: #5a80a0;
}
.footer-copy {
  color: #4a7090;
}
.footer-glow {
  position: absolute;
  top: 0;
  left: 25%;
  right: 25%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 212, 255, 0.2),
    transparent
  );
  animation: ftglow 5s ease-in-out infinite;
}
@keyframes ftglow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
