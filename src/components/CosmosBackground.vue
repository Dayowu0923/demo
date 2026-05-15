<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let animId = 0;

const PALETTE: [number, number, number][] = [
  [0, 212, 255],
  [124, 58, 237],
  [0, 232, 122],
  [200, 210, 255],
];

type Pt = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  col: [number, number, number];
  tw: number;
};

let W = 0,
  H = 0,
  pts: Pt[] = [];

function resize() {
  if (!canvas.value) return;
  W = canvas.value.width = window.innerWidth;
  H = canvas.value.height = window.innerHeight;
}

function init() {
  pts = Array.from({ length: 90 }, () => {
    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.55 + 0.18,
      col,
      tw: Math.random() * Math.PI * 2,
    };
  });
}

function tick() {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  const t = performance.now() / 1000;

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 140) * 0.055})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
  }

  pts.forEach((p) => {
    const a = p.alpha * (0.55 + 0.45 * Math.sin(t * 1.4 + p.tw));
    const [r, g, b] = p.col;
    const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
    g2.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;
  });

  animId = requestAnimationFrame(tick);
}

function handleResize() {
  resize();
  init();
}

onMounted(() => {
  resize();
  init();
  tick();
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="cosmos-root">
    <div class="deep-space" />
    <div class="nebula n1" />
    <div class="nebula n2" />
    <div class="nebula n3" />
    <div class="grid-3d" />
    <canvas ref="canvas" class="p-canvas" />
    <div class="orb o1" />
    <div class="orb o2" />
    <div class="orb o3" />
    <div class="ray r1" />
    <div class="ray r2" />
    <div class="ray r3" />
  </div>
</template>

<style scoped>
.cosmos-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.deep-space {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 18% 12%, #091a38 0%, transparent 48%),
    radial-gradient(ellipse at 82% 88%, #0e0622 0%, transparent 48%),
    radial-gradient(ellipse at 50% 50%, #040a18 0%, #020408 100%);
}
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  mix-blend-mode: screen;
}
.n1 {
  width: 720px;
  height: 720px;
  background: radial-gradient(
    circle,
    rgba(0, 50, 110, 0.65) 0%,
    transparent 70%
  );
  top: -240px;
  left: -160px;
  animation: ndrift 32s ease-in-out infinite;
}
.n2 {
  width: 520px;
  height: 520px;
  background: radial-gradient(
    circle,
    rgba(65, 10, 130, 0.58) 0%,
    transparent 70%
  );
  top: 32%;
  right: -200px;
  animation: ndrift 26s ease-in-out infinite reverse;
  animation-delay: -10s;
}
.n3 {
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(0, 55, 58, 0.5) 0%, transparent 70%);
  bottom: 8%;
  left: 34%;
  animation: ndrift 38s ease-in-out infinite;
  animation-delay: -20s;
}
@keyframes ndrift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(32px, -20px) scale(1.06);
  }
  50% {
    transform: translate(-18px, 36px) scale(0.94);
  }
  75% {
    transform: translate(22px, 14px) scale(1.03);
  }
}
.grid-3d {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.028) 1px, transparent 1px);
  background-size: 52px 52px;
  transform: perspective(480px) rotateX(10deg);
  transform-origin: center top;
  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.6) 25%,
    rgba(0, 0, 0, 0.6) 75%,
    transparent 100%
  );
  animation: grid-pulse 8s ease-in-out infinite;
}
@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
.p-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(55px);
  animation: ofl 22s ease-in-out infinite;
}
.o1 {
  width: 280px;
  height: 280px;
  background: radial-gradient(
    circle,
    rgba(0, 100, 190, 0.38) 0%,
    transparent 70%
  );
  top: 8%;
  left: 6%;
  animation-duration: 19s;
}
.o2 {
  width: 240px;
  height: 240px;
  background: radial-gradient(
    circle,
    rgba(90, 20, 170, 0.36) 0%,
    transparent 70%
  );
  top: 55%;
  right: 6%;
  animation-duration: 25s;
  animation-delay: -9s;
}
.o3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(0, 80, 80, 0.32) 0%,
    transparent 70%
  );
  bottom: 14%;
  left: 44%;
  animation-duration: 30s;
  animation-delay: -16s;
}
@keyframes ofl {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(28px, -16px);
  }
  66% {
    transform: translate(-14px, 22px);
  }
}
.ray {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100vh;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 212, 255, 0.07) 45%,
    transparent 100%
  );
  transform-origin: top center;
  animation: rsweep 18s ease-in-out infinite;
}
.r1 {
  left: 22%;
}
.r2 {
  left: 58%;
  animation-delay: -6s;
  opacity: 0.55;
}
.r3 {
  left: 80%;
  animation-delay: -12s;
  opacity: 0.35;
}
@keyframes rsweep {
  0%,
  100% {
    transform: scaleX(1) skewX(0deg);
    opacity: 0.28;
  }
  50% {
    transform: scaleX(4) skewX(1.5deg);
    opacity: 0.75;
  }
}
</style>
