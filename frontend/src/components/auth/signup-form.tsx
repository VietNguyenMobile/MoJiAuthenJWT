import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Connect from zod to react-hook-form
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    // Handle form submission, e.g., send data to the server
    console.log("Form Data:", data);
    const { firstname, lastname, username, email, password } = data;

    await signUp(username, password, email, firstname, lastname);
    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
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
                    {...register("firstname")}
                  />
                  {/* error message */}
                  {errors.firstname && (
                    <p className="text-sm text-destructive">
                      {errors.firstname.message}
                    </p>
                  )}
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
                    {...register("lastname")}
                  />
                  {/* error message */}
                  {errors.lastname && (
                    <p className="text-sm text-destructive">
                      {errors.lastname.message}
                    </p>
                  )}
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
                  {...register("username")}
                />
                {/* error message */}
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
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
                  {...register("email")}
                />
                {/* error message */}
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
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
                  {...register("password")}
                />
                {/* error message */}
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* sign up button */}
              <Button className="w-full" type="submit" disabled={isSubmitting}>
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
      <div className="px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 text-xs text-balance">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
