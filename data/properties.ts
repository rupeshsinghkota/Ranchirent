export interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    beds: number;
    baths: number;
    type: string;
    furnished: string;
    available: boolean;
    image: string | null;
    description: string;
    amenities: string[];
    area: string;
}

export const properties: Property[] = [
    {
        id: 1,
        title: "Premium 2 BHK Flat",
        location: "Lalpur, Ranchi",
        price: "₹14,000",
        beds: 2,
        baths: 2,
        type: "Flat",
        furnished: "Semi-Furnished",
        available: true,
        image: null,
        area: "1100 sqft",
        description: "A beautiful, well-ventilated 2 BHK flat located in the heart of Lalpur. Close to major coaching centers and markets. Features modular kitchen and balcony.",
        amenities: ["Power Backup", "Lift", "Security", "Water Supply", "Parking"]
    },
    {
        id: 2,
        title: "Spacious 3 BHK Home",
        location: "Kanke Road, Ranchi",
        price: "₹22,000",
        beds: 3,
        baths: 3,
        type: "House",
        furnished: "Unfurnished",
        available: true,
        image: null,
        area: "1800 sqft",
        description: "Independent house with garden. Quiet neighborhood on Kanke Road. Perfect for families looking for privacy and space.",
        amenities: ["Private Garden", "Garage", "24/7 Water", "Pet Friendly"]
    },
    {
        id: 3,
        title: "Compact 1 BHK Studio",
        location: "Kokar, Ranchi",
        price: "₹7,500",
        beds: 1,
        baths: 1,
        type: "Flat",
        furnished: "Furnished",
        available: true,
        image: null,
        area: "550 sqft",
        description: "Cozy studio apartment suitable for students or working professionals. Comes with bed, wardrobe, and attached bathroom.",
        amenities: ["WiFi", "Bike Parking", "CCTV"]
    },
    {
        id: 4,
        title: "Luxury 2 BHK Apartment",
        location: "Morabadi, Ranchi",
        price: "₹16,500",
        beds: 2,
        baths: 2,
        type: "Flat",
        furnished: "Fully Furnished",
        available: true,
        image: null,
        area: "1250 sqft",
        description: "High-end apartment near Morabadi Ground. Fully furnished with AC, Fridge, and double beds. Ready to move in.",
        amenities: ["Gym", "Club House", "Power Backup", "Covered Parking", "Lift"]
    }
];
