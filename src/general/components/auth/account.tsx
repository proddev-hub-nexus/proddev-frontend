"use client";
import type React from "react";
import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/general/components/ui/tabs";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/general/components/ui/input";
import { Label } from "@/general/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Account = () => {
  const router = useRouter();
  const { register, login } = useAuthActions();
  const { isLoading, error } = useAuthStore();

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      if (error.message?.includes("verification")) {
        toast.info(
          "📧 Email not verified. A new verification link has been sent to your email."
        );
      } else if (error.message?.includes("Invalid")) {
        toast.error("❌ Invalid email or password.");
      } else {
        toast.error("❌ Login failed. Please try again.");
      }
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }
    try {
      await register({
        full_name: registerData.full_name,
        email: registerData.email,
        password: registerData.password,
      });
      toast.success(
        "✅ Account created! Please check your email for verification."
      );
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("❌ Email is already registered.");
      } else {
        toast.error("❌ Registration failed. Please try again.");
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <Card className="bg-card/80 border-border backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Access your learning dashboard or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted border-border">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2.5 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.full_name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            full_name: e.target.value,
                          })
                        }
                        className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-confirm-password"
                      className="text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2.5 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Account;
