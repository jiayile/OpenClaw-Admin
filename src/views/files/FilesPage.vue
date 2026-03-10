<script setup lang="ts">
import { computed, h, onMounted, ref, watch, nextTick } from 'vue'
import {
  NCard,
  NInput,
  NButton,
  NIcon,
  NSpace,
  NEmpty,
  NSpin,
  NAlert,
  NText,
  NTag,
  NDataTable,
  NPopconfirm,
  NModal,
  NForm,
  NFormItem,
  NUpload,
  NImage,
  NTabs,
  NTabPane,
  NBreadcrumb,
  NBreadcrumbItem,
  NTooltip,
  NSelect,
  NAvatar,
  useMessage,
  type DataTableColumns,
  type UploadFileInfo,
  type SelectOption,
} from 'naive-ui'
import {
  RefreshOutline,
  FolderOutline,
  DocumentOutline,
  CodeSlashOutline,
  ImageOutline,
  VideocamOutline,
  MusicalNotesOutline,
  ArchiveOutline,
  CloudDownloadOutline,
  AddOutline,
  CloudUploadOutline,
  CloseOutline,
  HomeOutline,
  CreateOutline,
  TextOutline,
  ListOutline,
  CodeOutline,
  LinkOutline,
  ImageOutline as ImageIconOutline,
  ChatboxEllipsesOutline,
  ReturnDownBackOutline,
  RemoveOutline,
  AddCircleOutline,
  ReorderFourOutline,
  PersonOutline,
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useMemoryStore } from '@/stores/memory'
import { formatRelativeTime } from '@/utils/format'
import { renderSimpleMarkdown } from '@/utils/markdown'

interface FileEntry {
  name: string
  path: string
  type: 'file' | 'directory'
  isDirectory?: boolean
  size?: number
  updatedAtMs?: number
  extension?: string
  modifiedAt?: string
}

interface AgentSelectOption extends SelectOption {
  agent: {
    id: string
    name?: string
    identity?: {
      name?: string
      emoji?: string
      avatar?: string
      avatarUrl?: string
    }
  }
}

const { t } = useI18n()
const message = useMessage()
const authStore = useAuthStore()
const memoryStore = useMemoryStore()

const loading = ref(false)
const error = ref('')
const currentPath = ref('')
const entries = ref<FileEntry[]>([])
const selectedFile = ref<FileEntry | null>(null)
const fileContent = ref<string>('')
const fileLoading = ref(false)
const editedContent = ref('')

const showPreviewModal = ref(false)
const showEditorModal = ref(false)
const showCreateModal = ref(false)
const showRenameModal = ref(false)
const createType = ref<'file' | 'directory'>('file')
const createName = ref('')
const createLoading = ref(false)
const renameTarget = ref<FileEntry | null>(null)
const renameName = ref('')
const renameLoading = ref(false)

const uploadLoading = ref(false)

const editorTextarea = ref<HTMLTextAreaElement | null>(null)

const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp']
const mdExts = ['md', 'markdown']
const codeExts = ['ts', 'tsx', 'js', 'jsx', 'vue', 'json', 'yaml', 'yml', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'css', 'scss', 'html', 'xml', 'sh', 'bash']

const isImageFile = computed(() => {
  if (!selectedFile.value) return false
  const ext = selectedFile.value.extension?.toLowerCase() || ''
  return imgExts.includes(ext)
})

const isMarkdownFile = computed(() => {
  if (!selectedFile.value) return false
  const ext = selectedFile.value.extension?.toLowerCase() || ''
  return mdExts.includes(ext)
})

const isCodeFile = computed(() => {
  if (!selectedFile.value) return false
  const ext = selectedFile.value.extension?.toLowerCase() || ''
  return codeExts.includes(ext)
})

const imageUrl = ref<string | null>(null)
const previewTab = ref<'preview' | 'source'>('preview')

const agentOptions = computed<AgentSelectOption[]>(() =>
  memoryStore.agents.map((agent) => ({
    label: agent.identity?.name || agent.name || agent.id,
    value: agent.id,
    agent: {
      id: agent.id,
      name: agent.name,
      identity: agent.identity,
    },
  }))
)

function renderAgentLabel(option: SelectOption) {
  const agentOption = option as AgentSelectOption
  const agent = agentOption.agent
  if (!agent) return option.label as string

  const identity = agent.identity
  const emoji = identity?.emoji
  const avatar = identity?.avatarUrl || identity?.avatar
  const name = identity?.name || agent.name || agent.id

  return h(
    'div',
    { style: 'display: flex; align-items: center; gap: 8px; white-space: nowrap;' },
    [
      emoji
        ? h('span', { style: 'font-size: 18px; line-height: 1; flex-shrink: 0;' }, emoji)
        : h(NAvatar, {
            round: true,
            size: 22,
            src: avatar || undefined,
            style: avatar ? undefined : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); flex-shrink: 0;',
          }, { default: () => name.charAt(0).toUpperCase() }),
      h('span', { style: 'overflow: hidden; text-overflow: ellipsis;' }, name),
    ]
  )
}

const selectedAgentId = computed({
  get: () => memoryStore.selectedAgentId,
  set: (val: string) => {
    memoryStore.selectedAgentId = val
  }
})

const currentWorkspace = computed(() => memoryStore.workspace)

const pathParts = computed(() => {
  if (!currentPath.value || currentPath.value === '/') return []
  return currentPath.value.split('/').filter(Boolean)
})

const directories = computed(() => entries.value.filter(e => e.type === 'directory'))
const files = computed(() => entries.value.filter(e => e.type === 'file'))

function getAuthHeaders() {
  const token = authStore.token
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

const tableColumns = computed<DataTableColumns<FileEntry>>(() => [
  {
    title: t('pages.files.columns.name'),
    key: 'name',
    render(row) {
      const icon = row.type === 'directory' ? FolderOutline : getFileIcon(row.extension || '')
      const color = row.type === 'directory' ? '#f0a020' : undefined
      return h(NSpace, { align: 'center', size: 8 }, {
        default: () => [
          h(NIcon, { component: icon, color, size: 18 }),
          h('span', { 
            style: 'cursor: pointer; font-weight: 500;', 
            onClick: () => handleRowClick(row) 
          }, row.name),
        ],
      })
    },
  },
  {
    title: t('pages.files.columns.size'),
    key: 'size',
    width: 100,
    render(row) {
      if (row.type === 'directory') return h(NText, { depth: 3 }, { default: () => '-' })
      return formatFileSize(row.size ?? 0)
    },
  },
  {
    title: t('pages.files.columns.modified'),
    key: 'modifiedAt',
    width: 160,
    render(row) {
      return row.modifiedAt ? formatRelativeTime(new Date(row.modifiedAt).getTime()) : '-'
    },
  },
  {
    title: t('pages.files.columns.type'),
    key: 'type',
    width: 100,
    render(row) {
      const typeMap: Record<string, string> = {
        directory: t('pages.files.types.directory'),
        file: t('pages.files.types.file'),
        symlink: t('pages.files.types.symlink'),
      }
      return h(NTag, { size: 'small', bordered: false, round: true, type: row.type === 'directory' ? 'warning' : 'default' }, { default: () => typeMap[row.type] || row.type })
    },
  },
  {
    title: t('pages.files.columns.actions'),
    key: 'actions',
    width: 240,
    render(row) {
      const actions: any[] = []
      
      if (row.type === 'directory') {
        actions.push(
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            type: 'primary',
            onClick: () => navigateToDirectory(row.name),
          }, {
            default: () => t('pages.files.actions.open'),
          })
        )
      } else {
        const ext = row.extension?.toLowerCase() || ''
        const isImage = imgExts.includes(ext)
        
        actions.push(
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            onClick: () => openPreview(row),
          }, {
            default: () => t('pages.files.actions.view'),
          })
        )
        actions.push(
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            onClick: () => downloadFileDirect(row),
          }, {
            default: () => t('pages.files.actions.download'),
          })
        )
        if (!isImage) {
          actions.push(
            h(NButton, {
              size: 'tiny',
              quaternary: true,
              type: 'info',
              onClick: () => openEditor(row),
            }, {
              default: () => t('pages.files.actions.edit'),
            })
          )
        }
      }
      
      actions.push(
        h(NButton, {
          size: 'tiny',
          quaternary: true,
          onClick: () => openRenameModal(row),
        }, {
          default: () => t('pages.files.actions.rename'),
        })
      )
      
      actions.push(
        h(NPopconfirm, {
          onPositiveClick: () => deleteEntry(row),
        }, {
          trigger: () => h(NButton, {
            size: 'tiny',
            quaternary: true,
            type: 'error',
          }, {
            default: () => t('pages.files.actions.delete'),
          }),
          default: () => t('pages.files.deleteConfirm', { name: row.name }),
        })
      )
      
      return h(NSpace, { size: 4 }, { default: () => actions })
    },
  },
])

function getFileIcon(ext: string): any {
  const extLower = ext.toLowerCase().replace('.', '')
  if (codeExts.includes(extLower)) return CodeSlashOutline
  if (imgExts.includes(extLower)) return ImageOutline
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv']
  if (videoExts.includes(extLower)) return VideocamOutline
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac']
  if (audioExts.includes(extLower)) return MusicalNotesOutline
  const archiveExts = ['zip', 'tar', 'gz', 'rar', '7z']
  if (archiveExts.includes(extLower)) return ArchiveOutline
  return DocumentOutline
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

async function browsePath(path: string) {
  if (!currentWorkspace.value) {
    error.value = t('pages.files.noWorkspace')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const url = `/api/files/list?path=${encodeURIComponent(path)}&workspace=${encodeURIComponent(currentWorkspace.value)}`
    const response = await fetch(url, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to list files')
    }
    
    entries.value = (data.files || []).map((f: any) => ({
      name: f.name,
      path: f.path,
      type: f.type || (f.isDirectory ? 'directory' : 'file'),
      size: f.size,
      modifiedAt: f.updatedAtMs ? new Date(f.updatedAtMs).toISOString() : undefined,
      extension: f.extension,
    }))
    
    currentPath.value = data.path || path
    
    console.log('[FilesPage] Loaded', entries.value.length, 'entries for path:', path, 'workspace:', currentWorkspace.value)
  } catch (e: any) {
    console.error('[FilesPage] browsePath error:', e)
    error.value = e?.message || t('pages.files.loadFailed')
    entries.value = []
  } finally {
    loading.value = false
  }
}

async function switchAgent(agentId: string) {
  selectedAgentId.value = agentId
  currentPath.value = ''
  entries.value = []
  
  await memoryStore.fetchFiles(agentId)
  
  if (currentWorkspace.value) {
    await browsePath('')
  }
}

function handleRowClick(row: FileEntry) {
  if (row.type === 'directory') {
    navigateToDirectory(row.name)
  } else {
    openPreview(row)
  }
}

function navigateToDirectory(dirName: string) {
  const newPath = currentPath.value 
    ? `${currentPath.value}/${dirName}` 
    : dirName
  browsePath(newPath)
}

function navigateToPath(index: number) {
  if (index === -1) {
    browsePath('')
  } else {
    const parts = pathParts.value.slice(0, index + 1)
    browsePath(parts.join('/'))
  }
}

async function openPreview(file: FileEntry) {
  selectedFile.value = file
  fileLoading.value = true
  fileContent.value = ''
  imageUrl.value = null
  previewTab.value = 'preview'
  
  try {
    const response = await fetch(`/api/files/get?path=${encodeURIComponent(file.path)}&workspace=${encodeURIComponent(currentWorkspace.value)}`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to read file')
    }
    
    fileContent.value = data.file.content || ''
    
    const ext = file.extension?.toLowerCase() || ''
    if (imgExts.includes(ext) && data.file.content) {
      imageUrl.value = `data:image/${ext};base64,${data.file.content}`
    }
    
    showPreviewModal.value = true
  } catch (e: any) {
    console.error('[FilesPage] openPreview error:', e)
    message.error(t('pages.files.readFileFailed') + ': ' + (e?.message || ''))
  } finally {
    fileLoading.value = false
  }
}

async function openEditor(file: FileEntry) {
  selectedFile.value = file
  fileLoading.value = true
  fileContent.value = ''
  editedContent.value = ''
  
  try {
    const response = await fetch(`/api/files/get?path=${encodeURIComponent(file.path)}&workspace=${encodeURIComponent(currentWorkspace.value)}`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to read file')
    }
    
    fileContent.value = data.file.content || ''
    editedContent.value = fileContent.value
    showEditorModal.value = true
    
    await nextTick()
    if (editorTextarea.value) {
      editorTextarea.value.focus()
    }
  } catch (e: any) {
    console.error('[FilesPage] openEditor error:', e)
    message.error(t('pages.files.readFileFailed') + ': ' + (e?.message || ''))
  } finally {
    fileLoading.value = false
  }
}

async function saveFile() {
  if (!selectedFile.value) return
  
  fileLoading.value = true
  try {
    console.log('[FilesPage] Saving file:', selectedFile.value.path)
    
    const response = await fetch('/api/files/set', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        path: selectedFile.value.path,
        content: editedContent.value,
        workspace: currentWorkspace.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to save file')
    }
    
    fileContent.value = editedContent.value
    message.success(t('pages.files.saveSuccess'))
    await browsePath(currentPath.value)
  } catch (e: any) {
    console.error('[FilesPage] saveFile error:', e)
    message.error(t('pages.files.saveFailed') + ': ' + (e?.message || ''))
  } finally {
    fileLoading.value = false
  }
}

async function downloadFileDirect(file: FileEntry) {
  try {
    const response = await fetch(`/api/files/get?path=${encodeURIComponent(file.path)}&workspace=${encodeURIComponent(currentWorkspace.value)}`, {
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to read file')
    }
    
    const content = data.file.content || ''
    
    if (!content) {
      message.warning(t('pages.files.noContent'))
      return
    }
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    message.error(t('pages.files.readFileFailed'))
  }
}

function downloadFile(file: FileEntry) {
  if (!fileContent.value) {
    message.warning(t('pages.files.noContent'))
    return
  }
  const blob = new Blob([fileContent.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}

function openCreateModal(type: 'file' | 'directory') {
  createType.value = type
  createName.value = ''
  showCreateModal.value = true
}

async function createEntry() {
  if (!createName.value.trim()) return
  
  createLoading.value = true
  try {
    const name = createName.value.trim()
    const fullPath = currentPath.value ? `${currentPath.value}/${name}` : name
    
    console.log('[FilesPage] Creating:', createType.value, fullPath)
    
    if (createType.value === 'file') {
      const response = await fetch('/api/files/set', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          path: fullPath,
          content: '',
          workspace: currentWorkspace.value
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error?.message || 'Failed to create file')
      }
      
      showCreateModal.value = false
      message.success(t('pages.files.createSuccess'))
      await browsePath(currentPath.value)
    } else {
      const response = await fetch('/api/files/mkdir', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          path: fullPath,
          workspace: currentWorkspace.value
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error?.message || 'Failed to create directory')
      }
      
      showCreateModal.value = false
      message.success(t('pages.files.createDirSuccess'))
      await browsePath(currentPath.value)
    }
  } catch (e: any) {
    console.error('[FilesPage] createEntry error:', e)
    message.error(t('pages.files.createFailed') + ': ' + (e?.message || ''))
  } finally {
    createLoading.value = false
  }
}

async function deleteEntry(file: FileEntry) {
  try {
    console.log('[FilesPage] Deleting:', file.path)
    
    const response = await fetch('/api/files/delete', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        path: file.path,
        workspace: currentWorkspace.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to delete')
    }
    
    if (selectedFile.value?.path === file.path) {
      selectedFile.value = null
      fileContent.value = ''
    }
    message.success(t('pages.files.deleteSuccess'))
    await browsePath(currentPath.value)
  } catch (e: any) {
    console.error('[FilesPage] deleteEntry error:', e)
    message.error(t('pages.files.deleteFailed') + ': ' + (e?.message || ''))
  }
}

function openRenameModal(file: FileEntry) {
  renameTarget.value = file
  renameName.value = file.name
  showRenameModal.value = true
}

async function renameEntry() {
  if (!renameTarget.value || !renameName.value.trim()) return
  
  const newName = renameName.value.trim()
  if (newName === renameTarget.value.name) {
    showRenameModal.value = false
    return
  }
  
  renameLoading.value = true
  try {
    const oldPath = renameTarget.value.path
    const parentPath = oldPath.includes('/') ? oldPath.substring(0, oldPath.lastIndexOf('/')) : ''
    const newPath = parentPath ? `${parentPath}/${newName}` : newName
    
    console.log('[FilesPage] Renaming:', oldPath, '->', newPath)
    
    const response = await fetch('/api/files/rename', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        oldPath,
        newPath,
        workspace: currentWorkspace.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to rename')
    }
    
    showRenameModal.value = false
    message.success(t('pages.files.createSuccess'))
    await browsePath(currentPath.value)
  } catch (e: any) {
    console.error('[FilesPage] renameEntry error:', e)
    message.error(t('pages.files.createFailed') + ': ' + (e?.message || ''))
  } finally {
    renameLoading.value = false
  }
}

async function handleUpload({ file, onFinish, onError }: { file: UploadFileInfo, onFinish: () => void, onError: (error: Error) => void }) {
  if (!file.file) {
    onError(new Error('No file'))
    return
  }
  
  uploadLoading.value = true
  try {
    const fullPath = currentPath.value ? `${currentPath.value}/${file.name}` : file.name
    
    console.log('[FilesPage] Uploading:', fullPath, 'size:', file.file.size)
    
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('path', fullPath)
    formData.append('workspace', currentWorkspace.value || '')
    
    const token = authStore.token
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || 'Failed to upload file')
    }
    
    message.success(t('pages.files.uploadSuccess'))
    await browsePath(currentPath.value)
    onFinish()
  } catch (e: any) {
    console.error('[FilesPage] handleUpload error:', e)
    message.error(t('pages.files.uploadFailed') + ': ' + (e?.message || ''))
    onError(e)
  } finally {
    uploadLoading.value = false
  }
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function renderMarkdown(content: string): string {
  return renderSimpleMarkdown(content)
}

function insertText(before: string, after: string = '') {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = editedContent.value.substring(start, end)
  const newText = before + selectedText + after
  
  editedContent.value = 
    editedContent.value.substring(0, start) + 
    newText + 
    editedContent.value.substring(end)
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + before.length + selectedText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}

function insertHeading(level: number) {
  const prefix = '#'.repeat(level) + ' '
  insertText(prefix)
}

function insertBold() {
  insertText('**', '**')
}

function insertItalic() {
  insertText('*', '*')
}

function insertStrikethrough() {
  insertText('~~', '~~')
}

function insertCode() {
  insertText('`', '`')
}

function insertCodeBlock() {
  insertText('\n```\n', '\n```\n')
}

function insertLink() {
  insertText('[', '](url)')
}

function insertImage() {
  insertText('![alt](', ')')
}

function insertQuote() {
  insertText('\n> ')
}

function insertUl() {
  insertText('\n- ')
}

function insertOl() {
  insertText('\n1. ')
}

function insertHr() {
  insertText('\n\n---\n\n')
}

function insertTable() {
  const table = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`
  insertText(table)
}

async function initialize() {
  if (memoryStore.agents.length === 0) {
    await memoryStore.fetchAgents()
  }
  
  if (!memoryStore.selectedAgentId && memoryStore.agents.length > 0) {
    memoryStore.selectedAgentId = memoryStore.defaultAgentId || memoryStore.agents[0]?.id || 'main'
  }
  
  if (memoryStore.selectedAgentId && !memoryStore.workspace) {
    await memoryStore.fetchFiles(memoryStore.selectedAgentId)
  }
  
  if (currentWorkspace.value) {
    await browsePath('')
  }
}

watch(selectedAgentId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    switchAgent(newId)
  }
})

onMounted(() => {
  initialize()
})
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="t('routes.files')" class="app-card">
      <template #header-extra>
        <NSpace :size="8">
          <NButton size="small" class="app-toolbar-btn app-toolbar-btn--refresh" :loading="loading || memoryStore.loadingAgents" @click="browsePath(currentPath)">
            <template #icon><NIcon :component="RefreshOutline" /></template>
            {{ t('common.refresh') }}
          </NButton>
        </NSpace>
      </template>

      <NAlert v-if="error" type="error" :bordered="false" style="margin-bottom: 16px;">
        {{ error }}
      </NAlert>

      <div class="files-toolbar">
        <NSpace :size="12" align="center">
          <NSelect
            v-model:value="selectedAgentId"
            :options="agentOptions"
            :placeholder="t('pages.files.selectAgent')"
            :render-label="renderAgentLabel"
            style="width: 260px;"
            :loading="memoryStore.loadingAgents"
          >
            <template #arrow>
              <NIcon :component="PersonOutline" />
            </template>
          </NSelect>
          
          <NBreadcrumb>
            <NBreadcrumbItem @click="navigateToPath(-1)">
              <NIcon :component="HomeOutline" />
            </NBreadcrumbItem>
            <NBreadcrumbItem v-for="(part, index) in pathParts" :key="index" @click="navigateToPath(index)">
              {{ part }}
            </NBreadcrumbItem>
          </NBreadcrumb>
        </NSpace>
        
        <NSpace :size="8">
          <NButton size="small" @click="openCreateModal('directory')" :disabled="!currentWorkspace">
            <template #icon><NIcon :component="AddOutline" /></template>
            {{ t('pages.files.actions.newFolder') }}
          </NButton>
          <NButton size="small" @click="openCreateModal('file')" :disabled="!currentWorkspace">
            <template #icon><NIcon :component="AddOutline" /></template>
            {{ t('pages.files.actions.newFile') }}
          </NButton>
          <NUpload
            :show-file-list="false"
            :custom-request="handleUpload"
            :disabled="uploadLoading || !currentWorkspace"
          >
            <NButton size="small" :loading="uploadLoading" :disabled="!currentWorkspace">
              <template #icon><NIcon :component="CloudUploadOutline" /></template>
              {{ t('pages.files.actions.upload') }}
            </NButton>
          </NUpload>
        </NSpace>
      </div>

      <div class="files-stats">
        <NTag size="small" :bordered="false">
          {{ directories.length }} {{ t('pages.files.types.directory') }}
        </NTag>
        <NTag size="small" :bordered="false" type="info">
          {{ files.length }} {{ t('pages.files.types.file') }}
        </NTag>
        <NTag v-if="currentWorkspace" size="small" :bordered="false" type="success">
          <template #icon><NIcon :component="FolderOutline" /></template>
          {{ currentWorkspace }}
        </NTag>
      </div>

      <NSpin :show="loading">
        <NDataTable
          v-if="entries.length > 0"
          :columns="tableColumns"
          :data="entries"
          :bordered="false"
          :single-line="false"
          size="small"
          :max-height="500"
          virtual-scroll
          :row-key="(row: FileEntry) => row.path"
        />
        <NEmpty v-else-if="!currentWorkspace" :description="t('pages.files.selectAgentFirst')" style="padding: 48px 0;" />
        <NEmpty v-else :description="t('pages.files.empty')" style="padding: 48px 0;" />
      </NSpin>

      <NText depth="3" style="font-size: 12px; display: block; margin-top: 12px;">
        {{ t('pages.files.workspace', { path: currentPath || '/' }) }}
      </NText>
    </NCard>

    <NModal v-model:show="showPreviewModal" preset="card" style="width: 90%; max-width: 900px;" :title="selectedFile?.name || t('pages.files.preview')">
      <template #header-extra>
        <NSpace :size="8">
          <NButton size="small" quaternary @click="downloadFile(selectedFile!)">
            <template #icon><NIcon :component="CloudDownloadOutline" /></template>
            {{ t('pages.files.actions.download') }}
          </NButton>
          <NButton v-if="!isImageFile" size="small" type="primary" @click="showPreviewModal = false; openEditor(selectedFile!)">
            <template #icon><NIcon :component="CreateOutline" /></template>
            {{ t('pages.files.actions.edit') }}
          </NButton>
        </NSpace>
      </template>
      
      <NSpin :show="fileLoading">
        <div v-if="isImageFile && imageUrl" class="preview-image">
          <NImage 
            :src="imageUrl" 
            object-fit="contain"
            :img-props="{ style: 'max-width: 100%; max-height: 100%; object-fit: contain;' }"
          />
        </div>
        
        <template v-else-if="isMarkdownFile">
          <NTabs v-model:value="previewTab" type="line">
            <NTabPane name="preview" :tab="t('pages.files.preview')">
              <div class="markdown-preview" v-html="renderMarkdown(fileContent)"></div>
            </NTabPane>
            <NTabPane name="source" :tab="t('pages.files.source')">
              <pre class="code-preview">{{ fileContent }}</pre>
            </NTabPane>
          </NTabs>
        </template>
        
        <pre v-else-if="isCodeFile || fileContent" class="code-preview">{{ fileContent }}</pre>
        
        <NEmpty v-else :description="t('pages.files.noPreview')" />
      </NSpin>
    </NModal>

    <NModal v-model:show="showEditorModal" preset="card" style="width: 95%; max-width: 1400px; height: 90vh;" :title="selectedFile?.name || t('pages.files.editor.title')">
      <template #header-extra>
        <NSpace :size="8">
          <NButton size="small" type="primary" :loading="fileLoading" @click="saveFile">
            {{ t('pages.files.actions.save') }}
          </NButton>
          <NButton size="small" @click="showEditorModal = false">
            {{ t('common.cancel') }}
          </NButton>
        </NSpace>
      </template>
      
      <div class="editor-container">
        <div class="editor-toolbar">
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertHeading(1)">H1</NButton>
              </template>
              {{ t('pages.files.editor.heading1') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertHeading(2)">H2</NButton>
              </template>
              {{ t('pages.files.editor.heading2') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertHeading(3)">H3</NButton>
              </template>
              {{ t('pages.files.editor.heading3') }}
            </NTooltip>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertBold">
                  <template #icon><NIcon :component="TextOutline" /></template>
                  <span style="font-weight: bold;">B</span>
                </NButton>
              </template>
              {{ t('pages.files.editor.bold') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertItalic">
                  <template #icon><NIcon :component="TextOutline" /></template>
                  <span style="font-style: italic;">I</span>
                </NButton>
              </template>
              {{ t('pages.files.editor.italic') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertStrikethrough">
                  <template #icon><NIcon :component="TextOutline" /></template>
                  <span style="text-decoration: line-through;">S</span>
                </NButton>
              </template>
              {{ t('pages.files.editor.strikethrough') }}
            </NTooltip>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertCode">
                  <template #icon><NIcon :component="CodeOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.inlineCode') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertCodeBlock">
                  <template #icon><NIcon :component="CodeSlashOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.codeBlock') }}
            </NTooltip>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertLink">
                  <template #icon><NIcon :component="LinkOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.link') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertImage">
                  <template #icon><NIcon :component="ImageIconOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.image') }}
            </NTooltip>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertQuote">
                  <template #icon><NIcon :component="ChatboxEllipsesOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.quote') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertUl">
                  <template #icon><NIcon :component="ListOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.unorderedList') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertOl">
                  <template #icon><NIcon :component="ReorderFourOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.orderedList') }}
            </NTooltip>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <div class="toolbar-group">
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertHr">
                  <template #icon><NIcon :component="RemoveOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.horizontalRule') }}
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton size="tiny" quaternary @click="insertTable">
                  <template #icon><NIcon :component="AddCircleOutline" /></template>
                </NButton>
              </template>
              {{ t('pages.files.editor.table') }}
            </NTooltip>
          </div>
        </div>
        
        <div class="editor-content">
          <div class="editor-pane">
            <textarea
              ref="editorTextarea"
              v-model="editedContent"
              class="full-editor"
              :placeholder="t('pages.files.editPlaceholder')"
            />
          </div>
          <div v-if="isMarkdownFile" class="preview-pane">
            <div class="markdown-preview markdown-preview--full" v-html="renderMarkdown(editedContent)"></div>
          </div>
        </div>
      </div>
    </NModal>

    <NModal v-model:show="showCreateModal" preset="dialog" :title="createType === 'file' ? t('pages.files.createFile') : t('pages.files.createFolder')">
      <NForm @submit.prevent="createEntry">
        <NFormItem :label="createType === 'file' ? t('pages.files.fileName') : t('pages.files.folderName')">
          <NInput v-model:value="createName" :placeholder="t('pages.files.namePlaceholder')" @keyup.enter="createEntry" />
        </NFormItem>
      </NForm>
      <template #action>
        <NSpace>
          <NButton @click="showCreateModal = false">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="createLoading" :disabled="!createName.trim()" @click="createEntry">
            {{ t('common.create') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <NModal v-model:show="showRenameModal" preset="dialog" :title="t('pages.files.actions.rename')">
      <NForm @submit.prevent="renameEntry">
        <NFormItem :label="t('pages.files.fileName')">
          <NInput v-model:value="renameName" :placeholder="t('pages.files.namePlaceholder')" @keyup.enter="renameEntry" />
        </NFormItem>
      </NForm>
      <template #action>
        <NSpace>
          <NButton @click="showRenameModal = false">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="renameLoading" :disabled="!renameName.trim()" @click="renameEntry">
            {{ t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </NSpace>
</template>

<style scoped>
.files-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.files-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.preview-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  min-height: 200px;
  max-height: 500px;
  overflow: hidden;
}

.preview-image :deep(.n-image) {
  max-width: 100%;
  max-height: 100%;
}

.preview-image :deep(.n-image img) {
  max-width: 100%;
  max-height: 452px;
  object-fit: contain;
}

.code-preview {
  margin: 0;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 500px;
  overflow: auto;
}

.markdown-preview {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  max-height: 500px;
  overflow: auto;
}

.markdown-preview--full {
  max-height: calc(90vh - 200px);
  min-height: 300px;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-preview :deep(h1) { font-size: 1.5em; }
.markdown-preview :deep(h2) { font-size: 1.3em; }
.markdown-preview :deep(h3) { font-size: 1.15em; }

.markdown-preview :deep(p) {
  margin: 8px 0;
  line-height: 1.7;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.markdown-preview :deep(li) {
  margin: 4px 0;
}

.markdown-preview :deep(code) {
  padding: 2px 6px;
  background: var(--bg-primary);
  border-radius: 4px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  margin: 12px 0;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: var(--radius);
  overflow-x: auto;
}

.markdown-preview :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-preview :deep(blockquote) {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 4px solid var(--border-color);
  background: var(--bg-primary);
}

.markdown-preview :deep(a) {
  color: var(--link-color);
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.markdown-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  text-align: left;
}

.markdown-preview :deep(th) {
  background: var(--bg-primary);
  font-weight: 600;
}

.editor-container {
  height: calc(90vh - 120px);
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  margin-bottom: 12px;
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  background: var(--border-color);
  margin: 0 8px;
}

.editor-content {
  flex: 1;
  display: flex;
  gap: 12px;
  min-height: 0;
}

.editor-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-left: 1px solid var(--border-color);
  padding-left: 12px;
}

.full-editor {
  width: 100%;
  flex: 1;
  min-height: 300px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.full-editor:focus {
  border-color: var(--link-color);
}
</style>
