import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
    items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-brand-blue transition">Home</Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-brand-blue transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-semibold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
