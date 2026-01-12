"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface User {
    name: string;
    email: string;
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check auth state on mount (client-side only)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                // Invalid JSON, ignore
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
                : "bg-transparent"
                }`}
        >
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-semibold tracking-tight text-gray-900">
                        MountKey
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/mountains"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Mountains
                    </Link>
                    <Link
                        href="/docs"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Docs
                    </Link>
                    <Link
                        href="/api-keys"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        API Keys
                    </Link>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3 ml-4">
                        {user ? (
                            <>
                                {/* User is logged in */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* User is not logged in */}
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}
