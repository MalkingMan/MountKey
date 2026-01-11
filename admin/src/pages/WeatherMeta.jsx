import { useState, useEffect, useCallback } from 'react'
import Select from '../components/Select'
import Input from '../components/Input'
import Button from '../components/Button'
import { getMountains, getWeatherMeta, updateWeatherMeta } from '../services/api'

// Enum Bulan
const MONTHS = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
]

// Common Risks
const WEATHER_RISKS = [
    'Strong Winds / Badai',
    'Heavy Rain / Hujan Lebat',
    'Dense Fog / Kabut Tebal',
    'Thunderstorm / Petir',
    'Extreme Cold / Dingin Ekstrem',
    'Forest Fire / Kebakaran Hutan',
    'Toxic Gas / Gas Beracun'
]

export default function WeatherMeta() {
    const [mountains, setMountains] = useState([])
    const [selectedMountain, setSelectedMountain] = useState('')

    // Meta Data State
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    // Form inputs
    const [form, setForm] = useState({
        best_season_start: '', best_season_end: '',
        worst_season_start: '', worst_season_end: '',
        avg_temp_base_min: '', avg_temp_base_max: '',
        avg_temp_summit_min: '', avg_temp_summit_max: '',
        weather_notes: '',
        weather_risks: []
    })

    // Init: Load Mountain List
    useEffect(() => {
        getMountains({ limit: 100 }).then(res => {
            const opts = (res.data.mountains || []).map(m => ({
                value: m.id.toString(),
                label: m.name
            }))
            setMountains(opts)
            if (opts.length > 0) setSelectedMountain(opts[0].value)
        }).catch(err => console.error(err))
    }, [])

    // Load Meta when mountain changes
    useEffect(() => {
        if (!selectedMountain) return;

        setLoading(true)
        setError('')
        setSuccessMsg('')

        getWeatherMeta(selectedMountain)
            .then(res => {
                const data = res.data.meta;
                setMeta(data);
                setForm({
                    best_season_start: data.best_season_start?.toString() || '',
                    best_season_end: data.best_season_end?.toString() || '',
                    worst_season_start: data.worst_season_start?.toString() || '',
                    worst_season_end: data.worst_season_end?.toString() || '',
                    avg_temp_base_min: data.avg_temp_base_min || '',
                    avg_temp_base_max: data.avg_temp_base_max || '',
                    avg_temp_summit_min: data.avg_temp_summit_min || '',
                    avg_temp_summit_max: data.avg_temp_summit_max || '',
                    weather_notes: data.weather_notes || '',
                    weather_risks: Array.isArray(data.weather_risks) ? data.weather_risks : []
                });
            })
            .catch(err => {
                setError(err.message)
                setMeta(null)
            })
            .finally(() => setLoading(false))

    }, [selectedMountain])

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleRiskToggle = (risk) => {
        setForm(prev => {
            const exists = prev.weather_risks.includes(risk);
            const newRisks = exists
                ? prev.weather_risks.filter(r => r !== risk)
                : [...prev.weather_risks, risk];
            return { ...prev, weather_risks: newRisks };
        })
    }

    const handleSave = async (forceManual = false) => {
        setSaving(true)
        setError('')
        setSuccessMsg('')

        try {
            await updateWeatherMeta(selectedMountain, {
                ...form,
                force_manual: forceManual
            });
            setSuccessMsg('Weather metadata updated successfully.')
            // Reload to get fresh state (e.g. source update)
            const res = await getWeatherMeta(selectedMountain)
            setMeta(res.data.meta)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (mountains.length === 0 && !loading) return <div className="p-8">Loading mountains...</div>

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Weather Meta Context</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Manage static & contextual seasonal data per mountain.
                </p>
            </div>

            {/* Mountain Selector */}
            <div className="mb-8 bg-slate-50 p-6 border border-slate-200 rounded-sm flex items-end gap-4">
                <div className="flex-1 max-w-md">
                    <Select
                        label="Select Target Mountain"
                        value={selectedMountain}
                        onChange={(e) => setSelectedMountain(e.target.value)}
                        options={mountains}
                    />
                </div>
                {meta && (
                    <div className="pb-3 flex gap-6 text-sm text-slate-600 font-mono">
                        <div>
                            <span className="text-slate-400 block text-xs uppercase">Location</span>
                            {meta.province}
                        </div>
                        <div>
                            <span className="text-slate-400 block text-xs uppercase">Elevation</span>
                            {meta.elevation_meters} mdpl
                        </div>
                        <div>
                            <span className="text-slate-400 block text-xs uppercase">ID</span>
                            #{meta.mountain_id}
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="py-12 text-center text-slate-500">Loading weather context...</div>
            ) : meta ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>}
                        {successMsg && <div className="p-4 bg-green-50 text-green-700 border border-green-200 text-sm">{successMsg}</div>}

                        {/* SECTION: Seasonal Info */}
                        <div className="bg-white border border-slate-200 shadow-sm p-6 relative">
                            {/* Source Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`
                                    px-2 py-1 text-xs font-bold uppercase tracking-wide border
                                    ${meta.season_source === 'auto'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'}
                                `}>
                                    Source: {meta.season_source}
                                </span>
                            </div>

                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
                                Seasonal Analysis
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Best Season */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-green-700 block">Best Season (Recommended)</label>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex-1">
                                            <Select
                                                value={form.best_season_start}
                                                name="best_season_start"
                                                onChange={handleFormChange}
                                                options={MONTHS}
                                                placeholder="Start"
                                            />
                                        </div>
                                        <span className="text-slate-400">-</span>
                                        <div className="flex-1">
                                            <Select
                                                value={form.best_season_end}
                                                name="best_season_end"
                                                onChange={handleFormChange}
                                                options={MONTHS}
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Worst Season */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-red-700 block">Worst Season (Avoid)</label>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex-1">
                                            <Select
                                                value={form.worst_season_start}
                                                name="worst_season_start"
                                                onChange={handleFormChange}
                                                options={MONTHS}
                                                placeholder="Start"
                                            />
                                        </div>
                                        <span className="text-slate-400">-</span>
                                        <div className="flex-1">
                                            <Select
                                                value={form.worst_season_end}
                                                name="worst_season_end"
                                                onChange={handleFormChange}
                                                options={MONTHS}
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: Temperature */}
                        <div className="bg-white border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
                                Temperature Profiles (°C)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Basecamp Average</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            name="avg_temp_base_min"
                                            value={form.avg_temp_base_min}
                                            onChange={handleFormChange}
                                            placeholder="Min"
                                            type="number"
                                        />
                                        <span className="text-slate-400">–</span>
                                        <Input
                                            name="avg_temp_base_max"
                                            value={form.avg_temp_base_max}
                                            onChange={handleFormChange}
                                            placeholder="Max"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Summit Average</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            name="avg_temp_summit_min"
                                            value={form.avg_temp_summit_min}
                                            onChange={handleFormChange}
                                            placeholder="Min"
                                            type="number"
                                        />
                                        <span className="text-slate-400">–</span>
                                        <Input
                                            name="avg_temp_summit_max"
                                            value={form.avg_temp_summit_max}
                                            onChange={handleFormChange}
                                            placeholder="Max"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: Notes */}
                        <div className="bg-white border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                Special Notes & Warnings
                            </h3>
                            <textarea
                                name="weather_notes"
                                value={form.weather_notes}
                                onChange={handleFormChange}
                                rows={4}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none"
                                placeholder="Local weather patterns, specific warnings, or ranger observations..."
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Risks & Actions */}
                    <div className="space-y-8">

                        {/* SECTION: Risks */}
                        <div className="bg-white border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                Dominant Risks
                            </h3>
                            <div className="space-y-3">
                                {WEATHER_RISKS.map(risk => (
                                    <label key={risk} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={form.weather_risks.includes(risk)}
                                            onChange={() => handleRiskToggle(risk)}
                                            className="w-4 h-4 text-slate-800 border-slate-300 rounded-sm focus:ring-slate-500"
                                        />
                                        <span className="text-sm text-slate-700">{risk}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SECTION: Actions & Meta */}
                        <div className="bg-slate-50 border border-slate-200 p-6 space-y-4">
                            <div className="text-xs text-slate-500 font-mono space-y-1 mb-4 border-b border-slate-200 pb-4">
                                <div>LAST UPDATED: {meta.updated_at ? new Date(meta.updated_at).toLocaleDateString() : 'Never'}</div>
                                <div>LAST CALC: {meta.last_calculated_at ? new Date(meta.last_calculated_at).toLocaleDateString() : 'Never'}</div>
                            </div>

                            <Button
                                variant="primary"
                                className="w-full justify-center"
                                onClick={() => handleSave(false)}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>

                            {meta.season_source === 'auto' && (
                                <Button
                                    variant="secondary"
                                    className="w-full justify-center text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-200"
                                    onClick={() => handleSave(true)}
                                    disabled={saving}
                                >
                                    Force Override (Switch to Manual)
                                </Button>
                            )}
                        </div>

                    </div>
                </div>
            ) : (
                <div className="py-12 text-center text-slate-400">Select a mountain to view context data.</div>
            )}
        </div>
    )
}
