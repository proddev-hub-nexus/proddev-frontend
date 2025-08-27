"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setStatus("failed");
      setMessage("No transaction reference found.");
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/payment/verify?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          // optionally: redirect after 3s
          setTimeout(() => router.push("/courses"), 3000);
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (err: any) {
        setStatus("failed");
        setMessage(err.message || "Something went wrong.");
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      {status === "loading" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <div className="text-green-600 font-bold">{message}</div>
      )}
      {status === "failed" && (
        <div className="text-red-600 font-bold">{message}</div>
      )}
    </div>
  );
}
