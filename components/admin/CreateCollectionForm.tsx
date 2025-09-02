"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCollection } from "@/lib/admin-api"

export function CreateCollectionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError("Name is required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await createCollection(name, description)
      setName("")
      setDescription("")
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 mb-8 p-6 border rounded-lg">
      <h2 className="text-lg font-semibold">Create New Collection</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Name (format: database.collection)</Label>
          <Input
            placeholder="e.g., mydb.mycollection"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Textarea
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Collection'}
        </Button>
      </form>
    </div>
  )
}
