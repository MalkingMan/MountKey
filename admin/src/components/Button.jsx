/**
 * Button Component
 * Flat, minimal button styles
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    onClick,
    className = ''
}) {
    // Enterprise Style: Compact, High Contrast, No Shadows
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-sm border transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-slate-800 text-white border-transparent hover:bg-slate-900 active:bg-black',
        secondary: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400',
        danger: 'bg-red-700 text-white border-transparent hover:bg-red-800 active:bg-red-900',
        ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900',
    }

    const sizes = {
        sm: 'px-2.5 py-1 text-xs',      // Ultra compact
        md: 'px-3 py-1.5 text-xs',     // Standard enterprise
        lg: 'px-4 py-2 text-sm',       // Prominent actions
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}
