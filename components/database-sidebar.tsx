"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Database, ChevronRight, Settings, X } from "lucide-react"
import { DatabaseConfig, listDbConfigs, selectDb } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface DatabaseSidebarProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

export default function DatabaseSidebar({ className = "", onClose, isMobile = false }: DatabaseSidebarProps) {
  const [configs, setConfigs] = useState<DatabaseConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDb, setSelectedDb] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    try {
      setLoading(true)
      const data = await listDbConfigs()
      setConfigs(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setConfigs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDb = async (name: string) => {
    try {
      setLoading(true)
      await selectDb(name)
      setSelectedDb(name)
      toast({
        title: "Success",
        description: `Selected database: ${name}`,
      })
      // Close mobile sidebar after selection
      if (isMobile && onClose) {
        onClose()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 w-80 p-4 h-screen overflow-y-auto ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-400" />
            Databases
          </h3>
          <div className="flex items-center gap-2">
            <Link href="/database-config">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            {isMobile && onClose && (
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {loading && configs.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 text-sm mt-2">Loading...</p>
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-4">
            <Database className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No databases configured</p>
            <Link href="/database-config">
              <Button variant="outline" size="sm" className="mt-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                Configure
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {configs.map((config: DatabaseConfig) => (
              <Card
                key={config.name}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedDb === config.name
                    ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50'
                }`}
                onClick={() => handleSelectDb(config.name)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <Database className={`h-4 w-4 mr-2 ${
                          selectedDb === config.name ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium truncate ${
                          selectedDb === config.name ? 'text-blue-400' : 'text-white'
                        }`}>
                          {config.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {config.target_db}
                      </p>
                    </div>
                    {selectedDb === config.name && (
                      <ChevronRight className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedDb && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400 font-medium">Selected Database</p>
          <p className="text-sm text-white">{selectedDb}</p>
        </div>
      )}
    </div>
  )
} 