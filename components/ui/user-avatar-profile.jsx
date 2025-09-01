import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatarProfile({ user, showInfo, className, ...props }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      {showInfo && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      )}
    </div>
  );
}
