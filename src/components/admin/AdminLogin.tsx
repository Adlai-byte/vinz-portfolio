"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface border border-border rounded-lg p-8">
          <h1 className="text-xl font-bold text-text-primary mb-1">Admin Login</h1>
          <p className="text-sm text-text-dimmed mb-6">
            Enter the admin password to continue.
          </p>

          <form action={formAction}>
            <label htmlFor="password" className="block text-sm text-text-muted mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50 mb-4"
              placeholder="Enter password..."
            />

            {state?.error && (
              <p className="text-red-400 text-sm mb-4">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 px-4 bg-text-primary text-background font-medium rounded-md hover:bg-text-muted transition-colors disabled:opacity-50"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
