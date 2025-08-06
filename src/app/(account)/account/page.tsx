import { Suspense } from "react";
import Account from "@/general/components/auth/account";

// Loading component for the account page
function AccountLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">Loading...</h2>
          <p className="text-slate-400">Preparing your account page</p>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <Account />
    </Suspense>
  );
}
