<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NButton, NSpace, NText, NAlert, NSpin, NInput, NFormItem, NForm } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useWebSocketStore } from '@/stores/websocket'
import { ConnectionState } from '@/api/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const websocketStore = useWebSocketStore()
const { t } = useI18n()

const loading = ref(true)
const checking = ref(true)
const error = ref('')
const username = ref('')
const password = ref('')

const connectionState = computed(() => websocketStore.state)
const isConnected = computed(() => connectionState.value === ConnectionState.CONNECTED)
const isConnecting = computed(() => 
  connectionState.value === ConnectionState.CONNECTING || 
  connectionState.value === ConnectionState.RECONNECTING
)

onMounted(async () => {
  const authEnabled = await authStore.checkAuthConfig()
  
  if (!authEnabled) {
    websocketStore.connect()
    
    const checkConnection = () => {
      if (isConnected.value) {
        loading.value = false
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } else if (websocketStore.lastError) {
        loading.value = false
        error.value = websocketStore.lastError
      }
    }

    const unsubscribe = websocketStore.subscribe('stateChange', () => {
      checkConnection()
    })

    const timer = setTimeout(() => {
      if (loading.value) {
        loading.value = false
        if (!isConnected.value) {
          error.value = t('pages.login.connectTimeout')
        }
      }
      unsubscribe()
    }, 10000)

    checkConnection()
  } else {
    checking.value = false
    loading.value = false
    
    if (authStore.isAuthenticated) {
      const valid = await authStore.checkAuth()
      if (valid) {
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      }
    }
  }
})

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = t('pages.login.credentialsRequired')
    return
  }
  
  loading.value = true
  error.value = ''
  
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } else {
    const serverError = authStore.error
    if (serverError === 'Invalid credentials') {
      error.value = t('pages.login.invalidCredentials')
    } else {
      error.value = serverError || t('pages.login.invalidCredentials')
    }
    loading.value = false
  }
}

function handleRetry() {
  error.value = ''
  loading.value = true
  websocketStore.disconnect()
  websocketStore.connect()
  
  const timer = setTimeout(() => {
    if (loading.value) {
      loading.value = false
      if (!isConnected.value) {
        error.value = t('pages.login.connectTimeout')
      }
    }
  }, 10000)
}
</script>

<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); padding: 20px;">
    <NCard
      style="max-width: 420px; width: 100%; border-radius: var(--radius-lg);"
      :bordered="true"
    >
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="font-size: 48px; display: block; margin-bottom: 12px;">🦞</span>
        <NText strong style="font-size: 24px; letter-spacing: -0.5px;">
          OpenClaw Admin
        </NText>
        <div style="margin-top: 8px;">
          <NText depth="3" style="font-size: 14px;">
            {{ t('pages.login.subtitle') }}
          </NText>
        </div>
      </div>

      <NSpace vertical :size="16">
        <div v-if="loading && !checking" style="text-align: center; padding: 20px;">
          <NSpin size="medium" />
          <div style="margin-top: 12px;">
            <NText depth="3">{{ t('pages.login.loggingIn') }}</NText>
          </div>
        </div>

        <template v-else-if="authStore.authEnabled || checking">
          <NAlert v-if="error" type="error" :bordered="false">
            {{ error }}
          </NAlert>

          <NForm @submit.prevent="handleLogin">
            <NFormItem :label="t('pages.login.username')">
              <NInput
                v-model:value="username"
                :placeholder="t('pages.login.usernamePlaceholder')"
                size="large"
                style="border-radius: 8px;"
                @keydown.enter="handleLogin"
              />
            </NFormItem>
            
            <NFormItem :label="t('pages.login.password')">
              <NInput
                v-model:value="password"
                type="password"
                show-password-on="click"
                :placeholder="t('pages.login.passwordPlaceholder')"
                size="large"
                style="border-radius: 8px;"
                @keydown.enter="handleLogin"
              />
            </NFormItem>

            <NButton
              type="primary"
              block
              size="large"
              style="border-radius: 8px; margin-top: 8px;"
              :loading="loading"
              @click="handleLogin"
            >
              {{ t('pages.login.login') }}
            </NButton>
          </NForm>
        </template>

        <template v-else>
          <div v-if="loading || isConnecting" style="text-align: center; padding: 20px;">
            <NSpin size="medium" />
            <div style="margin-top: 12px;">
              <NText depth="3">{{ t('pages.login.connecting') }}</NText>
            </div>
          </div>

          <NAlert v-if="error" type="error" :bordered="false">
            {{ error }}
          </NAlert>

          <NAlert v-if="!loading && !error && !isConnected" type="warning" :bordered="false">
            {{ t('pages.login.gatewayDisconnected') }}
          </NAlert>

          <NButton
            v-if="!loading && !isConnected"
            type="primary"
            block
            size="large"
            style="border-radius: 8px;"
            @click="handleRetry"
          >
            {{ t('pages.login.retry') }}
          </NButton>
        </template>
      </NSpace>
    </NCard>
  </div>
</template>
