"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"


export const useShopStore = create()(
    persist(
        (set) => ({
            selectedShopId: null,
            setSelectedShopId: (shopId) => set({ selectedShopId: shopId }),
        }),
        {
            name: "shop-store",
        },
    ),
)
