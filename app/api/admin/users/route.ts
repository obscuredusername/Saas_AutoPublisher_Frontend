import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.staging.autopublish.fun'

export async function GET() {
  const cookieStore = cookies()
  const session = cookieStore.get('sessionid')
  
  try {
    const res = await fetch(`${API_URL}/user/users/`, {
      headers: {
        'Cookie': `sessionid=${session?.value}`
      }
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch users')
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const session = cookieStore.get('sessionid')
  const { user_email, admin } = await request.json()
  
  try {
    const res = await fetch(`${API_URL}/user/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sessionid=${session?.value}`
      },
      body: JSON.stringify({ user_email, admin })
    })
    
    if (!res.ok) {
      throw new Error('Failed to create user')
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
