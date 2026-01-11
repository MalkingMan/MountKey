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
        <section className="py-32 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
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
        </section>
    );
}
