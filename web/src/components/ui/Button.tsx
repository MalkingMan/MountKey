import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

        const variants = {
            primary:
                "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900",
            secondary:
                "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-500",
            ghost:
                "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500",
        };

        const sizes = {
            sm: "text-sm px-4 py-2",
            md: "text-sm px-5 py-2.5",
            lg: "text-base px-6 py-3",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
