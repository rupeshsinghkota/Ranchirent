
export default function PropertyCardSkeleton() {
    return (
        <div className="group rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-row sm:flex-col h-28 sm:h-auto animate-pulse">
            {/* Image Placeholder */}
            <div className="relative w-[32%] sm:w-full sm:aspect-[4/3] flex-shrink-0 bg-gray-200"></div>

            <div className="p-2 sm:p-4 flex flex-col flex-grow justify-between w-full">
                <div>
                    {/* Header Skeleton */}
                    <div className="flex sm:hidden justify-between items-center mb-1">
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-10 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
                        <div className="h-4 sm:h-5 w-3/4 bg-gray-200 rounded"></div>
                        <div className="hidden sm:block h-5 w-20 bg-gray-200 rounded"></div>
                    </div>

                    {/* Mobile Price */}
                    <div className="sm:hidden h-4 w-24 bg-gray-200 rounded mb-1"></div>

                    {/* Location */}
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-2 sm:mb-4"></div>

                    {/* Amenities Desktop */}
                    <div className="hidden sm:flex items-center gap-4 pt-3 border-t border-dashed border-gray-100 mt-auto">
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Buttons Desktop */}
                <div className="mt-auto grid grid-cols-2 gap-2 hidden sm:grid">
                    <div className="h-9 bg-gray-200 rounded-lg"></div>
                    <div className="h-9 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
