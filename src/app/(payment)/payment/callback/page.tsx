"use client";

import { Suspense } from "react";
import CallbackContent from "../callback-content";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<p>Loading payment status...</p>}>
      <CallbackContent />
    </Suspense>
  );
}
