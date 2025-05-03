import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";
import { parseMarkdownToJson } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        // Not support for Myanmar
        // const prompt = `
        //     Generate a ${numberOfDays}-day itinerary for ${country} based on the following info
        //     Budget: '${budget}'
        //     Interests: '${interests}'
        //     TravelStyle: '${travelStyle}'
        //     GroupType: '${groupType}'
        //     Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        //     {
        //     "name": "A descriptive title for the trip",
        //     "description": "A brief description of the trip and its highlights not exceeding 100 words",
        //     "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        //     "duration": ${numberOfDays},
        //     "budget": "${budget}",
        //     "travelStyle": "${travelStyle}",
        //     "country": "${country}",
        //     "interests": ${interests},
        //     "groupType": "${groupType}",
        //     "bestTimeToVisit": [
        //     '🌸 Season (from month to month): reason to visit',
        //     '☀️ Season (from month to month): reason to visit',
        //     '🍁 Season (from month to month): reason to visit',
        //     '❄️ Season (from month to month): reason to visit'
        //     ],
        //     "weatherInfo": [
        //     '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        //     '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        //     '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        //     '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        //     ],
        //     "location": {
        //     "city": "name of the city or region",
        //     "coordinates": [latitude, longitude],
        //     "openStreetMap": "link to open street map"
        //     },
        //     "itinerary": [
        //     {
        //     "day": 1,
        //     "location": "City/Region Name",
        //     "activities": [
        //         {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        //         {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        //         {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
        //     ]
        //     },
        //     ...
        //     ]
        // }
        // `;

        // const textResult = await genAI
        //     .getGenerativeModel({ model: "gemini-2.0-flash" })
        //     .generateContent([prompt]);

        // const trip = parseMarkdownToJson(textResult.response.text());
        const trip = {
            name: `Enchanting Escape to ${country}`,
            description:
                `Experience a delightful ${numberOfDays}-day journey through ${country}'s cultural gems, from vibrant cityscapes to serene nature retreats.`,
            estimatedPrice: "$1500",
            duration: numberOfDays,
            budget: budget,
            travelStyle: travelStyle,
            country: country,
            interests: interests,
            groupType: groupType,
            bestTimeToVisit: [
                "🌸 Spring (March to May): Cherry blossoms in full bloom",
                "☀️ Summer (June to August): Festivals and outdoor adventures",
                "🍁 Autumn (September to November): Stunning fall foliage",
                "❄️ Winter (December to February): Snowy landscapes and hot springs",
            ],
            weatherInfo: [
                "☀️ Summer: 25-35°C (77-95°F)",
                "🌦️ Spring: 10-20°C (50-68°F)",
                "🌧️ Autumn: 15-25°C (59-77°F)",
                "❄️ Winter: -5-10°C (23-50°F)",
            ],
            location: {
                city: country,
                coordinates: [35.682839, 139.759455],
                openStreetMap:
                    "https://www.openstreetmap.org/#map=10/35.6828/139.7595",
            },
            itinerary: [
                {
                    day: 1,
                    location: country,
                    activities: [
                        {
                            time: "Morning",
                            description:
                                "🏯 Visit the Imperial Palace and stroll through its gardens",
                        },
                        {
                            time: "Afternoon",
                            description:
                                "🛍️ Explore Akihabara, the hub for electronics and anime culture",
                        },
                        {
                            time: "Evening",
                            description:
                                "🍣 Enjoy an authentic sushi dinner at a traditional restaurant",
                        },
                    ],
                },
                {
                    day: 2,
                    location: country,
                    activities: [
                        {
                            time: "Morning",
                            description:
                                "🌿 Walk through the famous bamboo forest of Arashiyama",
                        },
                        {
                            time: "Afternoon",
                            description:
                                "⛩️ Visit Fushimi Inari Shrine and hike through its thousands of torii gates",
                        },
                        {
                            time: "Evening",
                            description:
                                "🍵 Experience a traditional Japanese tea ceremony",
                        },
                    ],
                },
            ],
        };
        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
        );
        const imageUrls = (await imageResponse.json()).results
            .slice(0, 3)
            .map((result: any) => result.urls?.regular || null);
        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        );
        return data({ id: result.$id });
    } catch (e) {
        console.error("Error", e);
    }
};
