"use client"

import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Package, FileText } from "lucide-react"
import { motion } from "framer-motion"

export function QuickActions() {
    const actions = [
        { label: "New Order", icon: Plus, variant: "default" },
        { label: "Add Customer", icon: UserPlus, variant: "outline" },
        { label: "Add Product", icon: Package, variant: "outline" },
        { label: "Generate Report", icon: FileText, variant: "outline" },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
                <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Button variant={action.variant} size="sm" className="gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.label}
                    </Button>
                </motion.div>
            ))}
        </div>
    )
}
