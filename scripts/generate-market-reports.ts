
import fs from 'fs';
import path from 'path';

// 1. Fetch Data
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp8XgTvaV63TicaSpZdkrbJMPo77inIqJ5Q451iM5snzagbNH9EivxZf9bd7nFSiO5/exec";

interface Property {
    id: string;
    type: string;
    location: string;
    rent: number;
    bedrooms?: number;
    tenantPref?: string;
    [key: string]: any;
}

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    locality: string;
    excerpt: string;
    content: string; // Markdown content
    stats: MarketStats;
}

// 2. Stats Interface
interface MarketStats {
    totalProperties: number;
    avgRent: number;
    lowestRent: number;
    types: Record<string, number>;
}

async function fetchProperties(): Promise<Property[]> {
    console.log("Fetching live data from RanchiRent Database...");
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        return [];
    }
}

// 3. Calculation Engine
function calculateStats(properties: Property[]): MarketStats {
    if (properties.length === 0) return { totalProperties: 0, avgRent: 0, lowestRent: 0, types: {} };

    const totalRent = properties.reduce((acc, p) => acc + (Number(p.rent) || 0), 0);
    const lowestRent = Math.min(...properties.map(p => Number(p.rent) || Infinity));

    // Count Types
    const types: Record<string, number> = {};
    properties.forEach(p => {
        const type = p.type || "Other";
        types[type] = (types[type] || 0) + 1;
    });

    return {
        totalProperties: properties.length,
        avgRent: Math.round(totalRent / properties.length),
        lowestRent: lowestRent === Infinity ? 0 : lowestRent,
        types
    };
}

// 4. Content Template
function generateBlogPost(locality: string, stats: MarketStats, properties: Property[]): BlogPost {
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const slug = `rental-market-report-${locality.toLowerCase().replace(/ /g, '-')}-${month.toLowerCase().replace(/ /g, '-')}`;

    const cheapRent = stats.lowestRent.toLocaleString('en-IN');
    const avgRent = stats.avgRent.toLocaleString('en-IN');

    // Helper to format type
    const formatType = (type: string) => {
        if (type.includes('BHK')) return `${type} Flat`;
        if (type.includes('RK')) return `${type} Studio`;
        return type;
    };

    const mostPopularType = Object.keys(stats.types)[0] || "1 BHK";
    const formattedPopularType = formatType(mostPopularType);

    const markdown = `
Looking for a property in **${locality}**? The market is moving fast this month. 
We currently have **${stats.totalProperties} verified listings** active in the area.

## Market Snapshot
- **Average Rent**: ₹${avgRent}/month
- **Starting From**: ₹${cheapRent}/month
- **Most Popular**: ${formattedPopularType}

## Why Rent in ${locality}?
${locality} continues to be a top choice for ${properties[0]?.tenantPref || "families and students"}, offering great connectivity and amenities.

## Top Available Properties
${properties.slice(0, 3).map(p => `
### [${formatType(p.type)} for ₹${p.rent}](${`https://ranchirent.in/property/${p.id}`})
- **Rent**: ₹${p.rent}/mo
- **Best For**: ${p.tenantPref}
`).join('\n')}

---
*Ready to visit? [Browse all ${stats.totalProperties} properties in ${locality}](https://ranchirent.in/rent/${locality.toLowerCase().replace(/ /g, '-')})*
    `.trim();

    return {
        slug,
        title: `Rental Market Report: ${locality} (${month})`,
        date: new Date().toISOString(),
        locality,
        excerpt: `Market analysis for ${locality} in ${month}. Average rent is ₹${avgRent} with ${stats.totalProperties} active listings.`,
        content: markdown,
        stats
    };
}

// Main Execution
async function main() {
    const allProperties = await fetchProperties();

    // Group by Locality
    const localities: Record<string, Property[]> = {};
    allProperties.forEach(p => {
        const loc = p.location?.trim();
        if (loc) {
            if (!localities[loc]) localities[loc] = [];
            localities[loc].push(p);
        }
    });

    console.log(`\nFound properties in ${Object.keys(localities).length} localities.\n`);

    const blogPosts: BlogPost[] = [];
    const targetLocalities = Object.keys(localities); // Generate for ALL localities

    targetLocalities.forEach(loc => {
        if (localities[loc].length > 0) {
            const stats = calculateStats(localities[loc]);
            const post = generateBlogPost(loc, stats, localities[loc]);
            blogPosts.push(post);
            console.log(`Generated: ${post.title}`);
        }
    });

    // Save to File
    const outputPath = path.join(process.cwd(), 'data', 'blog_posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2));
    console.log(`\nSuccessfully saved ${blogPosts.length} blog posts to ${outputPath}`);
}

main().catch(console.error);
