"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getUserTasks, getTaskStatus } from "@/lib/api"

// Task status interface
interface TaskStatus {
  task_id: string
  status: string
  result?: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [refreshingTasks, setRefreshingTasks] = useState<string[]>([])

  // Load tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setIsLoading(true)
    setError("")

    try {
      const userTasks = await getUserTasks()
      setTasks(userTasks)
    } catch (err: any) {
      setError(err.message || "Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTaskStatus = async (taskId: string) => {
    setRefreshingTasks(prev => [...prev, taskId])
    try {
      const status = await getTaskStatus(taskId)
      setTasks(prev => prev.map(task => 
        task.task_id === taskId ? status : task
      ))
    } catch (err: any) {
      console.error('Failed to refresh task status:', err)
    } finally {
      setRefreshingTasks(prev => prev.filter(id => id !== taskId))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'RUNNING':
        return <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
      case 'FAILED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case 'RUNNING':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Running</Badge>
      case 'PENDING':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pending</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const formatTaskId = (taskId: string) => {
    if (taskId.length > 20) {
      return `${taskId.substring(0, 8)}...${taskId.substring(taskId.length - 8)}`
    }
    return taskId
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-30 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 ml-4">
                My Tasks
              </h1>
            </div>
            <Button
              onClick={loadTasks}
              disabled={isLoading}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-blue-400 hover:bg-gray-700/50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-500 bg-red-100/10 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
              <span className="text-gray-400">Loading tasks...</span>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Tasks Found</h3>
              <p className="text-gray-400 mb-6">You haven't created any tasks yet. Start by creating a post!</p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <Card key={task.task_id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            Task #{index + 1}
                          </h3>
                          {getStatusBadge(task.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Task ID:</span>
                            <code className="text-blue-400 text-sm bg-blue-500/10 px-2 py-1 rounded">
                              {formatTaskId(task.task_id)}
                            </code>
                          </div>
                          {task.result && (
                            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <span className="text-gray-400 text-sm">Result:</span>
                              <p className="text-white text-sm mt-1">{task.result}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Button
                        onClick={() => refreshTaskStatus(task.task_id)}
                        disabled={refreshingTasks.includes(task.task_id)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-800/50 border-gray-600 text-blue-400 hover:bg-gray-700/50"
                      >
                        {refreshingTasks.includes(task.task_id) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 