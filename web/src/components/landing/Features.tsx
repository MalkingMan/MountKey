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
        <section className="relative py-32 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
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
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 bg-white"
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

            {/* Mountain Silhouette at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
                <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
                    <path
                        fill="#f9fafb"
                        d="M0,160L60,149.3C120,139,240,117,360,128C480,139,600,181,720,186.7C840,192,960,160,1080,144C1200,128,1320,128,1380,128L1440,128L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z"
                    />
                </svg>
                <svg viewBox="0 0 1440 120" className="w-full -mt-1" preserveAspectRatio="none">
                    <path
                        fill="#e5e7eb"
                        fillOpacity="0.3"
                        d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,58.7C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    />
                </svg>
            </div>
        </section>
    );
}
