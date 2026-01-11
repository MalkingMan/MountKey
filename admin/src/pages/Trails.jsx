import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table, { Pagination } from '../components/Table'
import Button from '../components/Button'
import Select from '../components/Select'
import Modal from '../components/Modal'
import { getTrails, deleteTrail, getMountains } from '../services/api'

/**
 * Trails List Page
 * Table view with filter by mountain and search
 */
export default function Trails() {
    const navigate = useNavigate()
    const [trails, setTrails] = useState([])
    const [mountains, setMountains] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Search
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Filters
    const [mountainFilter, setMountainFilter] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Sorting
    const [sortField, setSortField] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')

    // Delete modal
    const [deleteModal, setDeleteModal] = useState({ open: false, trail: null })

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const loadMountainOptions = useCallback(async () => {
        try {
            const response = await getMountains({ limit: 100 })
            const opts = (response.data.mountains || []).map(m => ({
                value: m.id.toString(),
                label: m.name
            }))
            setMountains(opts)
        } catch {
            // Fallback
            setMountains([
                { value: '1', label: 'Gunung Semeru' },
                { value: '2', label: 'Gunung Rinjani' },
            ])
        }
    }, [])

    const loadTrails = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const params = {
                page,
                sort: sortField,
                order: sortOrder,
                limit: 20
            }

            if (mountainFilter) {
                params.mountain_id = mountainFilter
            }

            // Add search parameter if provided
            if (debouncedSearch.trim()) {
                params.search = debouncedSearch.trim()
            }

            const response = await getTrails(params)

            setTrails(response.data.trails || [])
            setTotalPages(response.data.pagination?.total_pages || 1)
        } catch (err) {
            setError(err.message)
            // Fallback demo data
            setTrails([
                { id: 1, name: 'Via Ranu Pane', slug: 'semeru-via-ranu-pane', mountain_name: 'Gunung Semeru', difficulty_level: 4, trail_status: 'open' },
                { id: 2, name: 'Via Tumpang', slug: 'semeru-via-tumpang', mountain_name: 'Gunung Semeru', difficulty_level: 3, trail_status: 'closed' },
                { id: 3, name: 'Via Senaru', slug: 'rinjani-via-senaru', mountain_name: 'Gunung Rinjani', difficulty_level: 4, trail_status: 'open' },
            ])
        } finally {
            setLoading(false)
        }
    }, [page, sortField, sortOrder, mountainFilter, debouncedSearch])

    useEffect(() => {
        loadMountainOptions()
    }, [loadMountainOptions])

    useEffect(() => {
        loadTrails()
    }, [loadTrails])

    const handleSort = (field, order) => {
        setSortField(field)
        setSortOrder(order)
    }

    const handleDelete = async () => {
        if (!deleteModal.trail) return

        try {
            await deleteTrail(deleteModal.trail.id)
            setDeleteModal({ open: false, trail: null })
            loadTrails()
        } catch (err) {
            setError(err.message)
        }
    }

    const getDifficultyLabel = (level) => {
        const labels = { 1: 'Easy', 2: 'Moderate', 3: 'Challenging', 4: 'Difficult', 5: 'Extreme' }
        return labels[level] || 'Unknown'
    }

    const columns = [
        { key: 'id', label: 'ID', width: 'w-16', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'mountain_name', label: 'Mountain', sortable: true },
        {
            key: 'difficulty_level',
            label: 'Difficulty',
            render: (val) => getDifficultyLabel(val)
        },
        {
            key: 'trail_status',
            label: 'Status',
            render: (val) => (
                <span className={`
          px-2 py-0.5 text-xs rounded-sm
          ${val === 'open' ? 'bg-green-100 text-green-700' : ''}
          ${val === 'closed' ? 'bg-red-100 text-red-700' : ''}
          ${val === 'restricted' ? 'bg-yellow-100 text-yellow-700' : ''}
          ${val === 'maintenance' ? 'bg-neutral-100 text-neutral-700' : ''}
        `}>
                    {val}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 'w-32',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/trails/${row.id}/edit`)
                        }}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setDeleteModal({ open: true, trail: row })
                        }}
                        className="text-xs text-red-600 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ]

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Trails</h2>
                    <p className="text-sm text-neutral-500 mt-1">Manage hiking trails</p>
                </div>
                <Link to="/trails/new">
                    <Button variant="primary">Add Trail</Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="mb-4 flex flex-wrap gap-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <input
                        type="text"
                        placeholder="Search trails by name or basecamp..."
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

                {/* Mountain Filter */}
                <div className="w-64">
                    <Select
                        name="mountain_filter"
                        value={mountainFilter}
                        onChange={(e) => {
                            setMountainFilter(e.target.value)
                            setPage(1)
                        }}
                        options={mountains}
                        placeholder="All Mountains"
                    />
                </div>

                {/* Search indicator */}
                {debouncedSearch && (
                    <span className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-md self-center">
                        Searching: &quot;{debouncedSearch}&quot;
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
                data={trails}
                loading={loading}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                emptyMessage="No trails found"
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
                onClose={() => setDeleteModal({ open: false, trail: null })}
                title="Confirm Delete"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ open: false, trail: null })}
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
                    <strong>{deleteModal.trail?.name}</strong>?
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    )
}
