import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-background)",
  },
  secondary: {
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-text-muted)",
  },
};

export function Button({
  variant = "primary",
  className = "",
  children,
  style,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
