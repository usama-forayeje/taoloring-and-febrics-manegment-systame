"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useShops, useCreateShop } from "@/hooks/use-database"
import { useShopStore } from "@/hooks/use-shop-store"
import { useAuth } from "@/hooks/use-auth"

export function ShopSwitcher() {
  const [open, setOpen] = useState(false)
  const [showNewShopDialog, setShowNewShopDialog] = useState(false)
  const [newShopName, setNewShopName] = useState("")
  const [newShopAddress, setNewShopAddress] = useState("")
  const [newShopContact, setNewShopContact] = useState("")

  const { user } = useAuth()
  const { data: shops } = useShops()
  const { selectedShopId, setSelectedShopId } = useShopStore()
  const createShopMutation = useCreateShop()

  const isAdmin = user?.role === "superAdmin" || user?.role === "admin"
  const isManager = user?.role === "manager"

  const availableShops = isManager && user?.shopId ? shops?.filter((shop) => shop.$id === user.shopId) : shops

  const currentShop = availableShops?.find((shop) => shop.$id === selectedShopId)

  const handleCreateShop = () => {
    if (!newShopName.trim()) return

    createShopMutation.mutate(
      {
        name: newShopName,
        address: newShopAddress,
        contact: newShopContact,
      },
      {
        onSuccess: () => {
          setShowNewShopDialog(false)
          setNewShopName("")
          setNewShopAddress("")
          setNewShopContact("")
        },
      },
    )
  }

  return (
    <Dialog open={showNewShopDialog} onOpenChange={setShowNewShopDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a shop"
            className="w-full justify-between bg-sidebar-accent/50 border-sidebar-border hover:bg-sidebar-accent"
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="truncate">{currentShop ? currentShop.name : isAdmin ? "All Shops" : "Select Shop"}</span>
            </div>
            {!(isManager && availableShops?.length === 1) && (
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search shops..." />
            <CommandList>
              <CommandEmpty>No shops found.</CommandEmpty>
              <CommandGroup heading="Shops">
                {isAdmin && (
                  <CommandItem
                    onSelect={() => {
                      setSelectedShopId(null)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    All Shops
                    <Check className={cn("ml-auto h-4 w-4", !selectedShopId ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                )}
                {availableShops?.map((shop) => (
                  <CommandItem
                    key={shop.$id}
                    onSelect={() => {
                      setSelectedShopId(shop.$id)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    {shop.name}
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedShopId === shop.$id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {isAdmin && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false)
                          setShowNewShopDialog(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Shop
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Shop</DialogTitle>
          <DialogDescription>Add a new shop to your tailoring business.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input
              id="name"
              placeholder="Enter shop name"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter shop address"
              value={newShopAddress}
              onChange={(e) => setNewShopAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              placeholder="Enter contact information"
              value={newShopContact}
              onChange={(e) => setNewShopContact(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewShopDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateShop} disabled={!newShopName.trim() || createShopMutation.isPending}>
            {createShopMutation.isPending ? "Creating..." : "Create Shop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
