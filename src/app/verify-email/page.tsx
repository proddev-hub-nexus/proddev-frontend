"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setMessage("No verification token found");
      return;
    }

    api(`/auth/verify-email?token=${token}`)
      .then((res) => {
        console.log("Success response:", res);
        setMessage("✅ Email verified successfully!");
        setTimeout(() => router.push("/"), 2000);
      })
      .catch((err) => {
        console.log("Error response:", JSON.stringify(err));
        setMessage("❌ Verification failed. Try again.");
      });
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">{message}</p>
    </div>
  );
}
