
import React from 'react';

/**
 * Props for the ApartmentSchema component.
 * Corresponds to the data requirements for displaying a property listing.
 */
interface Address {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country?: string;
}

interface ApartmentSchemaProps {
    title: string;
    description: string;
    price: number;
    currency?: string;
    address: Address;
    images: string[];
    numberOfRooms: number;
    floorSize: number; // in square feet
}

/**
 * ApartmentSchema Component
 * 
 * Generates a JSON-LD script tag with RealEstateListing and Apartment schema
 * to enable Google Rich Results for apartment listings.
 * 
 * @param {ApartmentSchemaProps} props - The property details.
 */
const ApartmentSchema: React.FC<ApartmentSchemaProps> = ({
    title,
    description,
    price,
    currency = 'INR',
    address,
    images,
    numberOfRooms,
    floorSize,
}) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        leaseLength: 'LongTerm',
        offer: {
            '@type': 'Offer',
            price: price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
        },
        about: {
            '@type': 'Apartment',
            name: title,
            description: description,
            image: images, // Google recommends providing multiple high-resolution images (tminimum 1)
            numberOfRooms: numberOfRooms,
            floorSize: {
                '@type': 'QuantitativeValue',
                value: floorSize,
                unitCode: 'FTK', // FTK represents Square Feet
            },
            address: {
                '@type': 'PostalAddress',
                streetAddress: address.street,
                addressLocality: address.city,
                addressRegion: address.region,
                postalCode: address.postalCode,
                addressCountry: address.country || 'IN',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default ApartmentSchema;
