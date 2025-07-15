"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Database } from "lucide-react"
import Link from "next/link"
import { listDbConfigs } from "@/lib/api"

interface DatabaseSelectorProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  className?: string
}

export default function DatabaseSelector({ 
  value, 
  onValueChange, 
  label = "Target Database (Optional)",
  className = ""
}: DatabaseSelectorProps) {
  const [databaseConfigs, setDatabaseConfigs] = useState<any[]>([])
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(false)

  // Load database configurations
  useEffect(() => {
    const loadDatabaseConfigs = async () => {
      setIsLoadingDatabases(true)
      try {
        const configs = await listDbConfigs()
        setDatabaseConfigs(configs)
      } catch (err) {
        console.error('Failed to load database configs:', err)
      } finally {
        setIsLoadingDatabases(false)
      }
    }
    loadDatabaseConfigs()
  }, [])

  // Handle value changes - convert "none" to empty string for API
  const handleValueChange = (newValue: string) => {
    if (newValue === "none") {
      onValueChange("")
    } else {
      onValueChange(newValue)
    }
  }

  // Convert empty string to "none" for display
  const displayValue = value === "" ? "none" : value

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-gray-300 text-sm font-medium flex items-center">
        <Database className="h-4 w-4 mr-2 text-blue-400" />
        {label}
      </Label>
      <Select
        value={displayValue}
        onValueChange={handleValueChange}
        disabled={isLoadingDatabases}
      >
        <SelectTrigger className="bg-gray-800/50 border border-gray-600 text-white rounded-xl">
          <SelectValue placeholder={isLoadingDatabases ? "Loading databases..." : "Select a database"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-gray-400">No specific database</span>
          </SelectItem>
          {databaseConfigs.map((config) => (
            <SelectItem key={config.name} value={config.name}>
              <div className="flex flex-col">
                <span className="text-white">{config.name}</span>
                <span className="text-xs text-gray-400">{config.target_db}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {databaseConfigs.length === 0 && !isLoadingDatabases && (
        <p className="text-xs text-gray-500">
          No database configurations found.{" "}
          <Link href="/database-config" className="text-blue-400 hover:text-blue-300">
            Configure databases
          </Link>
        </p>
      )}
    </div>
  )
} 