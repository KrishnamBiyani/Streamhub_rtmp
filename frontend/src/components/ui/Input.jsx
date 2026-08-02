import { useId } from "react";

const Input = ({
  label,
  id,
  icon: Icon,
  rightElement,
  error,
  type = "text",
  className = "",
  containerClassName = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus:border-indigo-500 ${
            Icon ? "pl-10" : ""
          } ${rightElement ? "pr-10" : ""} ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
