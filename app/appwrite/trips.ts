import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
    try {
        const { documents: trips, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            [
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc("createdAt"),
            ]
        );

        if (total === 0) return { trips: [], total };
        return { trips, total };
    } catch (e) {
        console.log("ERR Fetching Trips");
        return { trips: [], total: 0 };
    }
};

export const getTripById = async (tripId: string) => {
    try {
        const trip = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            tripId
        )

        if(!trip.$id) {
            console.log('Trip Not found');
            return null;
        }
        return trip;
    } catch (e) {
        console.log("ERR Fetching Trip");
        return;
    }
}