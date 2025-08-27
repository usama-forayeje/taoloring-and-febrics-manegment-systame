"use client"

import { Button } from "@/components/ui/button"
import { Clock, MessageSquare, User, FileText } from "lucide-react"
import { motion } from "framer-motion"

export function WorkerQuickActions() {
    const actions = [
        { label: "Check In/Out", icon: Clock, variant: "default" },
        { label: "Update Task", icon: FileText, variant: "outline" },
        { label: "Contact Manager", icon: MessageSquare, variant: "outline" },
        { label: "Profile", icon: User, variant: "outline" },
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
