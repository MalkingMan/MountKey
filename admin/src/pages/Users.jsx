import { useState, useEffect } from 'react'
import Table, { Pagination } from '../components/Table'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getUsers, getUser, updateUserStatus, revokeApiKey, extendApiKey } from '../services/api'

/**
 * Users & API Keys Page
 * Security & Health Monitor for API Platform
 * 
 * RULES:
 * - API keys NEVER shown in plaintext
 * - Admin cannot generate new API keys
 * - Admin cannot login as user
 * - All actions are explicit & reversible
 */
export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Filters
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    // Selected user detail
    const [selectedUser, setSelectedUser] = useState(null)
    const [userDetail, setUserDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    // Action modals
    const [actionModal, setActionModal] = useState({ type: null, data: null })
    const [extendDays, setExtendDays] = useState(30)

    // Load users
    useEffect(() => {
        loadUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter])

    const loadUsers = async () => {
        setLoading(true)
        setError('')

        try {
            const params = { page, limit: 20 }
            if (search) params.search = search
            if (statusFilter) params.status = statusFilter

            const response = await getUsers(params)
            setUsers(response.data.users || [])
            setTotalPages(response.data.pagination?.total_pages || 1)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        loadUsers()
    }

    // Load user detail
    const loadUserDetail = async (userId) => {
        setSelectedUser(userId)
        setDetailLoading(true)

        try {
            const response = await getUser(userId)
            setUserDetail(response.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setDetailLoading(false)
        }
    }

    // Handle suspend/unsuspend
    const handleStatusChange = async () => {
        if (!actionModal.data) return

        try {
            const newStatus = actionModal.data.status === 'active' ? 'suspended' : 'active'
            await updateUserStatus(actionModal.data.id, newStatus)
            setActionModal({ type: null, data: null })
            loadUsers()
            if (selectedUser === actionModal.data.id) {
                loadUserDetail(actionModal.data.id)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    // Handle revoke API key
    const handleRevokeKey = async () => {
        if (!actionModal.data) return

        try {
            await revokeApiKey(actionModal.data.userId, actionModal.data.keyId)
            setActionModal({ type: null, data: null })
            if (selectedUser) {
                loadUserDetail(selectedUser)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    // Handle extend API key
    const handleExtendKey = async () => {
        if (!actionModal.data) return

        try {
            await extendApiKey(actionModal.data.userId, actionModal.data.keyId, extendDays)
            setActionModal({ type: null, data: null })
            setExtendDays(30)
            if (selectedUser) {
                loadUserDetail(selectedUser)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // User table columns
    const columns = [
        { key: 'id', label: 'ID', width: 'w-12' },
        {
            key: 'email',
            label: 'User',
            render: (val, row) => (
                <div>
                    <span className="font-medium text-slate-900">{row.name || 'Unnamed'}</span>
                    <div className="text-xs text-slate-500 font-mono">{val}</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide border rounded-sm ${val === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {val}
                </span>
            )
        },
        {
            key: 'registered_at',
            label: 'Registered',
            render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>
        },
        {
            key: 'total_api_keys',
            label: 'API Keys',
            render: (val, row) => (
                <span className="font-mono text-sm">
                    {row.active_api_keys}/{val}
                </span>
            )
        },
        {
            key: 'actions',
            label: '',
            width: 'w-24',
            render: (_, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        loadUserDetail(row.id)
                    }}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                >
                    VIEW
                </button>
            )
        }
    ]

    return (
        <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
                {/* Page Header */}
                <div className="mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Users & API Keys</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor API consumers and manage access credentials
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 w-64"
                        />
                        <Button type="submit" variant="secondary" size="sm">
                            Search
                        </Button>
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            setPage(1)
                        }}
                        className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Users Table */}
                <Table
                    columns={columns}
                    data={users}
                    loading={loading}
                    emptyMessage="No users found."
                    onRowClick={(row) => loadUserDetail(row.id)}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            {/* Detail Panel */}
            {selectedUser && (
                <div className="w-96 border-l border-slate-200 pl-6">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">User Detail</h3>
                            <button
                                onClick={() => {
                                    setSelectedUser(null)
                                    setUserDetail(null)
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-slate-100 rounded w-3/4" />
                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                                <div className="h-4 bg-slate-100 rounded w-2/3" />
                            </div>
                        ) : userDetail && (
                            <>
                                {/* User Info */}
                                <div className="mb-6 p-4 bg-slate-50 rounded-sm border border-slate-200">
                                    <div className="text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Name</span>
                                            <span className="font-medium">{userDetail.user.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Email</span>
                                            <span className="font-mono text-xs">{userDetail.user.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status</span>
                                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm ${userDetail.user.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {userDetail.user.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Registered</span>
                                            <span className="text-xs">{formatDate(userDetail.user.registered_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Last Login</span>
                                            <span className="text-xs">{formatDate(userDetail.user.last_login_at)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200">
                                        <Button
                                            variant={userDetail.user.status === 'active' ? 'danger' : 'primary'}
                                            size="sm"
                                            onClick={() => setActionModal({ type: 'status', data: userDetail.user })}
                                        >
                                            {userDetail.user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                        </Button>
                                    </div>
                                </div>

                                {/* API Keys */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-3">
                                        API Keys ({userDetail.api_keys?.length || 0})
                                    </h4>

                                    {userDetail.api_keys?.length === 0 ? (
                                        <p className="text-sm text-slate-400 italic">
                                            This user has no API keys.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {userDetail.api_keys.map((key) => (
                                                <div
                                                    key={key.id}
                                                    className="p-3 bg-white border border-slate-200 rounded-sm"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                                                            {key.masked_key}
                                                        </code>
                                                        <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-sm ${key.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : key.status === 'expired'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {key.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 space-y-0.5">
                                                        <div>Name: {key.key_name}</div>
                                                        <div>Expires: {formatDate(key.expires_at)}</div>
                                                        <div>Created: {formatDate(key.created_at)}</div>
                                                        <div>Last Used: {formatDate(key.last_used_at)}</div>
                                                    </div>

                                                    {key.status === 'active' && (
                                                        <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2">
                                                            <button
                                                                onClick={() => setActionModal({
                                                                    type: 'extend',
                                                                    data: { userId: userDetail.user.id, keyId: key.id, keyName: key.key_name }
                                                                })}
                                                                className="text-[10px] font-semibold text-blue-600 hover:underline"
                                                            >
                                                                EXTEND
                                                            </button>
                                                            <button
                                                                onClick={() => setActionModal({
                                                                    type: 'revoke',
                                                                    data: { userId: userDetail.user.id, keyId: key.id, keyName: key.key_name }
                                                                })}
                                                                className="text-[10px] font-semibold text-red-600 hover:underline"
                                                            >
                                                                REVOKE
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Status Change Modal */}
            <Modal
                isOpen={actionModal.type === 'status'}
                onClose={() => setActionModal({ type: null, data: null })}
                title={actionModal.data?.status === 'active' ? 'Suspend User' : 'Activate User'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setActionModal({ type: null, data: null })}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionModal.data?.status === 'active' ? 'danger' : 'primary'}
                            onClick={handleStatusChange}
                        >
                            {actionModal.data?.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-slate-700">
                    {actionModal.data?.status === 'active'
                        ? `Are you sure you want to suspend ${actionModal.data?.email}? All their API keys will stop working.`
                        : `Are you sure you want to activate ${actionModal.data?.email}?`
                    }
                </p>
            </Modal>

            {/* Revoke Key Modal */}
            <Modal
                isOpen={actionModal.type === 'revoke'}
                onClose={() => setActionModal({ type: null, data: null })}
                title="Revoke API Key"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setActionModal({ type: null, data: null })}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleRevokeKey}>
                            Revoke
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-slate-700">
                    Are you sure you want to revoke <strong>{actionModal.data?.keyName}</strong>?
                    This action cannot be undone.
                </p>
            </Modal>

            {/* Extend Key Modal */}
            <Modal
                isOpen={actionModal.type === 'extend'}
                onClose={() => setActionModal({ type: null, data: null })}
                title="Extend API Key"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setActionModal({ type: null, data: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleExtendKey}>
                            Extend
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-700">
                        Extend expiration for <strong>{actionModal.data?.keyName}</strong>
                    </p>
                    <div>
                        <label className="text-sm text-slate-600 block mb-1">Days to extend</label>
                        <select
                            value={extendDays}
                            onChange={(e) => setExtendDays(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm"
                        >
                            <option value={7}>7 days</option>
                            <option value={30}>30 days</option>
                            <option value={90}>90 days</option>
                            <option value={180}>180 days</option>
                            <option value={365}>365 days</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
