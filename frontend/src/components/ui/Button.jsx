import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 disabled:hover:bg-indigo-600",
  secondary:
    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 disabled:hover:bg-zinc-800",
  danger:
    "bg-red-600 text-white hover:bg-red-500 disabled:hover:bg-red-600",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 disabled:hover:bg-emerald-600",
  ghost:
    "bg-transparent text-zinc-300 hover:bg-zinc-800 disabled:hover:bg-transparent",
};

const Button = ({
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
