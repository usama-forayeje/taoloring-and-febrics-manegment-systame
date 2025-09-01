"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

const TenantContext = createContext()

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

export function TenantProvider({ children }) {
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize tenants (you can fetch from API)
  useEffect(() => {
    const initializeTenants = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTenants = [
          { 
            id: "1", 
            name: "Main Shop", 
            address: "123 Main St",
            contact: "+880-123-456-789"
          },
          { 
            id: "2", 
            name: "Branch Shop A", 
            address: "456 Oak Ave",
            contact: "+880-987-654-321"
          },
          { 
            id: "3", 
            name: "Branch Shop B", 
            address: "789 Pine Rd",
            contact: "+880-555-123-456"
          },
          { 
            id: "4", 
            name: "Branch Shop C", 
            address: "321 Market St",
            contact: "+880-777-888-999"
          },
        ]

        setTenants(mockTenants)
        
        // Get saved tenant from localStorage or default to first
        const savedTenantId = localStorage.getItem('selectedTenantId')
        const defaultTenant = savedTenantId 
          ? mockTenants.find(t => t.id === savedTenantId) || mockTenants[0]
          : mockTenants[0]
          
        setSelectedTenant(defaultTenant)
        
      } catch (error) {
        console.error("Failed to initialize tenants:", error)
        toast.error("Failed to load shops")
      } finally {
        setLoading(false)
      }
    }

    initializeTenants()
  }, [])

  const switchTenant = useCallback((tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      setSelectedTenant(tenant)
      localStorage.setItem('selectedTenantId', tenantId)
      toast.success(`Switched to ${tenant.name}`)
      
      // Trigger a page refresh to reload all data for new tenant
      window.location.reload()
    }
  }, [tenants])

  const value = {
    selectedTenant,
    tenants,
    loading,
    switchTenant,
    currentShopId: selectedTenant?.id,
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}