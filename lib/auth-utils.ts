// Check if the current user is an admin
export function isAdmin(): boolean {
  if (typeof window === 'undefined') {
    return false; // Running on server side
  }
  
  const role = localStorage.getItem('user_role');
  return role === 'admin';
}

// Get the current user's role
export function getUserRole(): string | null {
  if (typeof window === 'undefined') {
    return null; // Running on server side
  }
  
  return localStorage.getItem('user_role');
}

// Check if user has a specific role
export function hasRole(role: string): boolean {
  if (typeof window === 'undefined') {
    return false; // Running on server side
  }
  
  const userRole = localStorage.getItem('user_role');
  return userRole === role;
}
