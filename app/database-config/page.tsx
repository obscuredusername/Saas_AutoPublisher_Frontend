"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Database, Trash2, Settings } from "lucide-react"
import { DatabaseConfig, storeDbConfig, listDbConfigs, deleteDbConfig } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DatabaseConfigPage() {
  const [configs, setConfigs] = useState<DatabaseConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    target_db_uri: "",
    target_db: "",
    description: ""
  })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await storeDbConfig(formData)
      toast({
        title: "Success",
        description: "Database configuration stored successfully",
      })
      setFormData({ name: "", target_db_uri: "", target_db: "", description: "" })
      setShowForm(false)
      loadConfigs()
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

  const handleDelete = async (name: string) => {
    try {
      setLoading(true)
      await deleteDbConfig(name)
      toast({
        title: "Success",
        description: "Database configuration deleted successfully",
      })
      loadConfigs()
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 ml-2">
                Database Configuration
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Database Configurations</h2>
            <p className="text-gray-400">Manage your database connections and configurations</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </Button>
        </div>

        {/* Add Configuration Form */}
        {showForm && (
          <Card className="mb-8 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Add New Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                      Configuration Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., staging_db"
                      required
                      className="bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_db" className="text-gray-300 text-sm font-medium">
                      Database Name
                    </Label>
                    <Input
                      id="target_db"
                      value={formData.target_db}
                      onChange={(e) => setFormData({ ...formData, target_db: e.target.value })}
                      placeholder="e.g., staging_database"
                      required
                      className="bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_db_uri" className="text-gray-300 text-sm font-medium">
                    Database URI
                  </Label>
                  <Input
                    id="target_db_uri"
                    value={formData.target_db_uri}
                    onChange={(e) => setFormData({ ...formData, target_db_uri: e.target.value })}
                    placeholder="e.g., mongodb://staging-server:27017"
                    required
                    className="bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300 text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this database configuration"
                    className="bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0"
                  >
                    {loading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Database Configurations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && configs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading configurations...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No database configurations found</p>
              <p className="text-gray-500 text-sm">Add your first configuration to get started</p>
            </div>
          ) : (
            configs.map((config: DatabaseConfig) => (
              <Card key={config.name} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-blue-400 mr-2" />
                      <CardTitle className="text-white text-lg">{config.name}</CardTitle>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Configuration</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete the configuration "{config.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(config.name)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs font-medium">Database</Label>
                    <p className="text-white text-sm">{config.target_db}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs font-medium">URI</Label>
                    <p className="text-gray-300 text-sm font-mono break-all">{config.target_db_uri}</p>
                  </div>
                  {config.description && (
                    <div>
                      <Label className="text-gray-400 text-xs font-medium">Description</Label>
                      <p className="text-gray-300 text-sm">{config.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
} 