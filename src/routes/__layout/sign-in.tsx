import { LoginForm } from "@/components/login-form";
import ResetPasswordCard from "@/components/ResetPasswordCard";
import { SignupForm } from "@/components/signup-form";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout/sign-in")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { newUser?: boolean; resetPassword?: boolean } => {
    return {
      newUser: (search.newUser as boolean) || undefined,
      resetPassword: (search.resetPassword as boolean) || undefined,
    };
  },
  component: SignInPage,
});

function SignInPage() {
  const { newUser, resetPassword } = Route.useSearch();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {resetPassword ? (
          <ResetPasswordCard />
        ) : newUser ? (
          <SignupForm />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
