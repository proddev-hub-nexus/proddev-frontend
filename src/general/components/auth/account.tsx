"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/general/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { SignInForm } from "./sign-in";
import { SignUpForm } from "./sign-up";

const Account = () => {
  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-xl rounded-2xl">
      <CardHeader className="text-center space-y-3 pb-5">
        {/* Logo container */}
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl tracking-wide">P</span>
        </div>

        {/* Title */}
        <CardTitle className="text-2xl font-extrabold text-slate-100 tracking-tight">
          ProdDev Hub
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-slate-400 text-sm">
          Sign in to continue or create a new account
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <Tabs defaultValue="signin" className="w-full">
          {/* Tabs */}
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 p-1 rounded-md border border-slate-700">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white 
               text-slate-300 font-medium py-2 rounded-sm border-0 shadow-none"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white 
               text-slate-300 font-medium py-2 rounded-sm border-0 shadow-none"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* Sign In Content */}
          <TabsContent value="signin">
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-100">
                  Welcome back
                </h3>
                <p className="text-sm text-slate-400">
                  Continue your learning journey
                </p>
              </div>
              <SignInForm />
            </div>
          </TabsContent>

          {/* Sign Up Content */}
          <TabsContent value="signup">
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-100">
                  Create your account
                </h3>
                <p className="text-sm text-slate-400">
                  Start your professional development journey
                </p>
              </div>
              <SignUpForm />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Account;
