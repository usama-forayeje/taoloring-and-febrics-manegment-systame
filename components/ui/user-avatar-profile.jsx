import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatarProfile({ user, showInfo, className, ...props }) {
  const displayName = user?.name || user?.email || "Unknown"
  const initials = displayName.charAt(0).toUpperCase()
  const displayEmail = user?.email || ""

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar>
        <AvatarImage src={user?.imageUrl} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {showInfo && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-xs text-muted-foreground">{displayEmail}</span>
        </div>
      )}
    </div>
  )
}
