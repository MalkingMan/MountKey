"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

interface ApiKey {
    id: number;
    keyName: string;
    maskedKey: string;
    status: string;
    expiresAt: string;
    lastUsedAt: string | null;
    createdAt: string;
    isExpired: boolean;
}

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState<number | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [expirationDays, setExpirationDays] = useState<number>(30);

    // Check auth on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(api.apiKeys.list, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setApiKeys(data.data?.api_keys || []);
            }
        } catch (error) {
            console.error("Failed to fetch API keys:", error);
        }
    };

    const generateKey = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(api.apiKeys.create, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expiration_days: expirationDays }),
            });
            const data = await response.json();
            if (response.ok) {
                setNewKey(data.data.api_key);
                fetchApiKeys();
            }
        } catch (error) {
            console.error("Failed to generate API key:", error);
        } finally {
            setLoading(false);
        }
    };

    const revokeKey = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(api.apiKeys.revoke(id), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchApiKeys();
            setShowRevokeConfirm(null);
        } catch (error) {
            console.error("Failed to revoke API key:", error);
        }
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-3xl mx-auto px-6 pb-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">API Keys</h1>
                    <p className="text-gray-500">
                        Manage your API keys for accessing MountKey services.
                    </p>
                </motion.div>

                {/* New Key Display */}
                <AnimatePresence>
                    {newKey && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-green-900 mb-1">
                                        API Key Generated Successfully
                                    </h3>
                                    <p className="text-sm text-green-700 mb-4">
                                        Copy this key now. You won&apos;t be able to see it again.
                                    </p>
                                    <code className="block p-3 bg-white rounded-lg text-sm font-mono text-gray-900 break-all">
                                        {newKey}
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => copyToClipboard(newKey)}
                                >
                                    {copied ? "Copied!" : "Copy Key"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setNewKey(null)}
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Generate New Key */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <Button onClick={() => setShowGenerateModal(true)} disabled={loading}>
                        Generate New API Key
                    </Button>
                </motion.div>

                {/* Generate API Key Modal */}
                <AnimatePresence>
                    {showGenerateModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowGenerateModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Generate New API Key
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Select how long your API key should be valid.
                                </p>

                                <div className="mb-6">
                                    <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiration Period
                                    </label>
                                    <select
                                        id="expiration"
                                        value={expirationDays}
                                        onChange={(e) => setExpirationDays(Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    >
                                        <option value={7}>7 days</option>
                                        <option value={30}>30 days</option>
                                        <option value={90}>90 days</option>
                                        <option value={180}>180 days</option>
                                        <option value={365}>1 year</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setShowGenerateModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            setShowGenerateModal(false);
                                            generateKey();
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? "Generating..." : "Generate Key"}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* API Keys List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your API Keys</h2>

                    {apiKeys.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No API keys yet. Generate one to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {apiKeys.map((key) => (
                                <div
                                    key={key.id}
                                    className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <code className="text-sm font-mono text-gray-600">
                                                {key.maskedKey}
                                            </code>
                                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                                                <span>Created: {formatDate(key.createdAt)}</span>
                                                <span>Expires: {formatDate(key.expiresAt)}</span>
                                                <span
                                                    className={`px-2 py-0.5 rounded-full ${key.status === 'active'
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}
                                                >
                                                    {key.status === 'active' ? "Active" : key.status}
                                                </span>
                                            </div>
                                        </div>
                                        {key.status === 'active' && (
                                            <div className="relative">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowRevokeConfirm(key.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    Revoke
                                                </Button>

                                                {/* Revoke Confirmation */}
                                                <AnimatePresence>
                                                    {showRevokeConfirm === key.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute right-0 top-full mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-64"
                                                        >
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                Are you sure? This action cannot be undone.
                                                            </p>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => revokeKey(key.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Revoke
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setShowRevokeConfirm(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
