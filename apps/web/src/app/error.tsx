"use client"

import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ErrorPage() {
    const router = useRouter()

    return (
        <div className="h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Error Message */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        We encountered an unexpected error. Don't worry, it's not your fault.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="group flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-700"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </button>
                </div>

                {/* Error Code */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 text-sm font-mono">
                        ERROR CODE: UNEXPECTED_ERROR
                    </p>
                </div>
            </div>
        </div>
    )
}