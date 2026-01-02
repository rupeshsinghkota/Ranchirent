
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Ranchi Real Estate Market Insights & Reports | RanchiRent Blog',
    description: 'Read the latest monthly rental market reports for Ranchi. Trends, prices, and insights for Lalpur, Bariatu, Morabadi, and more.',
};

async function getBlogPosts() {
    const filePath = path.join(process.cwd(), 'data', 'blog_posts.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch {
        return [];
    }
}

export default async function BlogIndexPage() {
    const posts = await getBlogPosts();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-brand-blue py-16 text-white text-center">
                <h1 className="text-4xl font-extrabold mb-4">Ranchi Rental Insights</h1>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                    Data-driven market reports to help you make smarter rental decisions.
                </p>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 inline-block">
                    <Breadcrumbs items={[{ label: "Blog" }]} />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 h-full flex flex-col">
                                <div className="h-48 bg-blue-50 flex items-center justify-center relative overflow-hidden">
                                    {/* Pattern Background */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue via-transparent to-transparent"></div>
                                    <span className="text-4xl font-bold text-blue-200 uppercase tracking-widest">{post.locality}</span>
                                    <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-brand-blue shadow-sm">
                                        {new Date(post.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition mb-3">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-4 border-t border-gray-50">
                                        <span>Avg Rent: ₹{post.stats.avgRent.toLocaleString()}</span>
                                        <span className="text-brand-blue group-hover:underline">Read Report →</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No reports generated yet. Run the generator script.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
