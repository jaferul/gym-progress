import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/firebaseConfig";
import { sendEmailVerification, updateProfile } from "@firebase/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { doc, setDoc } from "firebase/firestore";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/__layout/profile")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: "/sign-in" });
  },
});

function RouteComponent() {
  const { user, goalCalories, displayName } = useAuth();

  const [name, setName] = useState(displayName);
  const [calories, setCalories] = useState(goalCalories || "");

  useEffect(() => {
    setName(displayName);
    setCalories(goalCalories || "");
  }, [displayName, goalCalories]);

  const handleProfileUpdate = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error("User must be logged in to update profile.");
      }

      if (!user.emailVerified) {
        throw new Error("Email must be verified to update profile.");
      }

      await updateProfile(user, {
        displayName: name,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          displayName: name,
          goalCalories: Number(calories),
        },
        { merge: true },
      );

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  const handleEmailVerification = () => {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          toast("New verification email", {
            description: `A new verification email has been sent to ${user.email}. Please check your inbox.`,
            action: {
              label: "OK",
              onClick: () => {},
            },
          });
        })
        .catch((error) => {
          toast.error(
            `Error sending verification email to: ${user.email} \n ${error.message}`,
          );
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl flex flex-col items-center">
        <div className="mb-8 flex items-center gap-6">
          <Avatar className="relative flex shrink-0 overflow-hidden rounded-full size-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Pick a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  value={user?.email || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goalCalories">Calories goal</Label>
                <Input
                  id="goalCalories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleProfileUpdate}>
              Save changes
            </Button>
          </CardFooter>
        </Card>
        {user && !user.emailVerified && (
          <Alert variant="destructive" className="w-full max-w-xl mt-6">
            <AlertCircleIcon />
            <AlertTitle>Verify your email</AlertTitle>
            <AlertDescription>
              <p>
                Please verify your email in order to use the features of this
                website.
              </p>
              <ul className="list-inside list-disc text-sm">
                <li>
                  Check your inbox for the verification email including the spam
                  folder
                </li>
                <li>Follow the link provided to verify your email</li>
                <li>You can request a new link using the button below</li>
              </ul>
              <Button className="w-auto mt-6" onClick={handleEmailVerification}>
                Request new verification email
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
