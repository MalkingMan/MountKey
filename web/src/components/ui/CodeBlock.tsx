"use client";

import { useState } from "react";

interface CodeBlockProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
}

export default function CodeBlock({
    code,
    language = "bash",
    showLineNumbers = false,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split("\n");

    return (
        <div className="relative group">
            {/* Language Badge */}
            {language && (
                <div className="absolute top-3 left-4 text-xs text-gray-500 font-mono uppercase">
                    {language}
                </div>
            )}

            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-gray-300 transition-all opacity-0 group-hover:opacity-100"
            >
                {copied ? "Copied!" : "Copy"}
            </button>

            {/* Code Content */}
            <div className="code-block pt-10">
                <pre className="overflow-x-auto">
                    <code className="text-sm leading-relaxed">
                        {showLineNumbers
                            ? lines.map((line, i) => (
                                <div key={i} className="table-row">
                                    <span className="table-cell pr-4 text-gray-600 select-none text-right w-8">
                                        {i + 1}
                                    </span>
                                    <span className="table-cell">{line}</span>
                                </div>
                            ))
                            : code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
