import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// import samurai from "../assets/samurai.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            Create your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-white">
                  Full Name
                </span>
              </label>
              <div className="relative border rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-white/60" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 h-14 text-lg bg-black text-white placeholder-white/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-white">Email</span>
              </label>
              <div className="relative border rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-white/60" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 h-14 text-lg bg-black text-white placeholder-white/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-white">
                  Password
                </span>
              </label>
              <div className="relative border rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-white/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 h-14 text-lg bg-black text-white placeholder-white/70 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-white/60"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className={`btn w-full border border-white rounded-md font-serif font-semibold h-14 text-lg transition duration-300 cursor-pointer ${
                isSigningUp
                  ? "bg-gray-700 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
              }`}
            >
              {isSigningUp ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-white/70 text-lg">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-400 font-semibold hover:text-blue-500 transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Samurai Image (optional) */}
      {/* <div className="relative hidden md:flex flex-1 items-center justify-center bg-gray-900">
        <img
          src={samurai}
          alt="Samurai"
          className="absolute bottom-0 max-h-[100vh] select-none rotate-y-180"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div> */}
    </div>
  );
};

export default SignUp;
