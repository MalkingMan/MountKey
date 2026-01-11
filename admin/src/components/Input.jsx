/**
 * Input Component
 * Clean, minimal form input
 */
export default function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    className = ''
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-neutral-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`
          w-full px-3 py-2 text-sm
          border rounded-sm transition-colors duration-100
          bg-white text-slate-900 icon-none
          placeholder-slate-400
          disabled:bg-slate-50 disabled:text-slate-500
          ${error
                        ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                        : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600'}
          outline-none shadow-none
        `}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}
