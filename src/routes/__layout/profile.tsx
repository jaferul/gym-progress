import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/firebaseConfig";
import { AVATAR_OPTIONS, getAvatarById } from "@/lib/avatars";
import { sendEmailVerification, updateProfile } from "@firebase/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { doc, setDoc } from "firebase/firestore";
import { AlertCircleIcon, CheckIcon, PencilIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/__layout/profile")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: "/sign-in" });
  },
});

function RouteComponent() {
  const { user, goalCalories, displayName, avatarId } = useAuth();

  const [name, setName] = useState(displayName);
  const [calories, setCalories] = useState(goalCalories || "");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

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

  const handleAvatarSelect = async (newAvatarId: string) => {
    try {
      if (!user || !user.uid || !user.emailVerified) return;
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { avatarId: newAvatarId }, { merge: true });
      setAvatarDialogOpen(false);
      toast.success("Avatar updated!");
    } catch (error: any) {
      toast.error(`Failed to update avatar: ${error.message}`);
    }
  };

  const currentAvatar = getAvatarById(avatarId);

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl flex flex-col items-center">
        <div className="mb-8 flex items-center gap-6">
          <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group relative w-20 h-20 aspect-square shrink-0 rounded-full overflow-hidden ring-2 ring-border shadow-lg cursor-pointer transition-all duration-200 hover:ring-primary hover:shadow-xl"
              >
                {currentAvatar ? (
                  currentAvatar.icon
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <UserIcon className="size-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded-full">
                  <PencilIcon
                    className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md"
                    strokeWidth={2.5}
                  />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Choose your avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = avatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar.id)}
                      className={`
                        group/avatar relative flex flex-col items-center gap-1.5 rounded-xl p-2.5
                        transition-all duration-200 ease-out cursor-pointer
                        ${
                          isSelected
                            ? "bg-primary/10 ring-2 ring-primary shadow-sm"
                            : "hover:bg-muted/60 ring-1 ring-transparent hover:ring-border"
                        }
                      `}
                    >
                      <div
                        className={`
                          relative size-14 rounded-full overflow-hidden
                          transition-transform duration-200 ease-out
                          ${isSelected ? "scale-105" : "group-hover/avatar:scale-105"}
                        `}
                      >
                        {avatar.icon}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <CheckIcon
                              className="size-5 text-white drop-shadow-md"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                      <span
                        className={`
                          text-xs font-medium transition-colors duration-150
                          ${isSelected ? "text-primary" : "text-muted-foreground group-hover/avatar:text-foreground"}
                        `}
                      >
                        {avatar.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
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
