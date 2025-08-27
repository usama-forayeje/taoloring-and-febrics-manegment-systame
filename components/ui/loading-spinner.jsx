import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "md" }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
    }

    return (
        <div
            className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)}
        />
    )
}
