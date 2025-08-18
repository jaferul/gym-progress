import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

const ResetPasswordCard = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast("Reset password email sent", {
          description: `A reset password email has been sent to ${email}. Please check your inbox.`,
          action: {
            label: "OK",
            onClick: () => {},
          },
        });
        setEmail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(
          `Error sending reset password email: ${errorMessage} \n Error code: ${errorCode}`,
        );
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Please enter your email address and we will send you a link to reset
          your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <Button disabled={!email} type="submit" className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Link
          className="inline-block text-sm underline-offset-4 hover:underline"
          from="/sign-in"
          search={(prev) => ({ ...prev, resetPassword: undefined })}
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordCard;
