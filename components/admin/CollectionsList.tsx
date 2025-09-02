"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listCollections } from "@/lib/admin-api"

type Collection = {
  id: string
  full_name: string
  description: string
  created_at: string
  updated_at: string
}

export function CollectionsList() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCollections = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listCollections()
      // Handle both array response and object with collections property
      const collectionsData = Array.isArray(data) ? data : (data?.collections || [])
      setCollections(collectionsData)
    } catch (err) {
      console.error('Failed to load collections:', err)
      setError('Failed to load collections. Please try again.')
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCollections()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading collections...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
        <Button variant="outline" onClick={loadCollections} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  if (collections.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No collections found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="font-mono">{collection.full_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {collection.description || 'No description'}
              </TableCell>
              <TableCell>
                {new Date(collection.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
