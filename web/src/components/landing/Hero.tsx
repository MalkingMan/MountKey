"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />

            {/* Atmospheric fog effect - very subtle */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-0 w-full h-96 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent blur-3xl" />
                <div className="absolute bottom-1/3 right-0 w-2/3 h-64 bg-gradient-to-l from-transparent via-gray-100/50 to-transparent blur-3xl" />
            </div>

            {/* Content */}
            <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24"
            >
                {/* Badge */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gray-100 text-gray-600 text-sm"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Free API Access
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.1] mb-6"
                >
                    Weather-aware
                    <br />
                    Mountain Data API
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Real-time weather risk insights for safer mountain expeditions.
                    <br className="hidden md:block" />
                    Curated data. Developer-first.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/register">
                        <Button size="lg">Get Free API Key</Button>
                    </Link>
                    <Link href="/docs">
                        <Button variant="secondary" size="lg">
                            View Docs
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 flex items-center justify-center gap-12 text-sm text-gray-400"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">50+</span>
                        <span>Mountains</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">Free</span>
                        <span>Forever</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">Real-time</span>
                        <span>Weather Data</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
