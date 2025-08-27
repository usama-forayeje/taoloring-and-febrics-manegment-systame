"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateUserRole } from "@/hooks/use-database"
import { MoreHorizontal, Edit, Trash2, Shield } from "lucide-react"

const roleColors = {
    superAdmin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    admin: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    tailor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    embroideryMan: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    stoneMan: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    user: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const roleLabels = {
    superAdmin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    tailor: "Tailor",
    embroideryMan: "Embroidery Specialist",
    stoneMan: "Stone Work Specialist",
    user: "User",
}

export function UserManagementTable({ users, shops }) {
    const [editingUser, setEditingUser] = useState(null)
    const [newRole, setNewRole] = useState("user")
    const [newShopId, setNewShopId] = useState("")
    const updateUserRole = useUpdateUserRole()

    const handleEditUser = (user) => {
        setEditingUser(user)
        setNewRole(user.role)
        setNewShopId(user.shopId || "")
    }

    const handleSaveChanges = () => {
        if (!editingUser) return

        updateUserRole.mutate(
            {
                userId: editingUser.$id,
                role: newRole,
                shopId: newShopId || undefined,
            },
            {
                onSuccess: () => {
                    setEditingUser(null)
                    setNewRole("")
                    setNewShopId("")
                },
            },
        )
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-foreground">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role")
                return (
                    <Badge variant="secondary" className={roleColors[role]}>
                        {roleLabels[role]}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "shopId",
            header: "Shop",
            cell: ({ row }) => {
                const shopId = row.getValue("shopId")
                const shop = shops.find((s) => s.$id === shopId)
                return shop ? (
                    <span className="text-sm">{shop.name}</span>
                ) : (
                    <span className="text-sm text-muted-foreground">No shop assigned</span>
                )
            },
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => {
                const phone = row.getValue("phone")
                return <span className="text-sm">{phone || "Not provided"}</span>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <>
            <Card className="premium-card">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user roles and shop assignments</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={users} searchKey="name" searchPlaceholder="Search users..." />
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user role and shop assignment</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">User</label>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-xs font-medium text-primary-foreground">
                                            {editingUser.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{editingUser.name}</p>
                                        <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select value={newRole} onValueChange={setNewRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="superAdmin">Super Admin</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="tailor">Tailor</SelectItem>
                                        <SelectItem value="embroideryMan">Embroidery Specialist</SelectItem>
                                        <SelectItem value="stoneMan">Stone Work Specialist</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shop Assignment</label>
                                <Select value={newShopId} onValueChange={setNewShopId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select shop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No shop assigned</SelectItem>
                                        {shops.map((shop) => (
                                            <SelectItem key={shop.$id} value={shop.$id}>
                                                {shop.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} disabled={updateUserRole.isPending}>
                            {updateUserRole.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
