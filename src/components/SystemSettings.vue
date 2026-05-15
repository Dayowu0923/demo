<script setup lang="ts">
import { ref } from "vue";

const activeSection = ref("account");
const saved = ref(false);

const sections = [
  { key: "account", label: "帳號管理", icon: "👤" },
  { key: "notify", label: "通知設定", icon: "🔔" },
  { key: "system", label: "系統參數", icon: "⚙️" },
  { key: "security", label: "安全設定", icon: "🔒" },
  { key: "about", label: "關於系統", icon: "ℹ️" },
];

// Account
const account = ref({
  name: "客戶測試",
  email: "test@skyeye-sat.com.tw",
  role: "管理員",
  dept: "運務部",
});

// Notify
const notify = ref({
  taskAssign: true,
  taskComplete: true,
  taskError: true,
  dailyReport: false,
  email: true,
  sms: false,
});

// System
const system = ref({
  autoLogout: "30",
  pageSize: "20",
  timezone: "Asia/Taipei",
  lang: "繁體中文",
});

// Security
const security = ref({
  twoFactor: false,
  ipLimit: true,
  logDays: "90",
  forceChangePwd: false,
});

function save() {
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 2400);
}
</script>

<template>
  <div class="sys-wrap">
    <div class="sys-layout">
      <!-- Sidebar -->
      <nav class="sys-nav lg">
        <div class="sn-title">設定項目</div>
        <button
          v-for="s in sections"
          :key="s.key"
          class="sn-item"
          :class="{ active: activeSection === s.key }"
          @click="activeSection = s.key"
        >
          <span class="sn-icon">{{ s.icon }}</span>
          <span class="sn-label">{{ s.label }}</span>
          <span v-if="activeSection === s.key" class="sn-bar" />
        </button>
      </nav>

      <!-- Content -->
      <div class="sys-content lg">
        <!-- Account -->
        <section v-if="activeSection === 'account'" class="sc-section">
          <h2 class="sc-head">帳號管理</h2>
          <div class="form-grid">
            <div class="fg-row">
              <label class="fg-label">顯示名稱</label>
              <input v-model="account.name" class="fi fg-input" />
            </div>
            <div class="fg-row">
              <label class="fg-label">電子郵件</label>
              <input v-model="account.email" type="email" class="fi fg-input" />
            </div>
            <div class="fg-row">
              <label class="fg-label">角色</label>
              <input
                :value="account.role"
                class="fi fg-input"
                disabled
                style="opacity: 0.55; cursor: not-allowed"
              />
            </div>
            <div class="fg-row">
              <label class="fg-label">部門</label>
              <select v-model="account.dept" class="fs fg-input">
                <option>運務部</option>
                <option>資訊部</option>
                <option>管理部</option>
                <option>業務部</option>
              </select>
            </div>
            <div class="fg-row">
              <label class="fg-label">更改密碼</label>
              <input
                placeholder="輸入新密碼"
                type="password"
                class="fi fg-input"
              />
            </div>
            <div class="fg-row">
              <label class="fg-label">確認密碼</label>
              <input
                placeholder="再次輸入"
                type="password"
                class="fi fg-input"
              />
            </div>
          </div>
        </section>

        <!-- Notify -->
        <section v-else-if="activeSection === 'notify'" class="sc-section">
          <h2 class="sc-head">通知設定</h2>
          <div class="toggle-list">
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">任務派單通知</div>
                <div class="tg-desc">收到新派單時通知</div>
              </div>
              <label class="toggle">
                <input v-model="notify.taskAssign" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">任務完成通知</div>
                <div class="tg-desc">任務標記完成時通知</div>
              </div>
              <label class="toggle">
                <input v-model="notify.taskComplete" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">異常任務通知</div>
                <div class="tg-desc">任務發生異常時立即通知</div>
              </div>
              <label class="toggle">
                <input v-model="notify.taskError" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">每日報表</div>
                <div class="tg-desc">每日自動寄送統計報表</div>
              </div>
              <label class="toggle">
                <input v-model="notify.dailyReport" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-divider">通知方式</div>
            <div class="tg-row">
              <div class="tg-info"><div class="tg-name">電子郵件</div></div>
              <label class="toggle">
                <input v-model="notify.email" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info"><div class="tg-name">簡訊 (SMS)</div></div>
              <label class="toggle">
                <input v-model="notify.sms" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
          </div>
        </section>

        <!-- System params -->
        <section v-else-if="activeSection === 'system'" class="sc-section">
          <h2 class="sc-head">系統參數</h2>
          <div class="form-grid">
            <div class="fg-row">
              <label class="fg-label">自動登出 (分鐘)</label>
              <select v-model="system.autoLogout" class="fs fg-input">
                <option>15</option>
                <option>30</option>
                <option>60</option>
                <option>120</option>
              </select>
            </div>
            <div class="fg-row">
              <label class="fg-label">每頁筆數</label>
              <select v-model="system.pageSize" class="fs fg-input">
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div class="fg-row">
              <label class="fg-label">時區</label>
              <select v-model="system.timezone" class="fs fg-input">
                <option>Asia/Taipei</option>
                <option>UTC</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
            <div class="fg-row">
              <label class="fg-label">語言</label>
              <select v-model="system.lang" class="fs fg-input">
                <option>繁體中文</option>
                <option>简体中文</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Security -->
        <section v-else-if="activeSection === 'security'" class="sc-section">
          <h2 class="sc-head">安全設定</h2>
          <div class="toggle-list">
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">雙重驗證 (2FA)</div>
                <div class="tg-desc">啟用後登入需輸入驗證碼</div>
              </div>
              <label class="toggle">
                <input v-model="security.twoFactor" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">IP 白名單限制</div>
                <div class="tg-desc">僅允許特定 IP 登入</div>
              </div>
              <label class="toggle">
                <input v-model="security.ipLimit" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="tg-row">
              <div class="tg-info">
                <div class="tg-name">強制定期更換密碼</div>
                <div class="tg-desc">每 90 天提示更換密碼</div>
              </div>
              <label class="toggle">
                <input v-model="security.forceChangePwd" type="checkbox" />
                <span class="toggle-track" />
              </label>
            </div>
            <div class="fg-row" style="margin-top: 16px">
              <label class="fg-label">日誌保留天數</label>
              <select v-model="security.logDays" class="fs fg-input">
                <option>30</option>
                <option>60</option>
                <option>90</option>
                <option>180</option>
              </select>
            </div>
          </div>
        </section>

        <!-- About -->
        <section v-else-if="activeSection === 'about'" class="sc-section">
          <h2 class="sc-head">關於系統</h2>
          <div class="about-grid">
            <div class="ab-card lg">
              <div class="ab-label">系統名稱</div>
              <div class="ab-val">天眼 <em>i</em> 助理</div>
            </div>
            <div class="ab-card lg">
              <div class="ab-label">版本</div>
              <div class="ab-val" style="color: #00d4ff">v3.2.1</div>
            </div>
            <div class="ab-card lg">
              <div class="ab-label">建置日期</div>
              <div class="ab-val">2026-05-01</div>
            </div>
            <div class="ab-card lg">
              <div class="ab-label">授權單位</div>
              <div class="ab-val">天眼衛星股份有限公司</div>
            </div>
          </div>
          <div class="about-desc">
            天眼 i 助理為天眼衛星 GPS
            任務管理平台，提供派單進度追蹤、統計報表、人員績效分析等功能。
            如有任何問題請聯繫技術支援：<span style="color: #00d4ff"
              >support@skyeye-sat.com.tw</span
            >
          </div>
        </section>

        <!-- Save button -->
        <div v-if="activeSection !== 'about'" class="sc-footer">
          <button class="btn btn-search" @click="save">
            <span v-if="!saved">💾 儲存設定</span>
            <span v-else style="color: #00e87a">✓ 已儲存</span>
          </button>
          <span class="sc-hint">變更將於下次登入後生效</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sys-wrap {
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

.sys-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: start;
}

/* Sidebar nav */
.sys-nav {
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sn-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #3a5878;
  padding: 0 8px 10px;
}
.sn-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  color: #7a9ab8;
  background: transparent;
  border: none;
  position: relative;
  transition: all 0.18s;
  text-align: left;
}
.sn-item:hover {
  background: rgba(0, 212, 255, 0.07);
  color: #c8e0f4;
}
.sn-item.active {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
}
.sn-icon {
  font-size: 14px;
}
.sn-label {
  flex: 1;
}
.sn-bar {
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  border-radius: 2px;
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
}

/* Content */
.sys-content {
  padding: 24px 28px;
  min-height: 400px;
}
.sc-head {
  font-size: 16px;
  font-weight: 700;
  color: #c8e0f4;
  margin: 0 0 22px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
.sc-section {
}

/* Form grid */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 480px;
}
.fg-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 12px;
}
.fg-label {
  font-size: 12px;
  color: #7a9ab8;
}
.fg-input {
  width: 100%;
  box-sizing: border-box;
}

/* Toggle list */
.toggle-list {
  display: flex;
  flex-direction: column;
  max-width: 520px;
}
.tg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.tg-name {
  font-size: 13px;
  color: #c8e0f4;
}
.tg-desc {
  font-size: 11px;
  color: #5a7898;
  margin-top: 2px;
}
.tg-divider {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #3a5878;
  padding: 14px 0 4px;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-track {
  display: block;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.toggle-track::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #5a7898;
  transition:
    transform 0.2s,
    background 0.2s;
}
.toggle input:checked + .toggle-track {
  background: rgba(0, 212, 255, 0.3);
  border-color: rgba(0, 212, 255, 0.5);
}
.toggle input:checked + .toggle-track::after {
  transform: translateX(18px);
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.7);
}

/* About */
.about-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  max-width: 520px;
}
.ab-card {
  padding: 14px 18px;
}
.ab-label {
  font-size: 11px;
  color: #5a7898;
  margin-bottom: 5px;
}
.ab-val {
  font-size: 15px;
  font-weight: 600;
  color: #c8e0f4;
}
.ab-val em {
  font-style: normal;
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.about-desc {
  font-size: 13px;
  color: #7a9ab8;
  line-height: 1.7;
  max-width: 520px;
}

/* Footer */
.sc-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 212, 255, 0.08);
}
.sc-hint {
  font-size: 11px;
  color: #3a5878;
}

/* ── RWD ──────────────────────────────────────────────── */
@media (max-width: 768px) {
  .sys-layout {
    grid-template-columns: 1fr;
  }
  .sys-nav {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    gap: 4px;
  }
  .sn-title {
    display: none;
  }
  .sn-item {
    flex: 0 0 auto;
    padding: 7px 12px;
    font-size: 12px;
    border: 1px solid rgba(0, 212, 255, 0.1);
  }
  .sn-bar {
    display: none;
  }
  .sys-content {
    padding: 16px;
  }
  .fg-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .fg-label {
    margin-bottom: 0;
  }
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
