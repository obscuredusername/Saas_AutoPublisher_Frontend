const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface DatabaseConfig {
  name: string
  target_db_uri: string
  target_db: string
  description: string
}

export interface SelectDbRequest {
  name: string
}

// Store database configuration
export async function storeDbConfig(config: DatabaseConfig): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/store-db-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to store database configuration')
  }

  return response.json()
}

// Select database
export async function selectDb(name: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/select-db`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to select database')
  }

  return response.json()
}

// List database configurations
export async function listDbConfigs(): Promise<DatabaseConfig[]> {
  const response = await fetch(`${API_BASE_URL}/list-db-configs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to list database configurations')
  }

  const data = await response.json()
  return data.databases || []
}

// Delete database configuration
export async function deleteDbConfig(name: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/delete-db-config/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete database configuration')
  }

  return response.json()
} 