/**
 * Modal Component
 * Simple modal dialog
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer
}) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-sm shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-neutral-200">
                    <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
                </div>

                {/* Content */}
                <div className="px-4 py-4 max-h-96 overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-4 py-3 border-t border-neutral-200 flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
