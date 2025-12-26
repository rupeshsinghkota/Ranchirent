"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyGallery({ images, title }: { images: string[], title: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <Camera className="w-12 h-12 mb-2 opacity-50" />
                <span>No images available</span>
            </div>
        );
    }

    return (
        <>
            {/* Desktop/Tablet Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden cursor-pointer group">
                {/* Main Large Image */}
                <div
                    className="col-span-2 row-span-2 relative overflow-hidden"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={images[0]}
                        alt={`${title} - Main`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition"></div>
                </div>

                {/* Side Images */}
                {[1, 2, 3, 4].map((i) => (
                    images[i] ? (
                        <div
                            key={i}
                            className={`col-span-1 row-span-1 relative overflow-hidden ${i === 2 ? 'rounded-tr-none' : ''}`}
                            onClick={() => openLightbox(i)}
                        >
                            <Image
                                src={images[i]}
                                alt={`${title} - View ${i}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                            {i === 4 && images.length > 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm z-10">
                                    +{images.length - 5} More
                                </div>
                            )}
                        </div>
                    ) : null
                ))}
            </div>

            {/* Mobile Carousel (Visible only on small screens, hiding the grid) */}
            <div className="sm:hidden -mx-4 h-72 relative overflow-hidden">
                <Image
                    src={images[0]}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    onClick={() => openLightbox(0)}
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <Camera className="w-3 h-3" /> {images.length} Photos
                </div>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setIsOpen(false)}>

                    <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white p-2 z-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[currentIndex]}
                            alt={`Gallery ${currentIndex + 1}`}
                            fill
                            sizes="100vw"
                            className="object-contain md:object-contain rounded shadow-2xl"
                        />

                        {/* Navigation Arrows */}
                        <button
                            className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition z-50"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition z-50"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <div className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm">
                            Image {currentIndex + 1} of {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
