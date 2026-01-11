import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { login } from '../services/api'

/**
 * Login Page
 * Simple admin login form
 */
export default function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await login(email, password)
            onLogin(response.data.token)
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-sm px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Login</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to MountKey Internal System</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full justify-center"
                            size="md"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        Create new admin account
                    </button>
                </div>
            </div>

            <div className="fixed bottom-6 text-center w-full">
                <p className="text-xs text-slate-400 font-mono">MOUNTKEY ADMIN v1.0 [INTERNAL]</p>
            </div>
        </div>
    )
}
