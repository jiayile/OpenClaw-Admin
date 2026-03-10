import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useWebSocketStore } from './websocket'
import { useSessionStore } from './session'
import type {
  AgentInfo,
  AgentsListResult,
  ModelInfo,
  AgentInstance,
  ToolPolicyConfig,
} from '@/api/types'

export const useAgentStore = defineStore('agent', () => {
  const agents = ref<AgentInfo[]>([])
  const defaultAgentId = ref<string>('main')
  const mainKey = ref<string>('')
  const loading = ref(false)
  const error = ref('')
  const lastUpdatedAt = ref<number | null>(null)
  const models = ref<ModelInfo[]>([])

  const wsStore = useWebSocketStore()
  const sessionStore = useSessionStore()

  const methodUnknown = computed(() => wsStore.gatewayMethods.length === 0)
  const supportsAgents = computed(() =>
    methodUnknown.value || wsStore.supportsAnyMethod(['agents.list'])
  )

  const agentStats = computed(() => {
    const stats: Record<string, { sessions: number; input: number; output: number }> = {}

    for (const session of sessionStore.sessions) {
      const agentId = session.agentId || 'main'
      if (!stats[agentId]) {
        stats[agentId] = { sessions: 0, input: 0, output: 0 }
      }
      stats[agentId].sessions++
      if (session.tokenUsage) {
        stats[agentId].input += session.tokenUsage.totalInput
        stats[agentId].output += session.tokenUsage.totalOutput
      }
    }

    return stats
  })

  async function fetchAgents() {
    if (!supportsAgents.value) {
      error.value = 'Agent listing is not supported by current Gateway'
      return
    }

    loading.value = true
    error.value = ''
    try {
      const result = await wsStore.rpc.listAgents()
      agents.value = result.agents || []
      defaultAgentId.value = result.defaultId || 'main'
      mainKey.value = result.mainKey || ''
      lastUpdatedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message || 'Failed to load agent list'
    } finally {
      loading.value = false
    }
  }

  async function fetchModels() {
    try {
      models.value = await wsStore.rpc.listModels()
    } catch {
      models.value = []
    }
  }

  async function addAgent(params: { id: string; workspace?: string; name?: string }) {
    const workspace = params.workspace || `~/.openclaw/workspace-${params.id}`
    const agentId = params.id
    const agentName = params.name || params.id
    
    await wsStore.rpc.createAgent({
      name: agentId,
      workspace,
    })
    
    if (agentName !== agentId) {
      const maxRetries = 10
      const initialDelay = 1000
      let updated = false
      
      await new Promise(resolve => setTimeout(resolve, initialDelay))
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          await wsStore.rpc.updateAgent({
            agentId: agentId,
            name: agentName,
          })
          updated = true
          console.log(`[AgentStore] Successfully updated agent name for ${agentId} to "${agentName}" on attempt ${i + 1}`)
          break
        } catch (e) {
          console.warn(`[AgentStore] Failed to update agent name for ${agentId} on attempt ${i + 1}:`, e)
          if (i < maxRetries - 1) {
            const retryDelay = 500 * (i + 1)
            await new Promise(resolve => setTimeout(resolve, retryDelay))
          }
        }
      }
      
      if (!updated) {
        console.error(`[AgentStore] Failed to update agent name for ${agentId} after ${maxRetries} attempts`)
      }
    }
    
    await fetchAgents()
  }

  async function deleteAgent(agentId: string) {
    if (agentId === 'main') {
      throw new Error('Cannot delete the main agent')
    }

    await wsStore.rpc.deleteAgent(agentId)
    agents.value = agents.value.filter((a) => a.id !== agentId)
  }

  async function setAgentIdentity(params: {
    agentId: string
    name?: string
    theme?: string
    emoji?: string
    avatar?: string
  }) {
    if (params.name !== undefined) {
      const maxNameRetries = 10
      const initialDelay = 500
      const nameRetryDelay = 500
      let nameUpdated = false
      
      await new Promise(resolve => setTimeout(resolve, initialDelay))
      
      for (let attempt = 0; attempt < maxNameRetries; attempt++) {
        try {
          await wsStore.rpc.updateAgent({
            agentId: params.agentId,
            name: params.name,
          })
          nameUpdated = true
          console.log(`[AgentStore] Successfully updated agent name for ${params.agentId} to "${params.name}" on attempt ${attempt + 1}`)
          break
        } catch (e: any) {
          const errorMsg = e?.message || String(e)
          console.warn(`[AgentStore] Failed to update agent name for ${params.agentId} on attempt ${attempt + 1}: ${errorMsg}`)
          if (attempt < maxNameRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, nameRetryDelay * (attempt + 1)))
          }
        }
      }
      
      if (!nameUpdated) {
        console.error(`[AgentStore] Failed to update agent name for ${params.agentId} after ${maxNameRetries} attempts`)
      }
    }

    if (params.theme !== undefined || params.emoji !== undefined || params.avatar !== undefined || params.name !== undefined) {
      const maxRetries = 5
      const retryDelay = 500
      let lastError: Error | null = null

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const config = await wsStore.rpc.getConfig()
          const currentList: AgentInstance[] = Array.isArray(config.agents?.list)
            ? [...config.agents.list]
            : []

          const agentIndex = currentList.findIndex((a) => a.id === params.agentId)
          const identity: Record<string, string | undefined> = {
            name: params.name,
            theme: params.theme,
            emoji: params.emoji,
            avatar: params.avatar,
          }

          if (agentIndex >= 0) {
            const existing = currentList[agentIndex]
            if (existing) {
              currentList[agentIndex] = {
                ...existing,
                name: params.name !== undefined ? params.name : existing.name,
                identity,
              }
            }
          } else {
            currentList.push({
              id: params.agentId,
              name: params.name,
              identity,
            })
          }

          const newConfig = {
            ...config,
            agents: {
              ...config.agents,
              list: currentList,
            },
          }

          await wsStore.rpc.setConfig(newConfig)
          lastError = null
          break
        } catch (e: any) {
          lastError = e
          const errorMsg = e?.message || String(e)
          if (errorMsg.includes('hash') || errorMsg.includes('version') || errorMsg.includes('conflict') || errorMsg.includes('stale')) {
            console.warn(`[AgentStore] Config conflict on attempt ${attempt + 1}, retrying...`)
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
            continue
          }
          throw e
        }
      }

      if (lastError) {
        console.error('[AgentStore] Failed to set agent identity after all retries:', lastError)
        throw lastError
      }
    }

    await fetchAgents()
  }

  async function setAgentsIdentityBatch(paramsList: Array<{
    agentId: string
    name?: string
    theme?: string
    emoji?: string
    avatar?: string
  }>) {
    if (paramsList.length === 0) return

    for (const params of paramsList) {
      if (params.name !== undefined) {
        const maxNameRetries = 10
        const initialDelay = 500
        const nameRetryDelay = 500
        let nameUpdated = false
        
        await new Promise(resolve => setTimeout(resolve, initialDelay))
        
        for (let attempt = 0; attempt < maxNameRetries; attempt++) {
          try {
            await wsStore.rpc.updateAgent({
              agentId: params.agentId,
              name: params.name,
            })
            nameUpdated = true
            console.log(`[AgentStore] Successfully updated agent name for ${params.agentId} to "${params.name}" on attempt ${attempt + 1}`)
            break
          } catch (e: any) {
            const errorMsg = e?.message || String(e)
            console.warn(`[AgentStore] Failed to update agent name for ${params.agentId} on attempt ${attempt + 1}: ${errorMsg}`)
            if (attempt < maxNameRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, nameRetryDelay * (attempt + 1)))
            }
          }
        }
        
        if (!nameUpdated) {
          console.error(`[AgentStore] Failed to update agent name for ${params.agentId} after ${maxNameRetries} attempts`)
        }
      }
    }

    const hasIdentityParams = paramsList.some(
      p => p.theme !== undefined || p.emoji !== undefined || p.avatar !== undefined || p.name !== undefined
    )

    if (hasIdentityParams) {
      const maxRetries = 5
      const retryDelay = 500
      let lastError: Error | null = null

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const config = await wsStore.rpc.getConfig()
          const currentList: AgentInstance[] = Array.isArray(config.agents?.list)
            ? [...config.agents.list]
            : []

          for (const params of paramsList) {
            if (params.theme === undefined && params.emoji === undefined && params.avatar === undefined && params.name === undefined) {
              continue
            }

            const agentIndex = currentList.findIndex((a) => a.id === params.agentId)
            const identity: Record<string, string | undefined> = {
              name: params.name,
              theme: params.theme,
              emoji: params.emoji,
              avatar: params.avatar,
            }

            if (agentIndex >= 0) {
              const existing = currentList[agentIndex]
              if (existing) {
                currentList[agentIndex] = {
                  ...existing,
                  name: params.name !== undefined ? params.name : existing.name,
                  identity,
                }
              }
            } else {
              currentList.push({
                id: params.agentId,
                name: params.name,
                identity,
              })
            }
          }

          const newConfig = {
            ...config,
            agents: {
              ...config.agents,
              list: currentList,
            },
          }

          await wsStore.rpc.setConfig(newConfig)
          lastError = null
          break
        } catch (e: any) {
          lastError = e
          const errorMsg = e?.message || String(e)
          if (errorMsg.includes('hash') || errorMsg.includes('version') || errorMsg.includes('conflict') || errorMsg.includes('stale')) {
            console.warn(`[AgentStore] Config conflict on attempt ${attempt + 1}, retrying...`)
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
            continue
          }
          throw e
        }
      }

      if (lastError) {
        console.error('[AgentStore] Failed to set agents identity batch after all retries:', lastError)
        throw lastError
      }
    }

    await fetchAgents()
  }

  async function setAgentModel(params: { agentId: string; model?: string }) {
    await wsStore.rpc.updateAgent({
      agentId: params.agentId,
      model: params.model,
    })
    await fetchAgents()
  }

  async function setAgentTools(params: {
    agentId: string
    allow?: string[]
    deny?: string[]
  }) {
    const config = await wsStore.rpc.getConfig()
    const currentList: AgentInstance[] = Array.isArray(config.agents?.list)
      ? [...config.agents.list]
      : []

    const agentIndex = currentList.findIndex((a) => a.id === params.agentId)
    const tools: ToolPolicyConfig = {
      allow: params.allow,
      deny: params.deny,
    }

    if (agentIndex >= 0) {
      const existing = currentList[agentIndex]
      if (existing) {
        currentList[agentIndex] = {
          ...existing,
          tools,
        }
      }
    } else {
      currentList.push({
        id: params.agentId,
        tools,
      })
    }

    const newConfig = {
      ...config,
      agents: {
        ...config.agents,
        list: currentList,
      },
    }

    await wsStore.rpc.setConfig(newConfig)
    await fetchAgents()
  }

  function getAgentById(id: string): AgentInfo | undefined {
    return agents.value.find((a) => a.id === id)
  }

  function getAgentStats(id: string) {
    return agentStats.value[id] || { sessions: 0, input: 0, output: 0 }
  }

  return {
    agents,
    defaultAgentId,
    mainKey,
    loading,
    error,
    lastUpdatedAt,
    models,
    methodUnknown,
    supportsAgents,
    agentStats,
    fetchAgents,
    fetchModels,
    addAgent,
    deleteAgent,
    setAgentIdentity,
    setAgentsIdentityBatch,
    setAgentModel,
    setAgentTools,
    getAgentById,
    getAgentStats,
  }
})
