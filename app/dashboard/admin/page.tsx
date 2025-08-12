"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  listUsers,
  deleteUser,
  setAdminRole,
  UserInfoWithRole,
  listCollections, 
  storeCollection, 
  CollectionConfig, 
  assignCollectionToUser,
  listUsersWithCollections
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function AdminDashboard() {
  // State for users and collections
  const [users, setUsers] = useState<UserInfoWithRole[]>([]);
  const [collections, setCollections] = useState<CollectionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Collection form state
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [newCollection, setNewCollection] = useState<Omit<CollectionConfig, 'id'>>({
    name: '',
    collection_name: '',
    description: ''
  });
  const { toast } = useToast()
  const { user } = useAuth()

  const loadUsers = async () => {
    try {
      console.log('Fetching users with collections...')
      const data = await listUsersWithCollections()
      console.log('Users with collections:', JSON.stringify(data, null, 2))
      setUsers(data)
    } catch (error: any) {
      console.error('Error loading users:', error)
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCollections = async () => {
    try {
      const data = await listCollections()
      setCollections(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Error loading collections:', error)
      toast({
        title: "Error loading collections",
        description: error.message,
        variant: "destructive"
      })
      setCollections([])
    }
  }

  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return
    
    try {
      await deleteUser(email)
      await loadUsers()
      toast({
        title: "User deleted successfully",
        variant: "default"
      })
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleToggleAdmin = async (userEmail: string, isAdmin: boolean) => {
    try {
      await setAdminRole(userEmail, isAdmin)
      await loadUsers()
      toast({
        title: "Success",
        description: `User ${isAdmin ? 'promoted to admin' : 'demoted from admin'}`
      })
    } catch (error: any) {
      toast({
        title: "Error updating user role",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await storeCollection(newCollection)
      toast({
        title: "Success",
        description: "Collection created successfully"
      })
      setShowCollectionForm(false)
      setNewCollection({
        name: '',
        collection_name: '',
        description: ''
      })
      await loadCollections()
    } catch (error: any) {
      toast({
        title: "Error creating collection",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleAssignCollection = async (userEmail: string, collectionName: string) => {
    try {
      await assignCollectionToUser(userEmail, collectionName)
      toast({
        title: "Success",
        description: `Collection assigned to user ${userEmail}`,
      })
      await loadUsers()
    } catch (error: any) {
      toast({
        title: "Error assigning collection",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    loadUsers()
    loadCollections()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If user is not an admin, show unauthorized message
  if (user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button onClick={() => {
            loadUsers()
            loadCollections()
          }} variant="outline">
            Refresh All
          </Button>
          
          <Dialog open={showCollectionForm} onOpenChange={setShowCollectionForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="collection-name" className="text-right">
                      Display Name
                    </Label>
                    <Input
                      id="collection-name"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Marketing Content"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="collection-db-name" className="text-right">
                      Collection Name
                    </Label>
                    <Input
                      id="collection-db-name"
                      value={newCollection.collection_name}
                      onChange={(e) => setNewCollection({...newCollection, collection_name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., marketing_content"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="collection-desc" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="collection-desc"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCollectionForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Collection</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Collections Section */}
      <Card>
        <CardHeader>
          <CardTitle>Content Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Collection Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.name}>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell>{collection.collection_name}</TableCell>
                    <TableCell>{collection.description || 'No description'}</TableCell>
                  </TableRow>
                ))}
                {collections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No collections found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update the user table to use collections */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Collection</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={user.assigned_collections?.[0] || 'none'}
                        onValueChange={(value) => 
                          handleAssignCollection(user.email, value === 'none' ? '' : value)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder={
                            loading ? "Loading collections..." : "Select a collection"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Collection</SelectItem>
                          {collections.map((collection) => (
                            <SelectItem key={collection.name} value={collection.name}>
                              {collection.name} 
                              {collection.description && ` (${collection.description})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.role === 'admin'}
                          onCheckedChange={(checked) => handleToggleAdmin(user.email, checked)}
                          disabled={user.email === 'admin@example.com'}
                        />
                        <span>{user.role === 'admin' ? 'Yes' : 'No'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.email)}
                        disabled={user.email === 'admin@example.com'}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
