/**
 * Select Component
 * Clean dropdown select
 */
export default function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
          w-full px-3 py-2 text-sm
          border rounded-sm
          bg-white text-neutral-900
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-neutral-300'}
          focus:border-blue-500 focus:ring-0
        `}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}
