import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table, { Pagination } from '../components/Table'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getMountains, deleteMountain } from '../services/api'

/**
 * Mountains List Page
 * Table view with CRUD actions and search
 */
export default function Mountains() {
    const navigate = useNavigate()
    const [mountains, setMountains] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Search
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Sorting
    const [sortField, setSortField] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')

    // Delete modal
    const [deleteModal, setDeleteModal] = useState({ open: false, mountain: null })

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1) // Reset to first page when searching
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        loadMountains()
    }, [page, sortField, sortOrder, debouncedSearch])

    const loadMountains = async () => {
        setLoading(true)
        setError('')

        try {
            const params = {
                page,
                sort: sortField,
                order: sortOrder,
                limit: 20
            }

            // Add search parameter if provided
            if (debouncedSearch.trim()) {
                params.search = debouncedSearch.trim()
            }

            const response = await getMountains(params)

            setMountains(response.data.mountains || [])
            setTotalPages(response.data.pagination?.total_pages || 1)
        } catch (err) {
            setError(err.message)
            // Fallback demo data
            setMountains([
                { id: 1, name: 'Gunung Semeru', slug: 'semeru', province: 'Jawa Timur', elevation_meters: 3676, mountain_status: 'active' },
                { id: 2, name: 'Gunung Rinjani', slug: 'rinjani', province: 'Nusa Tenggara Barat', elevation_meters: 3726, mountain_status: 'active' },
                { id: 3, name: 'Gunung Merbabu', slug: 'merbabu', province: 'Jawa Tengah', elevation_meters: 3145, mountain_status: 'dormant' },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (field, order) => {
        setSortField(field)
        setSortOrder(order)
    }

    const handleDelete = async () => {
        if (!deleteModal.mountain) return

        try {
            await deleteMountain(deleteModal.mountain.id)
            setDeleteModal({ open: false, mountain: null })
            loadMountains()
        } catch (err) {
            setError(err.message)
        }
    }

    const columns = [
        { key: 'id', label: 'ID', width: 'w-16', sortable: true },
        {
            key: 'name',
            label: 'Mountain Name',
            sortable: true,
            render: (val, row) => (
                <div>
                    <span className="font-semibold text-slate-900">{val}</span>
                    <div className="text-[10px] text-slate-500 font-mono">{row.slug}</div>
                </div>
            )
        },
        { key: 'province', label: 'Province', sortable: true },
        {
            key: 'elevation_meters',
            label: 'Elevation',
            sortable: true,
            render: (val) => <span className="font-mono text-slate-600">{val?.toLocaleString() || 0} m</span>
        },
        {
            key: 'mountain_status',
            label: 'Status',
            render: (val) => {
                const statusColors = {
                    active: 'bg-green-100 text-green-800 border-green-200',
                    dormant: 'bg-yellow-50 text-yellow-800 border-yellow-200',
                    extinct: 'bg-slate-100 text-slate-600 border-slate-200'
                }
                return (
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide border rounded-sm ${statusColors[val] || 'bg-slate-50 text-slate-500'}`}>
                        {val}
                    </span>
                )
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 'w-32',
            render: (_, row) => (
                <div className="flex gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/mountains/${row.id}/edit`)
                        }}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline px-1"
                    >
                        EDIT
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setDeleteModal({ open: true, mountain: row })
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-red-700 hover:underline px-1"
                    >
                        DELETE
                    </button>
                </div>
            )
        }
    ]

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Mountains Database</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">Manage hiking destinations and metadata</p>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono rounded-sm">{mountains.length} RECORDS</span>
                    </div>
                </div>
                <Link to="/mountains/new">
                    <Button variant="primary" size="md">
                        + Add Record
                    </Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search mountains by name, province, or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {debouncedSearch && (
                    <span className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-md">
                        Showing results for &quot;{debouncedSearch}&quot;
                    </span>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Table */}
            <Table
                columns={columns}
                data={mountains}
                loading={loading}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                emptyMessage="No mountains found"
            />

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, mountain: null })}
                title="Confirm Delete"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ open: false, mountain: null })}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-neutral-700">
                    Are you sure you want to delete{' '}
                    <strong>{deleteModal.mountain?.name}</strong>?
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    )
}
