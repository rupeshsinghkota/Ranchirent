import SearchContainer from "@/components/SearchContainer";

export const metadata = {
    title: "All Listings | RanchiRent",
    description: "Browse verified flats for rent in Ranchi.",
};

export default function ListingsPage() {
    return (
        <main>
            <SearchContainer />
        </main>
    );
}
