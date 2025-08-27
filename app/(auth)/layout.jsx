"use client"
import { motion } from "framer-motion"
import { Crown } from "lucide-react"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg mb-4">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Ladies Tailoring</h1>
          <p className="text-muted-foreground">Shop Management System</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
