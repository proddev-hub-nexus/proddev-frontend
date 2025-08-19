"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/general/store/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/general/components/ui/input";
import { Label } from "@/general/components/ui/label";
import { Switch } from "@/general/components/ui/switch";
import { Separator } from "@/general/components/ui/separator";
import {
  Copy,
  Check,
  Shield,
  Bell,
  User as UserIcon,
  Trash2,
  LogOut,
} from "lucide-react";

export default function DashboardSettings() {
  const user = useAuthStore((s) => s.user);

  // Profile form state (simple local state; wire to your API later)
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security form state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Notifications (local toggles for now)
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyTips, setNotifyTips] = useState(false);
  const [savingNotify, setSavingNotify] = useState(false);

  async function onSaveProfile() {
    try {
      setSavingProfile(true);
      // TODO: call your API to update profile
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn’t save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSavePassword() {
    if (!currentPw || !newPw) {
      toast.error("Please fill current & new password");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setSavingPw(true);
      // TODO: call your API to change password
      await new Promise((r) => setTimeout(r, 800));
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password updated");
    } catch {
      toast.error("Couldn’t update password");
    } finally {
      setSavingPw(false);
    }
  }

  async function onSaveNotifications() {
    try {
      setSavingNotify(true);
      // TODO: call your API to persist notification prefs
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Couldn’t save preferences");
    } finally {
      setSavingNotify(false);
    }
  }

  function copyUserId() {
    const id = user?.user_id ?? "";
    if (!id) return;
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success("User ID copied"))
      .catch(() => toast.error("Could not copy User ID"));
  }

  function signOutAllDevices() {
    // TODO: wire to backend revoke-all-tokens endpoint
    toast.info("We’ll sign you out on all devices (feature coming soon).");
  }

  function deleteAccount() {
    // TODO: wire to backend delete-account endpoint (require re-auth)
    toast("Delete account?", {
      description: "This action is permanent.",
      action: {
        label: "Confirm",
        onClick: () => toast.success("Request submitted (demo)"),
      },
      cancel: { label: "Cancel" },
      duration: 8000,
    });
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, security, and notifications.
          </p>
        </div>
        {user?.user_id ? (
          <Button variant="outline" onClick={copyUserId} className="gap-2">
            <Copy className="w-4 h-4" /> Copy User ID
          </Button>
        ) : null}
      </div>

      {/* Profile */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (read-only)</Label>
              <Input id="email" value={user?.email ?? ""} readOnly />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSaveProfile}
              disabled={savingProfile}
              className="gap-2"
            >
              {savingProfile ? (
                <Check className="w-4 h-4 animate-pulse" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="current_pw">Current password</Label>
              <Input
                id="current_pw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_pw">New password</Label>
              <Input
                id="new_pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_pw">Confirm new</Label>
              <Input
                id="confirm_pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSavePassword}
              disabled={savingPw}
              className="gap-2"
            >
              {savingPw ? (
                <Check className="w-4 h-4 animate-pulse" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email updates</div>
                <div className="text-sm text-muted-foreground">
                  Enrollment receipts and course reminders.
                </div>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">WhatsApp notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get enrollment confirmations in WhatsApp.
                </div>
              </div>
              <Switch
                checked={notifyWhatsapp}
                onCheckedChange={setNotifyWhatsapp}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tips & updates</div>
                <div className="text-sm text-muted-foreground">
                  Product tips and new course announcements.
                </div>
              </div>
              <Switch checked={notifyTips} onCheckedChange={setNotifyTips} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSaveNotifications}
              disabled={savingNotify}
              className="gap-2"
            >
              {savingNotify ? (
                <Check className="w-4 h-4 animate-pulse" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium">Sign out of all devices</div>
            <div className="text-sm text-muted-foreground">
              Revoke access tokens and log out everywhere.
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOutAllDevices}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign out everywhere
          </Button>
        </CardContent>
        <Separator />
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium text-destructive">Delete account</div>
            <div className="text-sm text-muted-foreground">
              Permanently remove your account and data.
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={deleteAccount}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
