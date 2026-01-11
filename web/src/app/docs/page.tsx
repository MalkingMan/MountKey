"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/CodeBlock";
import Footer from "@/components/layout/Footer";

const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "authentication", title: "Authentication" },
    { id: "base-url", title: "Base URL" },
    { id: "endpoints", title: "Endpoints" },
    { id: "mountains", title: "Mountains", isChild: true },
    { id: "mountain-detail", title: "Mountain Detail", isChild: true },
    { id: "trails", title: "Trails", isChild: true },
    { id: "weather-risk", title: "Weather Risk", isChild: true },
    { id: "error-codes", title: "Error Codes" },
    { id: "rate-limits", title: "Rate Limits" },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map((s) => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-7xl mx-auto px-6 flex">
                {/* Sidebar */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:block w-64 flex-shrink-0"
                >
                    <nav className="sticky top-24 py-8 pr-8">
                        <ul className="space-y-1">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => scrollToSection(section.id)}
                                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${section.isChild ? "pl-6" : ""
                                            } ${activeSection === section.id
                                                ? "bg-gray-100 text-gray-900 font-medium"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {section.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </motion.aside>

                {/* Main Content */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex-1 py-8 max-w-3xl"
                >
                    {/* Introduction */}
                    <section id="introduction" className="mb-16">
                        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
                            MountKey API Documentation
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            MountKey provides a RESTful API for accessing mountain data, trail information,
                            and real-time weather risk assessments for mountains across Indonesia.
                        </p>
                    </section>

                    {/* Authentication */}
                    <section id="authentication" className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Authentication
                        </h2>
                        <p className="text-gray-600 mb-4">
                            All API requests must include your API key in the request header:
                        </p>
                        <CodeBlock
                            code={`X-MountKey-API-Key: mk_live_your_api_key_here`}
                            language="http"
                        />
                        <p className="text-gray-600 mt-4">
                            You can obtain an API key by{" "}
                            <a href="/register" className="text-gray-900 underline">
                                registering for a free account
                            </a>
                            .
                        </p>
                    </section>

                    {/* Base URL */}
                    <section id="base-url" className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Base URL
                        </h2>
                        <p className="text-gray-600 mb-4">
                            All API endpoints are relative to the following base URL:
                        </p>
                        <CodeBlock code={`https://api.mountkey.dev/v1`} language="text" />
                    </section>

                    {/* Endpoints */}
                    <section id="endpoints" className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Endpoints
                        </h2>

                        {/* Mountains List */}
                        <div id="mountains" className="mb-12">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                List Mountains
                            </h3>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    GET
                                </span>
                                <code className="text-sm text-gray-600">/v1/mountains</code>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Retrieve a list of all available mountains with basic information.
                            </p>
                            <CodeBlock
                                code={`curl -X GET "https://api.mountkey.dev/v1/mountains" \\
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"`}
                                language="bash"
                            />
                            <h4 className="text-sm font-medium text-gray-900 mt-6 mb-3">
                                Response Example
                            </h4>
                            <CodeBlock
                                code={`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gunung Semeru",
      "slug": "semeru",
      "elevation_mdpl": 3676,
      "province": "Jawa Timur"
    },
    {
      "id": 2,
      "name": "Gunung Rinjani",
      "slug": "rinjani",
      "elevation_mdpl": 3726,
      "province": "Nusa Tenggara Barat"
    }
  ]
}`}
                                language="json"
                            />
                        </div>

                        {/* Mountain Detail */}
                        <div id="mountain-detail" className="mb-12">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                Get Mountain Detail
                            </h3>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    GET
                                </span>
                                <code className="text-sm text-gray-600">/v1/mountains/:slug</code>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Retrieve detailed information about a specific mountain.
                            </p>
                            <CodeBlock
                                code={`curl -X GET "https://api.mountkey.dev/v1/mountains/semeru" \\
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"`}
                                language="bash"
                            />
                        </div>

                        {/* Trails */}
                        <div id="trails" className="mb-12">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                Get Mountain Trails
                            </h3>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    GET
                                </span>
                                <code className="text-sm text-gray-600">/v1/mountains/:slug/trails</code>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Retrieve all hiking trails for a specific mountain.
                            </p>
                            <CodeBlock
                                code={`curl -X GET "https://api.mountkey.dev/v1/mountains/semeru/trails" \\
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"`}
                                language="bash"
                            />
                        </div>

                        {/* Weather Risk */}
                        <div id="weather-risk" className="mb-12">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                Get Weather Risk
                            </h3>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    GET
                                </span>
                                <code className="text-sm text-gray-600">
                                    /v1/mountains/:slug/weather-risk
                                </code>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Get real-time weather conditions and risk assessment for a mountain.
                            </p>
                            <CodeBlock
                                code={`curl -X GET "https://api.mountkey.dev/v1/mountains/semeru/weather-risk" \\
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"`}
                                language="bash"
                            />
                            <h4 className="text-sm font-medium text-gray-900 mt-6 mb-3">
                                Response Example
                            </h4>
                            <CodeBlock
                                code={`{
  "success": true,
  "data": {
    "mountain": {
      "id": 1,
      "name": "Gunung Semeru",
      "elevation_mdpl": 3676
    },
    "weather": {
      "temperature_c": 3.2,
      "feels_like_c": -2.1,
      "wind_speed_kmh": 25,
      "precipitation_probability": 60
    },
    "risk_index": {
      "score": 48,
      "level": "MEDIUM",
      "status": "CAUTION",
      "reasons": [
        "Angin cukup kencang (25 km/jam)",
        "Kemungkinan hujan tinggi (60%)"
      ]
    },
    "recommendation": {
      "summary": "Kondisi cuaca memerlukan kewaspadaan ekstra.",
      "advice": [
        "Persiapkan perlengkapan hujan",
        "Bawa pakaian hangat cadangan"
      ]
    }
  }
}`}
                                language="json"
                            />
                        </div>
                    </section>

                    {/* Error Codes */}
                    <section id="error-codes" className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Error Codes
                        </h2>
                        <p className="text-gray-600 mb-6">
                            The API uses standard HTTP status codes to indicate the success or failure of requests.
                        </p>
                        <div className="overflow-hidden border border-gray-200 rounded-xl">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-900">
                                            Code
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-900">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-900">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-4 py-3 font-mono text-gray-600">200</td>
                                        <td className="px-4 py-3 text-gray-600">OK</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            Request successful
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-mono text-gray-600">401</td>
                                        <td className="px-4 py-3 text-gray-600">Unauthorized</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            Invalid or missing API key
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-mono text-gray-600">404</td>
                                        <td className="px-4 py-3 text-gray-600">Not Found</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            Resource not found
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-mono text-gray-600">429</td>
                                        <td className="px-4 py-3 text-gray-600">Too Many Requests</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            Rate limit exceeded
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-mono text-gray-600">503</td>
                                        <td className="px-4 py-3 text-gray-600">Service Unavailable</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            Weather service temporarily down
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Rate Limits */}
                    <section id="rate-limits" className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Rate Limits
                        </h2>
                        <p className="text-gray-600 mb-4">
                            To ensure fair usage, the API has the following rate limits:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>
                                <strong>Free tier:</strong> 100 requests per hour
                            </li>
                            <li>
                                <strong>Weather risk data:</strong> Cached for 20 minutes
                            </li>
                        </ul>
                        <p className="text-gray-600 mt-4">
                            Rate limit headers are included in all responses:
                        </p>
                        <CodeBlock
                            code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200`}
                            language="http"
                        />
                    </section>
                </motion.main>
            </div>
            <Footer />
        </div>
    );
}
