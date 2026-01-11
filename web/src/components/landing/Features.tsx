"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Real-time Weather Risk",
        description:
            "Get live weather conditions and risk assessments powered by Open-Meteo. Temperature, wind, precipitation, and more.",
    },
    {
        title: "Curated Mountain Data",
        description:
            "Access detailed information on mountains across Indonesia. Elevation, coordinates, difficulty ratings, and trails.",
    },
    {
        title: "Seasonal Weather Meta",
        description:
            "Understand the best times to climb with contextual weather patterns and seasonal recommendations.",
    },
    {
        title: "Free API, No Credit Card",
        description:
            "Get started immediately with a free API key. No payment required. Built for developers, by developers.",
    },
];

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
};

const stagger = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function Features() {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        Everything you need
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        A simple, powerful API for mountain weather and trail data.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            transition={{ duration: 0.5 }}
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
