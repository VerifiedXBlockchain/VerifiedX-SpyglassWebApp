interface LoadingSpinnerProps {
  variant?: "primary" | "light" | "secondary" | "success" | "danger" | "warning" | "info";
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ 
  variant = "primary", 
  message = "Loading...", 
  size = "md",
  className = ""
}: LoadingSpinnerProps) => {
  const sizeClass = size === "sm" ? "spinner-border-sm" : "";
  
  return (
    <div className={`spinner-border text-${variant} ${sizeClass} ${className}`} role="status">
      <span className="visually-hidden">{message}</span>
    </div>
  );
};
