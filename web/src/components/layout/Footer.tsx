import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <span className="text-lg font-semibold text-gray-900">MountKey</span>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Weather-aware mountain data API for safer expeditions.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16">
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-gray-900">Product</span>
                            <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Documentation
                            </Link>
                            <Link href="/api-keys" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                API Keys
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-gray-900">Account</span>
                            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} MountKey. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
