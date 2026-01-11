/**
 * Table Component
 * Reusable data table with sorting
 */
export default function Table({
    columns = [],
    data = [],
    sortField,
    sortOrder,
    onSort,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available'
}) {
    const handleSort = (field) => {
        if (!onSort) return

        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
        onSort(field, newOrder)
    }



    if (loading) {
        return (
            <div className="bg-white border border-neutral-200 rounded-sm p-8 text-center">
                <p className="text-neutral-500 text-sm">Loading...</p>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white border border-neutral-200 rounded-sm p-8 text-center">
                <p className="text-neutral-500 text-sm">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 overflow-hidden shadow-none">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={`
                    px-4 py-3
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-100 select-none group' : ''}
                    ${col.width ? col.width : ''}
                  `}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <span className={`text-slate-400 ${sortField === col.key ? 'text-slate-800' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {sortField === col.key && sortOrder === 'desc' ? '↓' : '↑'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`
                  hover:bg-slate-50 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-2.5 text-slate-700 font-medium"
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/**
 * Pagination Component
 */
export function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-xs text-slate-500 font-mono">
                PAGE {currentPage} / {totalPages}
            </p>
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <div className="px-2 py-1 text-xs font-mono text-slate-500 border border-transparent">
                    {currentPage}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
