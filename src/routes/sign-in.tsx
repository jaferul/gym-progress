import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): { newUser?: boolean } => {
    return {
      newUser: (search.newUser as boolean) || undefined,
    };
  },
  component: SignInPage,
});

function SignInPage() {
  const { newUser } = Route.useSearch();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {newUser ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
}
