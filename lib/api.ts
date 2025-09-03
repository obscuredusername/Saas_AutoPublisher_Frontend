// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.autopublish.fun'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.staging.autopublish.fun'
// Session management
export const getAuthToken = (): string | null => {
  // For session-based auth, we don't need to store the token in localStorage
  // The session cookie will be sent automatically with each request
  return 'session' // Return a non-null value to indicate we're using session auth
}

export const setAuthToken = (token: string): void => {
  // No need to store the token for session-based auth
  // The session cookie is set by the server with HttpOnly flag
}

export const removeAuthToken = (): void => {
  // Clear any client-side auth state if needed
  // The session cookie will be cleared by the server on logout
}

// Helper function to make authenticated requests pls help
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
    credentials: 'include', // This ensures cookies are sent with the request
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
  token?: string  // For backward compatibility
  [key: string]: any  // Allow additional properties
}

export interface UserInfo {
  email: string
  id: string
  role?: string
}

// Signup
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/user/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: data.email,
      password: data.password
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to signup')
  }

  // After successful signup, automatically log the user in
  return login(data)
}

// Login
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const fetchResponse = await fetch(`${API_BASE_URL}/user/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This is important for cookies to be sent/received
    body: JSON.stringify({
      email: data.email,
      password: data.password
    }),
  })

  if (!fetchResponse.ok) {
    const error = await fetchResponse.json()
    throw new Error(error.detail || 'Failed to login')
  }

  const result = await fetchResponse.json()
  
  // For session-based auth, we don't need to store anything client-side
  // The session cookie is automatically stored by the browser
  
  // Create the response object with proper typing
  const authResponse: AuthResponse = {
    access_token: result.access_token || 'session',
    token_type: result.token_type || 'session',
    ...result
  }
  
  // Add token property for backward compatibility if it doesn't exist
  if (!authResponse.token) {
    authResponse.token = authResponse.access_token
  }
  
  return authResponse
}

// Refresh session
export async function refreshToken(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/user/session/`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Session refresh failed')
  }
  
  return response.json()
}

// Get current user info
export async function getCurrentUser(): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/user/session/`, {
    method: 'GET',
    credentials: 'include', // Important for sending cookies
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }
  
  const responseData = await response.json()
  console.log('Current user data:', responseData) // Debug log
  
  // Handle both nested user object and flat response
  const userData = responseData.user || responseData
  
  // Check for admin flag in the response
  const isAdmin = userData.admin === true || userData.is_admin === true
  console.log('Is admin:', isAdmin, 'User data:', userData) // Debug log
  
  // Store role in localStorage for persistence
  const role = isAdmin ? 'admin' : 'user'
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_role', role)
    localStorage.setItem('user_email', userData.email || '')
    console.log('Stored in localStorage:', { role, email: userData.email })
  }
  
  return {
    id: userData.user_id?.toString() || userData.id?.toString() || '',
    email: userData.email || '',
    role: role
  }
}

// Logout
export async function logout(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/user/logout/`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to logout')
  }

  // Clear the auth token on logout
  removeAuthToken()
  
  return { success: true }
}

// ===== KEYWORDS ENDPOINTS =====

export interface Keyword {
  text: string
  minLength?: number
}

export interface ScheduledKeyword {
  text: string
  scheduled_time: string
  min_length: number
}

export interface GenerateKeywordsRequest {
  keywords: Array<{ text: string; scheduled_time?: string; min_length?: number }>
  tone: string
  word_count: number
  language: string
  country: string
  min_words: number
  scheduled_times?: string[]
}

export interface GenerateKeywordsResponse {
  generated_content: string
  status: string
  word_count: number
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

// Generate content from keywords
export async function generateKeywords(data: GenerateKeywordsRequest): Promise<GenerateKeywordsResponse> {
  const response = await fetch(`${API_BASE_URL}/keyword/generate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      keywords: data.keywords,
      tone: data.tone,
      word_count: data.word_count,
      language: data.language,
      country: data.country,
      min_words: data.min_words
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to generate content from keywords')
  }

  return response.json()
}

// ===== NEWS ENDPOINTS =====

export interface ScheduledCategory {
  count: number;
  times: string[];
}

export interface GenerateNewsRequest {
  categories: Record<string, ScheduledCategory>;
  language: string;
  country: string;
  vendor: string;
  scheduled_times: string[];
}

export interface GenerateNewsResponse {
  task_id: string;
  status: string;
  categories: Record<string, number>;
  language: string;
  country: string;
  vendor: string;
}

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

// Generate news content
export async function generateNews(data: GenerateNewsRequest): Promise<GenerateNewsResponse> {
  return authenticatedFetch('/news/generate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      categories: data.categories,
      language: data.language,
      country: data.country,
      vendor: data.vendor || 'google' // Default to 'google' if not specified
    }),
  })
}

// Process news
export async function processNews(data: NewsRequest): Promise<NewsResponse> {
  return authenticatedFetch('/news/process', {
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

// ===== COLLECTION MANAGEMENT ENDPOINTS =====

export interface CollectionConfig {
  name: string
  collection_name: string
  description: string
}

// Store a new collection configuration
export async function storeCollection(config: Omit<CollectionConfig, 'id'>): Promise<CollectionConfig> {
  return authenticatedFetch('/admin/store-collection', {
    method: 'POST',
    body: JSON.stringify(config),
  })
}

// List all available collections
export async function listCollections(): Promise<CollectionConfig[]> {
  const response = await authenticatedFetch('/admin/list-collections')
  if (response && response.collections && Array.isArray(response.collections)) {
    return response.collections.map((collection: any) => ({
      name: collection.name || collection.collection_name || '',
      collection_name: collection.collection_name || collection.name || '',
      description: collection.description || ''
    }));
  }
  return [];
}

// Assign a collection to a user
export async function assignCollectionToUser(
  userEmail: string,
  collectionName: string
): Promise<{ success: boolean; message: string }> {
  return authenticatedFetch('/admin/assign-collection', {
    method: 'POST',
    body: JSON.stringify({
      user_email: userEmail,
      collection_name: collectionName
    }),
  })
}

// List all users with their assigned collections
export async function listUsersWithCollections(): Promise<UserInfoWithRole[]> {
  console.log('Fetching users from /admin/list-users...')
  const response = await authenticatedFetch('/admin/list-users')
  console.log('Raw response from /admin/list-users:', JSON.stringify(response, null, 2))
  
  if (Array.isArray(response)) {
    const users = response.map((user: any) => ({
      ...user,
      assigned_collections: user.assigned_collections || [],
      role: user.role || 'user'
    }));
    console.log('Processed users:', JSON.stringify(users, null, 2))
    return users;
  }
  console.warn('Expected array from /admin/list-users but got:', response)
  return [];
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

export interface UserInfoWithRole extends UserInfo {
  role: string;
  email: string;
  assigned_collections?: string[];
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
  categories: Record<string, ScheduledCategory>,
  language: string,
  country: string,
  source: string,
  scheduled_times: string[]
}): Promise<GenerateNewsResponse> {
  return authenticatedFetch('/news/generate/', {
    method: 'POST',
    body: JSON.stringify({
      categories: data.categories,
      language: data.language,
      country: data.country,
      vendor: data.source || 'google',
      scheduled_times: data.scheduled_times
    })
  });
} 

// List all users (admin only)
export async function listUsers(): Promise<UserInfoWithRole[]> {
  return authenticatedFetch('/admin/list-users');
}

// Delete user (admin only)
export async function deleteUser(email: string): Promise<{ success: boolean; message: string }> {
  return authenticatedFetch(`/admin/delete-user/${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
}

// Set admin role (admin only)
export async function setAdminRole(
  userEmail: string, 
  isAdmin: boolean
): Promise<{ success: boolean; message: string }> {
  return authenticatedFetch('/admin/set-admin-role', {
    method: 'POST',
    body: JSON.stringify({
      user_email: userEmail,
      is_admin: isAdmin,
    }),
  });
}

// Assign user to database (admin only)
export async function assignUserToDatabase(
  userEmail: string, 
  databaseId: string
): Promise<{ success: boolean; message: string }> {
  return authenticatedFetch('/admin/assign-user', {
    method: 'POST',
    body: JSON.stringify({
      user_email: userEmail,
      database_id: databaseId,
    }),
  });
}
