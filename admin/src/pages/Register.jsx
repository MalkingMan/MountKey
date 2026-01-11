import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { register } from '../services/api'

/**
 * Register Page
 * Create new admin account
 */
export default function Register({ onRegister, onSwitchToLogin }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate passwords match
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate password length
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            const response = await register(form.name, form.email, form.password)
            // Admin response returns: { data: { admin, token } }
            onRegister(response.data.token)
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-sm px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Admin</h1>
                    <p className="text-sm text-slate-500 mt-1">MountKey Platform Internal System</p>
                </div>

                {/* Form - Minimalist without card */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
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
                            {loading ? 'Processing...' : 'Create Account'}
                        </Button>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>

            <div className="fixed bottom-6 text-center w-full">
                <p className="text-xs text-slate-400 font-mono">MOUNTKEY ADMIN v1.0 [INTERNAL]</p>
            </div>
        </div>
    )
}
