import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [goalCalories, setGoalCalories] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [seePasswordToggle, setSeePasswordToggle] = useState(false);
  const [seeConfirmPasswordToggle, setSeeConfirmPasswordToggle] =
    useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await Promise.all([
        setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          goalCalories: Number(goalCalories) || 0,
        }),
        updateProfile(user, {
          displayName: name,
        }),
      ]);

      sendEmailVerification(user).then(() => {
        toast("Verify your email", {
          description: `A verification email has been sent to ${user.email}. Please check your inbox.`,
          action: {
            label: "OK",
            onClick: () => {},
          },
        });
      });

      navigate({ to: "/profile" });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(
        `Error signing up: ${errorMessage} \n Error code: ${errorCode}`,
      );
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={seePasswordToggle ? "text" : "password"}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password?.length > 0 && (
                    <EyeIcon
                      role="button"
                      onClick={() => setSeePasswordToggle(!seePasswordToggle)}
                      height={20}
                      width={20}
                      className="absolute top-[8px] right-[8px] cursor-pointer z-2 hover:bg-primary/40"
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={seeConfirmPasswordToggle ? "text" : "password"}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword?.length > 0 && (
                    <EyeIcon
                      role="button"
                      height={20}
                      width={20}
                      className="absolute top-[8px] right-[8px] cursor-pointer z-2 hover:bg-primary/40"
                      onClick={() =>
                        setSeeConfirmPasswordToggle(!seeConfirmPasswordToggle)
                      }
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="goalCalories">Calories goal</Label>
                <Input
                  id="goalCalories"
                  type="number"
                  required
                  onChange={(e) => setGoalCalories(e.target.value)}
                />
              </div>
              {error && (
                <div className="py-2 text-center text-sm bg-[#9c2b2e] border-[#e84e4f] rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? <Spinner className="h-4 w-4" /> : "Create account"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                className="underline underline-offset-4"
                from="/sign-in"
                search={(prev) => ({ ...prev, newUser: undefined })}
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
