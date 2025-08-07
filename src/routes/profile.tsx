import { Button } from "@/components/ui/button";
import { auth } from "@/firebaseConfig";
import { signOut } from "@firebase/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: "/sign-in" });
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        throw navigate({ to: "/sign-in" });
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out: " + error.message);
      });
  };
  return (
    <div>
      Hello "/profile"!<Button onClick={() => handleSignOut()}>Sign out</Button>
    </div>
  );
}
