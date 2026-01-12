"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // TODO: Connect to actual API
            const response = await fetch(api.auth.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store token and user info, then redirect
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify({
                name: data.data.user?.name || data.data.name || formData.email.split("@")[0],
                email: data.data.user?.email || data.data.email || formData.email
            }));
            window.location.href = "/api-keys";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 pt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500">
                        Sign in to manage your API keys
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-gray-900 font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
