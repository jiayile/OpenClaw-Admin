/**
 * Cron 编辑器前端 API 封装
 * 与后端 API 进行联调
 */

const API_BASE = '/api'

export interface BatchDeleteRequest {
  jobIds: string[]
}

export interface BatchEnableRequest {
  jobIds: string[]
}

export interface BatchDisableRequest {
  jobIds: string[]
}

export interface CronStatsResponse {
  ok: boolean
  stats: {
    total: number
    enabled: number
    disabled: number
    schedulerEnabled: boolean
    nextWakeAtMs?: number
    byScheduleType: {
      cron: number
      every: number
      at: number
    }
  }
}

export interface BatchDeleteResponse {
  ok: boolean
  deletedCount: number
  failedCount: number
}

export interface BatchEnableResponse {
  ok: boolean
  enabledCount: number
  failedCount: number
}

export interface BatchDisableResponse {
  ok: boolean
  disabledCount: number
  failedCount: number
}

/**
 * 批量删除 Cron 任务
 */
export async function batchDeleteCrons(jobIds: string[]): Promise<BatchDeleteResponse> {
  const response = await fetch(`${API_BASE}/crons/batch-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobIds }),
  })
  
  if (!response.ok) {
    throw new Error(`Batch delete failed: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * 批量启用 Cron 任务
 */
export async function batchEnableCrons(jobIds: string[]): Promise<BatchEnableResponse> {
  const response = await fetch(`${API_BASE}/crons/batch-enable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobIds }),
  })
  
  if (!response.ok) {
    throw new Error(`Batch enable failed: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * 批量禁用 Cron 任务
 */
export async function batchDisableCrons(jobIds: string[]): Promise<BatchDisableResponse> {
  const response = await fetch(`${API_BASE}/crons/batch-disable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobIds }),
  })
  
  if (!response.ok) {
    throw new Error(`Batch disable failed: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * 获取 Cron 统计信息
 */
export async function getCronStats(): Promise<CronStatsResponse> {
  const response = await fetch(`${API_BASE}/crons/stats`, {
    method: 'GET',
  })
  
  if (!response.ok) {
    throw new Error(`Get stats failed: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * 搜索 Cron 任务
 */
export interface SearchCronsParams {
  q?: string
  enabled?: 'true' | 'false' | 'all'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SearchCronsResponse {
  ok: boolean
  items: any[]
  total: number
  page: number
  limit: number
}

export async function searchCrons(params: SearchCronsParams = {}): Promise<SearchCronsResponse> {
  const queryParams = new URLSearchParams()
  if (params.q) queryParams.set('q', params.q)
  if (params.enabled) queryParams.set('enabled', params.enabled)
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)
  if (params.page) queryParams.set('page', String(params.page))
  if (params.limit) queryParams.set('limit', String(params.limit))
  
  const url = `${API_BASE}/crons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await fetch(url, {
    method: 'GET',
  })
  
  if (!response.ok) {
    throw new Error(`Search crons failed: ${response.statusText}`)
  }
  
  return response.json()
}
