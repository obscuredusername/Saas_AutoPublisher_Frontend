"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Layers, Loader2 } from "lucide-react"
import Link from "next/link"
import { listCollections } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { CollectionConfig } from "@/lib/api"

interface CollectionSelectorProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  className?: string
  showManageLink?: boolean
}

export default function CollectionSelector({ 
  value, 
  onValueChange, 
  label = "Select Collection",
  className = "",
  showManageLink = true
}: CollectionSelectorProps) {
  const [collections, setCollections] = useState<CollectionConfig[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isAdmin } = useAuth()

  // Load collections
  useEffect(() => {
    const loadCollectionsList = async () => {
      setIsLoading(true)
      try {
        const data = await listCollections()
        setCollections(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load collections:', err)
        setCollections([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCollectionsList()
  }, [])

  // Handle value changes - convert "none" to empty string for API
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue === "none" ? "" : newValue)
  }

  // Don't render anything if user is not an admin and showManageLink is true
  if (showManageLink && !isAdmin()) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-foreground text-sm font-medium flex items-center">
        <Layers className="h-4 w-4 mr-2 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <Select
          value={value || "none"}
          onValueChange={handleValueChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              isLoading ? "Loading collections..." : "Select a collection"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Collections</SelectItem>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              collections.length > 0 ? (
                collections.map((collection) => (
                  <SelectItem key={collection.name} value={collection.name}>
                    {collection.name} {collection.description ? `(${collection.description})` : ''}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  No collections found
                </div>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      {showManageLink && isAdmin() && (
        <div className="text-xs text-muted-foreground">
          <Link href="/dashboard/admin" className="text-primary hover:underline">
            Manage collections in Admin Panel
          </Link>
        </div>
      )}
    </div>
  )
}