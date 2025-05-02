import { GridComponent } from "@syncfusion/ej2-react-grids";
import { Header } from "components";
import React from "react";
import { allTrips } from "~/constants";

const AllTrips = () => {
    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans."
                ctaText="Create a Trip"
                ctaUrl="/trips/create"
            />
            <GridComponent dataSource={allTrips} gridLines="None"></GridComponent>
        </main>
    );
};

export default AllTrips;
