import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import { getTrail, createTrail, updateTrail, getMountains } from '../services/api'

/**
 * Trail Form Page
 * Create / Edit trail
 */
export default function TrailForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [mountains, setMountains] = useState([])
    const [form, setForm] = useState({
        mountain_id: '',
        name: '',
        slug: '',
        basecamp_name: '',
        basecamp_village: '',
        basecamp_district: '',
        basecamp_latitude: '',
        basecamp_longitude: '',
        distance_km: '',
        estimated_time_up_hours: '',
        estimated_time_down_hours: '',
        difficulty_level: '3',
        trail_status: 'open',
        daily_quota: '',
        description: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadMountainOptions = useCallback(async () => {
        try {
            const response = await getMountains({ limit: 100 })
            const opts = (response.data.mountains || []).map(m => ({
                value: m.id.toString(),
                label: m.name
            }))
            setMountains(opts)
        } catch {
            setMountains([
                { value: '1', label: 'Gunung Semeru' },
                { value: '2', label: 'Gunung Rinjani' },
            ])
        }
    }, [])

    const loadTrail = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getTrail(id)
            setForm(response.data.trail)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadMountainOptions()
        if (isEdit && id) {
            loadTrail()
        }
    }, [isEdit, id, loadMountainOptions, loadTrail])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))

        // Auto-generate slug
        if (name === 'name' && !isEdit) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setForm(prev => ({ ...prev, slug }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = {
                ...form,
                mountain_id: parseInt(form.mountain_id),
                basecamp_latitude: parseFloat(form.basecamp_latitude) || null,
                basecamp_longitude: parseFloat(form.basecamp_longitude) || null,
                distance_km: parseFloat(form.distance_km) || null,
                estimated_time_up_hours: parseFloat(form.estimated_time_up_hours) || null,
                estimated_time_down_hours: parseFloat(form.estimated_time_down_hours) || null,
                difficulty_level: parseInt(form.difficulty_level),
                daily_quota: parseInt(form.daily_quota) || null
            }

            if (isEdit) {
                await updateTrail(id, data)
            } else {
                await createTrail(data)
            }

            navigate('/trails')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const statusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'restricted', label: 'Restricted' },
        { value: 'maintenance', label: 'Maintenance' }
    ]

    const difficultyOptions = [
        { value: '1', label: '1 - Easy' },
        { value: '2', label: '2 - Moderate' },
        { value: '3', label: '3 - Challenging' },
        { value: '4', label: '4 - Difficult' },
        { value: '5', label: '5 - Extreme' }
    ]

    return (
        <div className="max-w-4xl">
            {/* Page Header */}
            <div className="mb-8 border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {isEdit ? `Editing: ${form.name}` : 'New Trail Entry'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isEdit ? 'Update hiking trail information' : 'Register a new hiking route'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => navigate('/trails')}
                    >
                        &larr; Back to List
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm">
                            <p className="font-bold">Error Saving Data</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Identification</h3>

                            <div className="mb-6">
                                <Select
                                    label="Target Mountain"
                                    name="mountain_id"
                                    value={form.mountain_id}
                                    onChange={handleChange}
                                    options={mountains}
                                    placeholder="Select a mountain..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Trail Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Via Ranu Pane"
                                    required
                                />

                                <Input
                                    label="URL Slug (Auto)"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="e.g. semeru-via-ranu-pane"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Classification */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Status & Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Select
                                    label="Difficulty Level"
                                    name="difficulty_level"
                                    value={form.difficulty_level}
                                    onChange={handleChange}
                                    options={difficultyOptions}
                                    required
                                />

                                <Select
                                    label="Operational Status"
                                    name="trail_status"
                                    value={form.trail_status}
                                    onChange={handleChange}
                                    options={statusOptions}
                                    required
                                />

                                <Input
                                    label="Daily Quota (Persons)"
                                    name="daily_quota"
                                    type="number"
                                    value={form.daily_quota}
                                    onChange={handleChange}
                                    placeholder="e.g. 500"
                                />
                            </div>
                        </div>

                        {/* Section 3: Basecamp */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Basecamp Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                <Input
                                    label="Basecamp Name"
                                    name="basecamp_name"
                                    value={form.basecamp_name}
                                    onChange={handleChange}
                                    placeholder="Required"
                                    required
                                />

                                <Input
                                    label="Village"
                                    name="basecamp_village"
                                    value={form.basecamp_village}
                                    onChange={handleChange}
                                    placeholder="Village Name"
                                />

                                <Input
                                    label="District"
                                    name="basecamp_district"
                                    value={form.basecamp_district}
                                    onChange={handleChange}
                                    placeholder="District Name"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Latitude"
                                    name="basecamp_latitude"
                                    type="number"
                                    step="any"
                                    value={form.basecamp_latitude}
                                    onChange={handleChange}
                                    placeholder="-7.9425"
                                    required
                                />

                                <Input
                                    label="Longitude"
                                    name="basecamp_longitude"
                                    type="number"
                                    step="any"
                                    value={form.basecamp_longitude}
                                    onChange={handleChange}
                                    placeholder="112.9530"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 4: Metrics */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Trail Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input
                                    label="Distance (km)"
                                    name="distance_km"
                                    type="number"
                                    step="0.01"
                                    value={form.distance_km}
                                    onChange={handleChange}
                                    placeholder="e.g. 18.5"
                                />

                                <Input
                                    label="Est. Time Up (Hours)"
                                    name="estimated_time_up_hours"
                                    type="number"
                                    step="0.5"
                                    value={form.estimated_time_up_hours}
                                    onChange={handleChange}
                                    placeholder="e.g. 8.0"
                                />

                                <Input
                                    label="Est. Time Down (Hours)"
                                    name="estimated_time_down_hours"
                                    type="number"
                                    step="0.5"
                                    value={form.estimated_time_down_hours}
                                    onChange={handleChange}
                                    placeholder="e.g. 5.5"
                                />
                            </div>
                        </div>

                        {/* Section 5: Description */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Description</h3>
                            <div>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-colors duration-100"
                                    placeholder="Detailed description of the trail, difficulties, and features..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 mt-8 border-t border-slate-200">
                        <Button type="submit" variant="primary" size="lg" disabled={loading}>
                            {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Trail')}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate('/trails')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
