import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold">
                  Create your account in MoJiAuthJWT
                </h1>
                <p className="text-muted-foreground text-balance">
                  Welcome aboard! Please fill in the information below to create
                </p>
              </div>
              {/* First Name & Last Name  */}
              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full"
                  />
                  {/* error message */}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full"
                  />
                  {/* error message */}
                </div>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full"
                />
                {/* error message */}
              </div>

              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@test.com"
                  className="w-full"
                />
                {/* error message */}
              </div>

              {/* password  */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full"
                />
                {/* error message */}
              </div>

              {/* sign up button */}
              <Button className="w-full" type="submit">
                Create Account
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-primary underline underline-offset-4"
                >
                  Sign In
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
