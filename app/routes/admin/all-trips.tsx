import { GridComponent, PagerComponent } from "@syncfusion/ej2-react-grids";
import { Header, TripCard } from "components";
import React, { useState } from "react";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import { allTrips } from "~/constants";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/all-trips";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 5;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const { trips, total } = await getAllTrips(limit, offset);
    return {
        trips: trips.map(({ $id, tripDetail, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? [],
        })),
        total,
    };
};

const AllTrips = ({ loaderData }: Route.ComponentProps) => {
    const { trips, total } = loaderData;
    const [searchParams] = useSearchParams();
    const initailPage = parseInt(searchParams.get('page') || '1');
    const [currentPage, setCurrentPage] = useState(initailPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    }
    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans."
                ctaText="Create a Trip"
                ctaUrl="/trips/create"
            />
            <section>
                <h1 className="p-24-semibold text-dark-100 mb-4">
                    Manage Created Trips
                </h1>
                <div className="trip-grid">
                    {trips.map(
                        ({
                            id,
                            name,
                            imageUrls,
                            itinerary,
                            interests,
                            travelStyle,
                            estimatedPrice,
                        }) => (
                            <TripCard
                                id={id}
                                name={name}
                                key={id}
                                location={itinerary?.[0].location ?? ""}
                                imageUrl={imageUrls[0]}
                                tags={[interests, travelStyle]}
                                price={estimatedPrice}
                            />
                        )
                    )}
                </div>

                <PagerComponent
                    totalRecordsCount={total}
                    pageSize={5}
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass="!mb-4"
                />
            </section>
        </main>
    );
};

export default AllTrips;
