export const metadata = {
    title: "Terms of Service | RanchiRent",
    description: "Terms and conditions for using RanchiRent services.",
};

export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-blue max-w-none text-gray-600">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using RanchiRent.in ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
                <p>RanchiRent is a rental brokerage platform connecting tenants with property owners. We provide verified listings, schedule visits, and assist with rental agreements.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Fees and Payments</h2>
                <p>Our brokerage service for tenants operates on a commission basis, typically equivalent to 15 days of rent, payable only upon successful lease agreement signing.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Property Verification</h2>
                <p>While we physically verify properties, we recommend tenants to independently verify all details before signing any agreement. RanchiRent is not liable for latent defects in the property.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. User Conduct</h2>
                <p>You agree to use the service for lawful purposes only and to provide accurate information when scheduling visits or listing properties.</p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
                <p>RanchiRent shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
            </div>
        </main>
    );
}
