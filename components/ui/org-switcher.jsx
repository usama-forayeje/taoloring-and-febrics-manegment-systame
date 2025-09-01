"use client";

import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import * as React from "react";
import { useTenant } from "@/providers/tenantContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function OrgSwitcher() {
  const { selectedTenant, tenants, switchTenant, loading } = useTenant();

  if (loading || !selectedTenant) {
    return null;
  }

  const handleTenantSwitch = (tenantId) => {
    switchTenant(tenantId);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none text-left">
                <span className="font-semibold">Current Shop</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedTenant?.name || "Select a shop"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => handleTenantSwitch(tenant.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{tenant.name}</span>
                    {tenant.address && (
                      <span className="text-xs text-muted-foreground">
                        {tenant.address}
                      </span>
                    )}
                  </div>
                </div>
                {selectedTenant?.id === tenant.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}