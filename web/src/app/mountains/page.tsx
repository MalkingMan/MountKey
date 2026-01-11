"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

// ============================================================
// TYPES
// ============================================================

interface Mountain {
    id: number;
    name: string;
    slug: string;
    location: {
        province: string;
        regency: string;
    };
    elevation_meters: number;
    status: string;
    type: string;
    trail_count?: number;
}

interface MountainDetail extends Mountain {
    conservation: {
        area: string | null;
        type: string | null;
    };
    description: string | null;
}

interface Filters {
    province: string;
    minElevation: string;
    maxElevation: string;
    type: string;
    search: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function MountainsPage() {
    const [mountains, setMountains] = useState<Mountain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMountain, setSelectedMountain] = useState<MountainDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        province: "",
        minElevation: "",
        maxElevation: "",
        type: "",
        search: "",
    });

    // Unique provinces from data
    const [provinces, setProvinces] = useState<string[]>([]);

    // ────────────────────────────────────────────────────────
    // FETCH MOUNTAINS
    // ────────────────────────────────────────────────────────
    const fetchMountains = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.province) params.append("province", filters.province);
            params.append("limit", "100");

            const response = await fetch(api.public.mountains.list(params.toString()));
            const data = await response.json();

            if (response.ok && data.data) {
                setMountains(data.data.mountains || []);
                // Extract unique provinces
                const uniqueProvinces = [...new Set(
                    (data.data.mountains || []).map((m: Mountain) => m.location.province)
                )] as string[];
                setProvinces(uniqueProvinces.sort());
            } else {
                setError(data.message || "Failed to fetch mountains");
            }
        } catch (err) {
            setError("Unable to connect to API");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters.province]);

    useEffect(() => {
        fetchMountains();
    }, [fetchMountains]);

    // ────────────────────────────────────────────────────────
    // FETCH MOUNTAIN DETAIL
    // ────────────────────────────────────────────────────────
    const openDetail = async (mountain: Mountain) => {
        setDetailLoading(true);
        setSelectedMountain(null);
        try {
            const response = await fetch(api.public.mountains.detail(mountain.slug));
            const data = await response.json();
            if (response.ok && data.data) {
                setSelectedMountain(data.data.mountain);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────
    // FILTER LOGIC (CLIENT-SIDE)
    // ────────────────────────────────────────────────────────
    const filteredMountains = mountains.filter((m) => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const nameMatch = m.name.toLowerCase().includes(searchLower);
            const provinceMatch = m.location.province.toLowerCase().includes(searchLower);
            if (!nameMatch && !provinceMatch) return false;
        }
        // Province filter
        if (filters.province && m.location.province !== filters.province) return false;
        // Elevation filter
        if (filters.minElevation && m.elevation_meters < parseInt(filters.minElevation)) return false;
        if (filters.maxElevation && m.elevation_meters > parseInt(filters.maxElevation)) return false;
        // Type filter
        if (filters.type) {
            const isVolcano = m.type?.toLowerCase().includes("volcano") || m.status === "active";
            if (filters.type === "volcano" && !isVolcano) return false;
            if (filters.type === "non-volcano" && isVolcano) return false;
        }
        return true;
    });

    const clearFilters = () => {
        setFilters({ province: "", minElevation: "", maxElevation: "", type: "", search: "" });
    };

    // ────────────────────────────────────────────────────────
    // RENDER
    // ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-6xl mx-auto px-6 pb-32">
                {/* ──────────────────────────────────────────── */}
                {/* PAGE HEADER */}
                {/* ──────────────────────────────────────────── */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                        Mountain Directory
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Curated list of mountains available in the MountKey API.
                        Browse data coverage and explore endpoints.
                    </p>
                </motion.header>

                {/* ──────────────────────────────────────────── */}
                {/* SEARCH & FILTERS */}
                {/* ──────────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-10"
                >
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search mountains by name or province..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-5 py-4 pl-12 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {filters.search && (
                            <button
                                onClick={() => setFilters({ ...filters, search: "" })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Province */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Province
                            </label>
                            <select
                                value={filters.province}
                                onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-[180px]"
                            >
                                <option value="">All Provinces</option>
                                {provinces.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Elevation Min */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Min Elevation
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters.minElevation}
                                onChange={(e) => setFilters({ ...filters, minElevation: e.target.value })}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-28"
                            />
                        </div>

                        {/* Elevation Max */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Max Elevation
                            </label>
                            <input
                                type="number"
                                placeholder="5000"
                                value={filters.maxElevation}
                                onChange={(e) => setFilters({ ...filters, maxElevation: e.target.value })}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-28"
                            />
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-[140px]"
                            >
                                <option value="">All Types</option>
                                <option value="volcano">Volcano</option>
                                <option value="non-volcano">Non-Volcano</option>
                            </select>
                        </div>

                        {/* Clear */}
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                </motion.section>

                {/* ──────────────────────────────────────────── */}
                {/* MOUNTAIN LIST */}
                {/* ──────────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 bg-gray-50 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-16">
                            <p className="text-gray-500">{error}</p>
                            <button
                                onClick={fetchMountains}
                                className="mt-4 text-sm text-gray-900 underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredMountains.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500">
                                No mountains found with current filters.
                            </p>
                        </div>
                    )}

                    {/* Mountain Cards */}
                    {!loading && !error && filteredMountains.length > 0 && (
                        <>
                            <p className="text-sm text-gray-400 mb-4">
                                {filteredMountains.length} mountain{filteredMountains.length > 1 ? "s" : ""} found
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredMountains.map((mountain, index) => (
                                    <MountainCard
                                        key={mountain.id}
                                        mountain={mountain}
                                        index={index}
                                        onClick={() => openDetail(mountain)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </motion.section>
            </div>

            {/* ──────────────────────────────────────────── */}
            {/* DETAIL MODAL */}
            {/* ──────────────────────────────────────────── */}
            <AnimatePresence>
                {(selectedMountain || detailLoading) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedMountain(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {detailLoading ? (
                                <div className="p-8">
                                    <div className="h-8 bg-gray-100 rounded w-1/2 mb-4 animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-8 animate-pulse" />
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                                    </div>
                                </div>
                            ) : selectedMountain && (
                                <MountainDetailView
                                    mountain={selectedMountain}
                                    onClose={() => setSelectedMountain(null)}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

// ============================================================
// MOUNTAIN CARD COMPONENT
// ============================================================

function MountainCard({
    mountain,
    index,
    onClick,
}: {
    mountain: Mountain;
    index: number;
    onClick: () => void;
}) {
    const isVolcano = mountain.type?.toLowerCase().includes("volcano") || mountain.status === "active";

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={onClick}
            className="group p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer bg-white"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {mountain.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {mountain.location.province}
                    </p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {mountain.elevation_meters.toLocaleString()} m
                </span>
            </div>

            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded ${isVolcano
                    ? "bg-orange-50 text-orange-600"
                    : "bg-blue-50 text-blue-600"
                    }`}>
                    {isVolcano ? "Volcano" : "Non-Volcano"}
                </span>
                {mountain.status === "active" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">
                        Active
                    </span>
                )}
            </div>

            {/* Available Data Tags */}
            <div className="flex flex-wrap gap-1.5">
                <DataTag label="Trails" available />
                <DataTag label="Weather Risk" available />
                <DataTag label="Weather Meta" available />
            </div>
        </motion.article>
    );
}

// ============================================================
// DATA TAG COMPONENT
// ============================================================

function DataTag({ label, available }: { label: string; available: boolean }) {
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded border ${available
                ? "border-green-200 text-green-600 bg-green-50/50"
                : "border-gray-200 text-gray-400"
                }`}
        >
            {label}
        </span>
    );
}

// ============================================================
// MOUNTAIN DETAIL VIEW COMPONENT
// ============================================================

function MountainDetailView({
    mountain,
    onClose,
}: {
    mountain: MountainDetail;
    onClose: () => void;
}) {
    const isVolcano = mountain.type?.toLowerCase().includes("volcano") || mountain.status === "active";

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                        {mountain.name}
                    </h2>
                    <p className="text-gray-500">
                        {mountain.location.province}, {mountain.location.regency}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <StatItem label="Elevation" value={`${mountain.elevation_meters.toLocaleString()} m`} />
                <StatItem label="Type" value={isVolcano ? "Volcano" : "Non-Volcano"} />
                <StatItem label="Status" value={mountain.status || "—"} />
                {mountain.trail_count !== undefined && (
                    <StatItem label="Trails" value={mountain.trail_count.toString()} />
                )}
                {mountain.conservation?.area && (
                    <StatItem label="Conservation" value={mountain.conservation.area} />
                )}
            </div>

            {/* Description */}
            {mountain.description && (
                <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Description
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {mountain.description}
                    </p>
                </div>
            )}

            {/* API Usage Hint */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    API Endpoints
                </h4>
                <div className="space-y-3">
                    <EndpointHint
                        method="GET"
                        path={`/v1/mountains/${mountain.slug}`}
                        description="Get mountain details"
                    />
                    <EndpointHint
                        method="GET"
                        path={`/v1/mountains/${mountain.slug}/trails`}
                        description="Get available trails"
                    />
                    <EndpointHint
                        method="GET"
                        path={`/v1/mountains/${mountain.slug}/weather-risk`}
                        description="Get weather risk assessment"
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// STAT ITEM COMPONENT
// ============================================================

function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    );
}

// ============================================================
// ENDPOINT HINT COMPONENT
// ============================================================

function EndpointHint({
    method,
    path,
    description,
}: {
    method: string;
    path: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-mono font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {method}
            </span>
            <code className="text-sm font-mono text-gray-600 flex-1">
                {path}
            </code>
            <span className="text-xs text-gray-400 hidden sm:block">
                {description}
            </span>
        </div>
    );
}
