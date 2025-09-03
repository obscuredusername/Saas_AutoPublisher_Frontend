const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

export interface User {
  email: string;
  admin: boolean;
  collection?: string;
  id?: string;
}

export interface Collection {
  name: string;
  description: string;
}

// Get all users
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/user/users/`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  const data = await response.json();
  // Handle both { users: [...] } and [...] response formats
  return Array.isArray(data) ? data : (data.users || []);
}

// Update user admin status
export async function updateUserAdminStatus(email: string, admin: boolean): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user/users/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_email: email, admin }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update user admin status');
  }
  
  return response.json();
}

// Update user collection
export async function updateUserCollection(email: string, collection: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user/users/`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_email: email, collection }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update user collection');
  }
  
  return response.json();
}

// Delete user
export async function deleteUser(email: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/user/users/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_email: email }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete user');
  }
  
  return { success: true };
}

// Create collection
export async function createCollection(name: string, description: string = ''): Promise<Collection> {
  const response = await fetch(`${API_BASE_URL}/user/collections/create/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create collection');
  }
  
  return response.json();
}

// List collections
export async function listCollections(): Promise<Collection[]> {
  const response = await fetch(`${API_BASE_URL}/user/users/?show=collections`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }
  
  const data = await response.json();
  // Handle both { collections: [...] } and [...] response formats
  return Array.isArray(data) ? data : (data.collections || []);
}
