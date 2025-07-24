// src/main.js

import './assets/scss/style.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// --- 新增: Element Plus 引入 ---
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// --- 新增: Element Plus Icons 引入 (如果你選擇使用) ---
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

// --- 新增: 使用 Element Plus ---
app.use(ElementPlus)

app.mount('#app')
