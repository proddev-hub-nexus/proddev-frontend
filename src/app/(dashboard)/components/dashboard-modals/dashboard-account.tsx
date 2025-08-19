"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/general/components/ui/dialog";
import { Badge } from "@/general/components/ui/badge";
import { useAuthStore } from "@/general/store/auth-store";

export default function DashboardAccount() {
  const { user } = useAuthStore();

  return (
    <Dialog>
      <DialogTrigger className="w-full text-left rounded px-2 py-1 hover:bg-accent">
        Account
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your account</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full grid place-items-center bg-muted font-medium">
              {user?.full_name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <div className="font-medium">{user?.full_name ?? "User"}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={user?.is_verified ? "default" : "secondary"}>
              {user?.is_verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Member since:{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "—"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
