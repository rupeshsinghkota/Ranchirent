export const metadata = {
    title: "Privacy Policy | RanchiRent",
    description: "How we collect and protect your data at RanchiRent.",
};

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-blue max-w-none text-gray-600">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as your name, phone number, and email address when you book a visit or list a property.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use your information to facilitate property visits, contact you regarding your housing requirements, and improve our services. We do not sell your personal data to third parties.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, modification, or destruction.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cookies</h2>
                <p>We may use cookies to improve user experience and analyze website traffic. You can control cookie settings through your browser.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@ranchirent.in" className="text-brand-blue font-medium">hello@ranchirent.in</a>.</p>
            </div>
        </main>
    );
}
