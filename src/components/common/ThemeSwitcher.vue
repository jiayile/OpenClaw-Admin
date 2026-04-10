<template>
  <div class="theme-switcher">
    <NButtonGroup>
      <NButton
        v-for="theme in themes"
        :key="theme.key"
        :type="currentTheme === theme.key ? 'primary' : 'default'"
        size="small"
        @click="switchTheme(theme.key)"
      >
        <template #icon>
          <NIcon>
            <component :is="theme.icon" />
          </NIcon>
        </template>
        {{ theme.label }}
      </NButton>
    </NButtonGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import {
  SunnyOutline,
  MoonOutline,
  ColorPaletteOutline,
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'

interface ThemeOption {
  key: string
  label: string
  icon: any
  naiveTheme?: any
}

const { t, locale } = useI18n()

const props = defineProps<{
  defaultTheme?: string
}>()

const emit = defineEmits<{
  (e: 'update:theme', theme: string): void
  (e: 'change', theme: string): void
}>()

const currentTheme = ref(props.defaultTheme || 'light')

const themes: ThemeOption[] = [
  { 
    key: 'light', 
    label: t('theme.light'), 
    icon: SunnyOutline,
  },
  { 
    key: 'dark', 
    label: t('theme.dark'), 
    icon: MoonOutline,
  },
  { 
    key: 'auto', 
    label: t('theme.auto'), 
    icon: ColorPaletteOutline,
  },
]

function switchTheme(themeKey: string): void {
  currentTheme.value = themeKey
  emit('update:theme', themeKey)
  emit('change', themeKey)
  
  // 保存到 localStorage
  localStorage.setItem('app-theme', themeKey)
  
  // 应用主题到 document
  applyTheme(themeKey)
}

function applyTheme(themeKey: string): void {
  const html = document.documentElement
  
  // 移除所有主题类
  html.classList.remove('light', 'dark', 'auto')
  
  if (themeKey === 'auto') {
    // 自动模式：检测系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    html.classList.add(themeKey)
  }
  
  // 设置 data-theme 属性
  html.setAttribute('data-theme', themeKey)
}

// 监听系统主题变化
function handleSystemThemeChange(e: MediaQueryListEvent): void {
  if (currentTheme.value === 'auto') {
    applyTheme('auto')
  }
}

onMounted(() => {
  // 从 localStorage 加载主题
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
  
  // 应用主题
  applyTheme(currentTheme.value)
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

// 暴露方法
defineExpose({
  getTheme: () => currentTheme.value,
  setTheme: switchTheme
})
</script>

<style scoped>
.theme-switcher {
  display: inline-flex;
}

:deep(.n-button-group) {
  border-radius: 6px;
}
</style>
