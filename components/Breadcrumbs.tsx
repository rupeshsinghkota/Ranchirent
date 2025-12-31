import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
    items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
    // Build breadcrumb list for JSON-LD schema
    const breadcrumbList = [
        { name: "Home", url: "https://ranchirent.in" },
        ...items.map((item, index) => ({
            name: item.label,
            url: item.href ? `https://ranchirent.in${item.href}` : undefined
        }))
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbList.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            ...(item.url && { "item": item.url })
        }))
    };

    return (
        <>
            <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-brand-blue transition">Home</Link>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" aria-hidden="true" />
                        {item.href ? (
                            <Link href={item.href} className="hover:text-brand-blue transition">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-semibold" aria-current="page">{item.label}</span>
                        )}
                    </div>
                ))}
            </nav>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </>
    );
}
