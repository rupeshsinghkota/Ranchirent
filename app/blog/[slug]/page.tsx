
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    locality: string;
    excerpt: string;
    content: string;
    stats: any;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const filePath = path.join(process.cwd(), 'data', 'blog_posts.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const posts = JSON.parse(fileContents);
        return posts.find((p: any) => p.slug === slug) || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Ranchirent Blog`,
        description: post.excerpt,
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.excerpt,
        }
    };
}

export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), 'data', 'blog_posts.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const posts = JSON.parse(fileContents);
        return posts.map((post: any) => ({
            slug: post.slug,
        }));
    } catch {
        return [];
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) return notFound();

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Unique Header for Blog Post */}
            <div className="bg-gray-50 border-b border-gray-100 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-blue mb-6 transition">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Market Reports
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-brand-blue px-2 py-1 rounded-md font-bold text-xs uppercase tracking-wide">
                            {post.locality}
                        </span>
                        <span>Published: {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <article className="container mx-auto px-4 max-w-3xl py-12">
                <div className="prose prose-lg prose-blue max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 
                    prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-ul:list-disc">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Explore More</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Link href={`/rent/${post.locality.toLowerCase().replace(/ /g, '-')}`} className="block p-4 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-md transition group">
                            <span className="text-sm text-gray-500 block mb-1">Browse Listings</span>
                            <span className="font-bold text-brand-blue flex items-center">
                                Rent in {post.locality} <span className="ml-2 group-hover:translate-x-1 transition">→</span>
                            </span>
                        </Link>
                        <Link href="/blog" className="block p-4 rounded-xl border border-gray-200 hover:border-brand-blue hover:shadow-md transition group">
                            <span className="text-sm text-gray-500 block mb-1">More Reports</span>
                            <span className="font-bold text-brand-blue flex items-center">
                                View Full Blog <span className="ml-2 group-hover:translate-x-1 transition">→</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </article>
        </main>
    );
}
