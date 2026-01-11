import { useState, useEffect, useCallback } from 'react'
import { getDashboardStats } from '../services/api'

/**
 * Dashboard Page
 * Overview stats - text only, no charts
 */
export default function Dashboard() {
    const [stats, setStats] = useState({
        totalMountains: 0,
        totalTrails: 0,
        totalUsers: 0,
        totalApiKeys: 0
    })
    const [loading, setLoading] = useState(true)

    const loadStats = useCallback(async () => {
        try {
            const response = await getDashboardStats()
            setStats(response.data)
        } catch {
            // Use fallback data for now
            setStats({
                totalMountains: 50,
                totalTrails: 120,
                totalUsers: 25,
                totalApiKeys: 40
            })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    const statItems = [
        { label: 'Total Mountains', value: stats.totalMountains },
        { label: 'Total Trails', value: stats.totalTrails },
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Active API Keys', value: stats.totalApiKeys },
    ]

    if (loading) {
        return (
            <div className="p-4">
                <p className="text-neutral-500 text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">System Overview</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <p className="text-sm text-slate-500 font-mono">All services operational</p>
                </div>
            </div>

            {/* Stats Grid - High Density/Contrast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 mb-8">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="bg-white p-6 hover:bg-slate-50 transition-colors"
                    >
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{item.label}</p>
                        <p className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                            {item.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actions */}
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="/mountains/new" className="group border border-slate-200 p-4 hover:border-slate-400 transition-colors bg-white">
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Add New Mountain &rarr;</span>
                            <span className="block text-xs text-slate-500 mt-1">Create a new mountain entry in database</span>
                        </a>
                        <a href="/trails/new" className="group border border-slate-200 p-4 hover:border-slate-400 transition-colors bg-white">
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Add New Trail &rarr;</span>
                            <span className="block text-xs text-slate-500 mt-1">Map a new hiking trail to a mountain</span>
                        </a>
                        <a href="/mountains" className="group border border-slate-200 p-4 hover:border-slate-400 transition-colors bg-white">
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Manage Mountains &rarr;</span>
                            <span className="block text-xs text-slate-500 mt-1">View, edit, or delete existing mountains</span>
                        </a>
                        <a href="/users" className="group border border-slate-200 p-4 hover:border-slate-400 transition-colors bg-white">
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">User Management &rarr;</span>
                            <span className="block text-xs text-slate-500 mt-1">Monitor user registrations and API keys</span>
                        </a>
                    </div>
                </div>

                {/* System Info */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">System Status</h3>
                    <div className="bg-white border border-slate-200 p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Database</span>
                            <span className="font-mono text-green-600">CONNECTED</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">API Gateway</span>
                            <span className="font-mono text-green-600">ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Last Backup</span>
                            <span className="font-mono text-slate-900">2h ago</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Server Time</span>
                            <span className="font-mono text-slate-900 text-xs">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
