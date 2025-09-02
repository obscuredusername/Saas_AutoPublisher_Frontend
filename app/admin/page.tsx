"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { isAdmin } from "@/lib/auth-utils"
import { UsersList } from "@/components/admin/UsersList"
import { CreateCollectionForm } from "@/components/admin/CreateCollectionForm"
import { CollectionsList } from "@/components/admin/CollectionsList"

export default function AdminPanel() {
  const router = useRouter()
  const { isAuthenticated } = useAuth(true)
  const [activeTab, setActiveTab] = useState("users")
  const [collectionsUpdated, setCollectionsUpdated] = useState(0)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard')
    }
  }, [router])

  if (!isAdmin()) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const handleCollectionCreated = () => {
    setCollectionsUpdated(prev => prev + 1)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateCollectionForm onSuccess={handleCollectionCreated} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <CollectionsList key={collectionsUpdated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
