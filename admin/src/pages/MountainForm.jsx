import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import { getMountain, createMountain, updateMountain } from '../services/api'

/**
 * Mountain Form Page
 * Create / Edit mountain
 */
export default function MountainForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [form, setForm] = useState({
        name: '',
        slug: '',
        province: '',
        regency: '',
        latitude: '',
        longitude: '',
        elevation_meters: '',
        mountain_status: 'dormant',
        mountain_type: 'stratovolcano',
        description: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadMountain = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getMountain(id)
            setForm(response.data.mountain)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (isEdit && id) {
            loadMountain()
        }
    }, [isEdit, id, loadMountain])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))

        // Auto-generate slug from name
        if (name === 'name' && !isEdit) {
            const slug = value
                .toLowerCase()
                .replace(/gunung\s*/gi, '')
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
                latitude: parseFloat(form.latitude) || 0,
                longitude: parseFloat(form.longitude) || 0,
                elevation_meters: parseInt(form.elevation_meters) || 0
            }

            if (isEdit) {
                await updateMountain(id, data)
            } else {
                await createMountain(data)
            }

            navigate('/mountains')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'dormant', label: 'Dormant' },
        { value: 'extinct', label: 'Extinct' }
    ]

    const typeOptions = [
        { value: 'stratovolcano', label: 'Stratovolcano' },
        { value: 'shield', label: 'Shield' },
        { value: 'caldera', label: 'Caldera' },
        { value: 'complex', label: 'Complex' },
        { value: 'non_volcanic', label: 'Non-Volcanic' }
    ]

    return (
        <div className="max-w-4xl">
            {/* Page Header */}
            <div className="mb-8 border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {isEdit ? `Editing: ${form.name}` : 'New Mountain Entry'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isEdit ? 'Update metadata and geographical details' : 'Register a new mountain into the database'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => navigate('/mountains')}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Official Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Gunung Semeru"
                                    required
                                />

                                <Input
                                    label="URL Slug (Auto)"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="e.g. semeru"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Location */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Geographical Data</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <Input
                                    label="Province"
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    placeholder="e.g. Jawa Timur"
                                    required
                                />

                                <Input
                                    label="Regency"
                                    name="regency"
                                    value={form.regency}
                                    onChange={handleChange}
                                    placeholder="e.g. Lumajang"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input
                                    label="Latitude"
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={form.latitude}
                                    onChange={handleChange}
                                    placeholder="-8.1077"
                                    required
                                />

                                <Input
                                    label="Longitude"
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    value={form.longitude}
                                    onChange={handleChange}
                                    placeholder="112.9220"
                                    required
                                />

                                <Input
                                    label="Elevation (MDPL)"
                                    name="elevation_meters"
                                    type="number"
                                    value={form.elevation_meters}
                                    onChange={handleChange}
                                    placeholder="3676"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 3: Classification */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Current Status"
                                    name="mountain_status"
                                    value={form.mountain_status}
                                    onChange={handleChange}
                                    options={statusOptions}
                                    required
                                />

                                <Select
                                    label="Geological Type"
                                    name="mountain_type"
                                    value={form.mountain_type}
                                    onChange={handleChange}
                                    options={typeOptions}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 4: Details */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-1">Additional Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-colors duration-100"
                                    placeholder="Brief description of the mountain terrain and features..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 mt-8 border-t border-slate-200">
                        <Button type="submit" variant="primary" size="lg" disabled={loading}>
                            {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Record')}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate('/mountains')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
