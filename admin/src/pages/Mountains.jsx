import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table, { Pagination } from '../components/Table'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getMountains, deleteMountain } from '../services/api'

/**
 * Mountains List Page
 * Table view with CRUD actions
 */
export default function Mountains() {
    const navigate = useNavigate()
    const [mountains, setMountains] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Sorting
    const [sortField, setSortField] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')

    // Delete modal
    const [deleteModal, setDeleteModal] = useState({ open: false, mountain: null })

    useEffect(() => {
        loadMountains()
    }, [page, sortField, sortOrder])

    const loadMountains = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await getMountains({
                page,
                sort: sortField,
                order: sortOrder,
                limit: 20
            })

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
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
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
