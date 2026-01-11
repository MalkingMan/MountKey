import { NavLink } from 'react-router-dom'

/**
 * Layout Component
 * Sidebar + Header layout for admin panel
 */
// Enterprise Layout: Functional, High Density, Slate Theme
export default function Layout({ children, onLogout }) {
    const menuItems = [
        { path: '/', label: 'Overview' },
        { path: '/mountains', label: 'Mountains' },
        { path: '/trails', label: 'Trails' },
        { path: '/weather-meta', label: 'Weather Meta' },
        { path: '/users', label: 'Users & API Keys' },
    ]

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar - Text Only, Fixed Width */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                {/* Brand - Minimalist */}
                <div className="h-14 flex items-center px-6 border-b border-slate-200 bg-white">
                    <span className="font-bold text-slate-900 tracking-tight text-sm uppercase">MountKey Admin</span>
                </div>

                {/* Navigation - Dense List */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <div className="px-6 mb-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</p>
                    </div>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `block px-6 py-2 text-sm transition-colors duration-100 border-l-2 ${isActive
                                    ? 'border-slate-800 text-slate-900 bg-slate-50 font-medium'
                                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Info */}
                <div className="p-6 border-t border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-xs text-slate-500 font-medium">System Online</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Build v1.0.4-ent</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - Functional */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                    <h1 className="text-sm font-semibold text-slate-900">Platform Management Console</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">Logged in as Administrator</span>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <button
                            onClick={onLogout}
                            className="text-xs font-medium text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wide"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
