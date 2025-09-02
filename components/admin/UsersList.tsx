"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table"
import { getUsers, updateUserAdminStatus, deleteUser, updateUserCollection, listCollections } from "@/lib/admin-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type User = {
  email: string
  admin: boolean
  collection?: string
  id?: string
}

type Collection = {
  id: string
  full_name: string
  description: string
}

// Special constant to represent no collection
const NO_COLLECTION = 'NO_COLLECTION'

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load users and collections in parallel
      const [usersData, collectionsData] = await Promise.all([
        getUsers(),
        listCollections()
      ])
      
      // Handle users data
      const usersList = Array.isArray(usersData) ? usersData : []
      setUsers(usersList)
      
      // Handle collections data
      const collectionsList = Array.isArray(collectionsData) 
        ? collectionsData 
        : (collectionsData?.collections || [])
      setCollections(collectionsList)
      
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load data. Please try again.')
      setUsers([])
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleAdmin = async (email: string, currentStatus: boolean) => {
    try {
      setUpdating(prev => ({ ...prev, [email]: true }))
      await updateUserAdminStatus(email, !currentStatus)
      await loadData()
    } catch (err) {
      console.error('Failed to update user:', err)
      setError('Failed to update user. Please try again.')
    } finally {
      setUpdating(prev => ({ ...prev, [email]: false }))
    }
  }

  const handleCollectionChange = async (email: string, value: string) => {
    try {
      setUpdating(prev => ({ ...prev, [email]: true }))
      // Convert NO_COLLECTION to empty string for the API
      const collection = value === NO_COLLECTION ? '' : value
      await updateUserCollection(email, collection)
      await loadData()
    } catch (err) {
      console.error('Failed to update collection:', err)
      setError('Failed to update collection. Please try again.')
    } finally {
      setUpdating(prev => ({ ...prev, [email]: false }))
    }
  }

  const handleDelete = async (email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        setUpdating(prev => ({ ...prev, [email]: true }))
        await deleteUser(email)
        await loadData()
      } catch (err) {
        console.error('Failed to delete user:', err)
        setError('Failed to delete user. Please try again.')
      } finally {
        setUpdating(prev => ({ ...prev, [email]: false }))
      }
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
        <Button variant="outline" onClick={loadData} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return <div className="text-center py-4">No users found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Button 
                  variant={user.admin ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleAdmin(user.email, user.admin)}
                  disabled={updating[user.email]}
                  className="min-w-[100px]"
                >
                  {user.admin ? 'Admin' : 'Make Admin'}
                </Button>
              </TableCell>
              <TableCell>
                <Select
                  value={user.collection || NO_COLLECTION}
                  onValueChange={(value) => handleCollectionChange(user.email, value)}
                  disabled={updating[user.email]}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COLLECTION}>
                      No collection
                    </SelectItem>
                    {collections.map((collection) => (
                      <SelectItem key={collection.full_name} value={collection.full_name}>
                        {collection.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.email)}
                  disabled={updating[user.email]}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
