import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 animate-pulse">RanchiRent</h2>
                <p className="text-gray-500 font-medium text-sm">Finding the best homes for you...</p>
            </div>
        </div>
    );
}
