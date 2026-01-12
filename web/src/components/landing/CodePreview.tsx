"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/CodeBlock";

const curlExample = `curl -X GET "https://api.mountkey.dev/v1/mountains/semeru/weather-risk" \\
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"`;

const responseExample = `{
  "success": true,
  "data": {
    "mountain": {
      "name": "Gunung Semeru",
      "elevation_mdpl": 3676
    },
    "weather": {
      "temperature_c": 3.2,
      "wind_speed_kmh": 25,
      "precipitation_probability": 60
    },
    "risk_index": {
      "score": 48,
      "level": "MEDIUM",
      "status": "CAUTION"
    }
  }
}`;

export default function CodePreview() {
    return (
        <section className="relative py-32 bg-gray-50 overflow-hidden">
            {/* Mountain Silhouette at Top */}
            <div className="absolute top-0 left-0 right-0 z-0 rotate-180">
                <svg viewBox="0 0 1440 150" className="w-full" preserveAspectRatio="none">
                    <path
                        fill="#ffffff"
                        d="M0,96L48,90.7C96,85,192,75,288,80C384,85,480,107,576,112C672,117,768,107,864,90.7C960,75,1056,53,1152,58.7C1248,64,1344,96,1392,112L1440,128L1440,150L1392,150C1344,150,1248,150,1152,150C1056,150,960,150,864,150C768,150,672,150,576,150C480,150,384,150,288,150C192,150,96,150,48,150L0,150Z"
                    />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        Simple integration
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        One API call. Real-time weather risk assessment.
                    </p>
                </motion.div>

                {/* Code Examples */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Request */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                            Request
                        </h3>
                        <CodeBlock code={curlExample} language="bash" />
                    </div>

                    {/* Response */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                            Response
                        </h3>
                        <CodeBlock code={responseExample} language="json" />
                    </div>
                </motion.div>
            </div>

            {/* Mountain Silhouette at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
                <svg viewBox="0 0 1440 180" className="w-full" preserveAspectRatio="none">
                    <path
                        fill="#94a3b8"
                        fillOpacity="0.1"
                        d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,144C672,160,768,160,864,149.3C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,180L1392,180C1344,180,1248,180,1152,180C1056,180,960,180,864,180C768,180,672,180,576,180C480,180,384,180,288,180C192,180,96,180,48,180L0,180Z"
                    />
                </svg>
                <svg viewBox="0 0 1440 100" className="w-full -mt-12" preserveAspectRatio="none">
                    <path
                        fill="#ffffff"
                        d="M0,32L80,42.7C160,53,320,75,480,80C640,85,800,75,960,58.7C1120,43,1280,21,1360,10.7L1440,0L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
                    />
                </svg>
            </div>
        </section>
    );
}
