<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NButton, NIcon, NSpin, NSpace, NText } from 'naive-ui'
import {
  ChevronBackOutline,
  ChevronForwardOutline,
  ExpandOutline,
  ContractOutline,
} from '@vicons/ionicons5'
import VuePdfEmbed from 'vue-pdf-embed'

const props = defineProps<{
  url: string
  authToken?: string
}>()

const emit = defineEmits<{
  (e: 'fullscreen'): void
}>()

const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.0)
const isFullscreen = ref(false)
const pdfRef = ref<any>(null)

const pdfSource = computed(() => {
  const headers: Record<string, string> = {}
  if (props.authToken) {
    headers['Authorization'] = `Bearer ${props.authToken}`
  }
  
  return {
    url: props.url,
    httpHeaders: headers,
  }
})

function handleRendered() {
  loading.value = false
  if (pdfRef.value) {
    totalPages.value = pdfRef.value.doc.numPages || 0
  }
}

function handleError(err: Error) {
  console.error('[PdfViewer] Error loading PDF:', err)
  error.value = err?.message || 'Failed to load PDF'
  loading.value = false
}

function handleLoading() {
  loading.value = true
  error.value = ''
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function zoomIn() {
  if (scale.value < 3) {
    scale.value = Math.min(3, scale.value + 0.25)
  }
}

function zoomOut() {
  if (scale.value > 0.5) {
    scale.value = Math.max(0.5, scale.value - 0.25)
  }
}

function resetZoom() {
  scale.value = 1.0
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen')
}

watch(() => props.url, () => {
  loading.value = true
  error.value = ''
  currentPage.value = 1
  totalPages.value = 0
})
</script>

<template>
  <div class="pdf-viewer" :class="{ 'pdf-viewer--fullscreen': isFullscreen }">
    <div class="pdf-toolbar">
      <NSpace :size="8" align="center">
        <NButton size="tiny" quaternary :disabled="currentPage <= 1" @click="prevPage">
          <template #icon><NIcon :component="ChevronBackOutline" /></template>
        </NButton>
        
        <NText depth="3">{{ currentPage }} / {{ totalPages || '?' }}</NText>
        
        <NButton size="tiny" quaternary :disabled="currentPage >= totalPages" @click="nextPage">
          <template #icon><NIcon :component="ChevronForwardOutline" /></template>
        </NButton>
      </NSpace>
      
      <NSpace :size="8" align="center">
        <NButton size="tiny" quaternary @click="zoomOut" :disabled="scale <= 0.5">
          -
        </NButton>
        <NText depth="3" style="min-width: 50px; text-align: center;">{{ Math.round(scale * 100) }}%</NText>
        <NButton size="tiny" quaternary @click="zoomIn" :disabled="scale >= 3">
          +
        </NButton>
        
        <div class="toolbar-divider"></div>
        
        <NButton size="tiny" quaternary @click="toggleFullscreen">
          <template #icon><NIcon :component="isFullscreen ? ContractOutline : ExpandOutline" /></template>
        </NButton>
      </NSpace>
    </div>
    
    <div class="pdf-container">
      <NSpin :show="loading">
        <div v-if="error" class="pdf-error">
          <NText type="error">{{ error }}</NText>
        </div>
        <div v-else class="pdf-pages" :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }">
          <VuePdfEmbed
            ref="pdfRef"
            :source="pdfSource"
            :page="currentPage"
            class="pdf-embed"
            @rendered="handleRendered"
            @loading-failed="handleError"
            @rendering-failed="handleError"
            @loading="handleLoading"
          />
        </div>
      </NSpin>
    </div>
  </div>
</template>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 70vh;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  overflow: hidden;
}

.pdf-viewer--fullscreen {
  height: calc(100vh - 80px);
}

.pdf-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--border-color);
  margin: 0 4px;
}

.pdf-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.pdf-pages {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-embed {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.pdf-embed canvas {
  display: block;
}

.pdf-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
