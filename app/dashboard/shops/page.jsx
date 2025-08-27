"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Store, MapPin, Phone, Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useShops, useCreateShop, useUpdateShop, useDeleteShop, useUsers } from "@/hooks/use-database"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFormState } from "react-hook-form"

export default function ShopsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingShop, setEditingShop] = useFormState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  })

  const { user } = useAuth()
  const { data: shops, isLoading } = useShops()
  const { data: users } = useUsers()
  const createShopMutation = useCreateShop()
  const updateShopMutation = useUpdateShop()
  const deleteShopMutation = useDeleteShop()

  const isAdmin = user?.role === "superAdmin" || user?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to manage shops.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) return

    if (editingShop) {
      updateShopMutation.mutate(
        {
          id: editingShop.$id,
          data: formData,
        },
        {
          onSuccess: () => {
            setEditingShop(null)
            setFormData({ name: "", address: "", contact: "" })
          },
        },
      )
    } else {
      createShopMutation.mutate(formData, {
        onSuccess: () => {
          setShowCreateDialog(false)
          setFormData({ name: "", address: "", contact: "" })
        },
      })
    }
  }

  const handleEdit = (shop) => {
    setEditingShop(shop)
    setFormData({
      name: shop.name,
      address: shop.address || "",
      contact: shop.contact || "",
    })
  }

  const handleDelete = (shopId) => {
    if (confirm("Are you sure you want to delete this shop?")) {
      deleteShopMutation.mutate(shopId)
    }
  }

  const getShopUserCount = (shopId) => {
    return users?.filter((user) => user.shopId === shopId).length || 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
          <p className="text-muted-foreground">Manage your tailoring shops and locations</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shop</DialogTitle>
              <DialogDescription>Add a new shop location to your business.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input
                  id="name"
                  placeholder="Enter shop name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter shop address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  placeholder="Enter contact information"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.name.trim() || createShopMutation.isPending}>
                {createShopMutation.isPending ? "Creating..." : "Create Shop"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops?.map((shop, index) => (
          <motion.div
            key={shop.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{shop.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {getShopUserCount(shop.$id)}
                  </Badge>
                </div>
                <CardDescription>Shop ID: {shop.$id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {shop.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{shop.address}</span>
                  </div>
                )}
                {shop.contact && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{shop.contact}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(shop)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(shop.$id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Shop Dialog */}
      <Dialog open={!!editingShop} onOpenChange={() => setEditingShop(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>Update shop information and settings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Shop Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter shop name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                placeholder="Enter shop address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact</Label>
              <Input
                id="edit-contact"
                placeholder="Enter contact information"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingShop(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim() || updateShopMutation.isPending}>
              {updateShopMutation.isPending ? "Updating..." : "Update Shop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
