import {
  IconFlask,
  IconArrowRight,
  IconMailExclamation,
  IconSend,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { sendEmailVerification } from "@firebase/auth";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";

const HIDDEN_PATHS = ["/sign-in", "/profile"];

export function DemoBanner() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (
    HIDDEN_PATHS.includes(pathname) ||
    (isAuthenticated && user?.emailVerified)
  )
    return null;

  const handleResendVerification = () => {
    if (!user) return;
    sendEmailVerification(user)
      .then(() => {
        toast("Verification email sent", {
          description: `Check your inbox at ${user.email}`,
        });
      })
      .catch((error) => {
        toast.error(`Failed to send verification email: ${error.message}`);
      });
  };

  // Authenticated + unverified email
  if (isAuthenticated && user && !user.emailVerified) {
    return (
      <div className="relative overflow-hidden border-b border-red-200/60 bg-red-50/80 dark:border-red-500/20 dark:bg-red-950/30">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)",
          }}
        />
        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 lg:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-500/15 dark:bg-red-400/15">
              <IconMailExclamation className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-800 dark:text-red-200 truncate">
              <span className="font-semibold">Email not verified</span>
              <span className="hidden sm:inline">
                {" "}
                — Please verify your email to unlock all features.
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleResendVerification}
              className="cursor-pointer group hidden sm:flex shrink-0 items-center gap-1.5 rounded-md border border-red-300 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-200 dark:border-red-500/30 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
            >
              <IconSend className="h-3 w-3" />
              Resend email
            </button>
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="cursor-pointer group flex shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-700 hover:gap-2.5 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
            >
              Go to profile
              <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  return (
    <div className="relative overflow-hidden border-b border-amber-200/60 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-950/30">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)",
        }}
      />
      <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/15 dark:bg-amber-400/15">
            <IconFlask className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Demo mode</span>
            <span className="block text-xs sm:text-sm sm:inline">
              <span className="hidden sm:inline"> — </span>
              You're viewing sample data. Sign in to start tracking your own
              progress.
            </span>
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/sign-in" })}
          className="cursor-pointer group flex shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-amber-700 hover:gap-2.5 dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400"
        >
          Get started
          <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
