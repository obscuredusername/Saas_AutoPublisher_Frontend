const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.autopublish.fun'

// JWT Token management
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ===== AUTHENTICATION ENDPOINTS =====

export interface SignupRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface UserInfo {
  email: string
  id: string
}

// Signup
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to signup')
  }

  return response.json()
}

// Login
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to login')
  }

  return response.json()
}

// Refresh token
export async function refreshToken(): Promise<AuthResponse> {
  return authenticatedFetch('/auth/refresh', { method: 'POST' })
}

// Get current user info
export async function getCurrentUser(): Promise<UserInfo> {
  return authenticatedFetch('/auth/me')
}

// ===== KEYWORDS ENDPOINTS =====

export interface Keyword {
  text: string
  minLength?: number
}

export interface KeywordsRequest {
  keywords: Keyword[]
  country: string
  language: string
  user_email: string
  minutes?: number
  min_length?: number
  target_db_name?: string
}

export interface KeywordsResponse {
  task_id: string
  status: string
}

export interface TaskStatus {
  task_id: string
  status: string
  result?: string
}

// Process keywords
export async function processKeywords(data: KeywordsRequest): Promise<KeywordsResponse> {
  return authenticatedFetch('/keywords/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Get task status
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  return authenticatedFetch(`/keywords/task-status/${taskId}`)
}

// Get user's tasks
export async function getUserTasks(): Promise<TaskStatus[]> {
  return authenticatedFetch('/keywords/my-tasks')
}

// ===== NEWS ENDPOINTS =====

export interface NewsRequest {
  country: string
  language: string
  category: string
  target_db_name?: string
  user_email: string
}

export interface NewsResponse {
  task_id: string
  status: string
  country: string
  language: string
  category: string
  target_db_name: string
  user_email: string
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

// Process news
export async function processNews(data: NewsRequest): Promise<NewsResponse> {
  return authenticatedFetch('/news/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Get news articles
export async function getNewsArticles(params: {
  country: string
  language: string
  category: string
  user_email: string
}): Promise<NewsArticle[]> {
  const queryParams = new URLSearchParams(params).toString()
  return authenticatedFetch(`/news/?${queryParams}`)
}

// Get user's news history
export async function getUserNews(): Promise<NewsArticle[]> {
  return authenticatedFetch('/news/my-news')
}

// ===== CONTENT ENDPOINTS =====

export interface ContentKeywordsRequest {
  keywords: Keyword[]
  country: string
  language: string
  user_email: string
  target_db_name?: string
}

// Process content keywords
export async function processContentKeywords(data: ContentKeywordsRequest): Promise<KeywordsResponse> {
  return authenticatedFetch('/content/keywords', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ===== ADMIN ENDPOINTS =====

export interface DatabaseConfig {
  name: string
  target_db_uri: string
  target_db: string
  description: string
}

export interface SelectDbRequest {
  name: string
}

export interface TargetDbRequest {
  target_db_uri: string
  target_db: string
}

// Store database configuration
export async function storeDbConfig(config: DatabaseConfig): Promise<any> {
  return authenticatedFetch('/admin/store-db-config', {
    method: 'POST',
    body: JSON.stringify(config),
  })
}

// Select database
export async function selectDb(name: string): Promise<any> {
  return authenticatedFetch('/admin/select-db', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

// List database configurations
export async function listDbConfigs(): Promise<DatabaseConfig[]> {
  const response = await authenticatedFetch('/admin/list-db-configs')
  return response.databases || []
}

// Delete database configuration
export async function deleteDbConfig(name: string): Promise<any> {
  return authenticatedFetch(`/admin/delete-db-config/${name}`, {
    method: 'DELETE',
  })
}

// Set target database
export async function setTargetDb(data: TargetDbRequest): Promise<any> {
  return authenticatedFetch('/admin/set-target-db', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Get target database
export async function getTargetDb(): Promise<TargetDbRequest> {
  return authenticatedFetch('/admin/get-target-db')
} 

export async function getDedicatedNews(params: {
  source: string
  category: string
  max: number
  language: string
  country: string
}): Promise<any> {
  const queryParams = new URLSearchParams({
    source: params.source,
    category: params.category,
    max: String(params.max),
    language: params.language,
    country: params.country,
  }).toString()
  return authenticatedFetch(`/dedicated-news/?${queryParams}`)
} 

export async function scheduleNews(data: {
  categories: Record<string, number>,
  language: string,
  country: string,
  source: string,
}): Promise<any> {
  return authenticatedFetch('/news/schedule', {
    method: 'POST',
    body: JSON.stringify(data),
  })
} 