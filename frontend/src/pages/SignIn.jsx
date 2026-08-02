import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signin, isSigningIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-50">
          Sign in to StreamHub
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-400">
          Welcome back. Enter your details to continue.
        </p>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email"
              id="signin-email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              id="signin-password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-2 -m-2 text-zinc-500 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              loading={isSigningIn}
              className="w-full"
            >
              {isSigningIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
