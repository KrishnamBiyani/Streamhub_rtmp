import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-50">
          Create your account
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-400">
          Start streaming to YouTube or StreamHub in minutes.
        </p>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Full name"
              id="signup-fullname"
              type="text"
              icon={User}
              placeholder="John Doe"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              id="signup-email"
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
              id="signup-password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="••••••••"
              autoComplete="new-password"
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

            <Button type="submit" loading={isSigningUp} className="w-full">
              {isSigningUp ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-indigo-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
