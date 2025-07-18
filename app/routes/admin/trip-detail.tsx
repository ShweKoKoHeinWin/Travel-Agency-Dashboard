import React from "react";
import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import { Header, InfoPill, TripCard } from "components";
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;
    if (!tripId) throw new Error("Trip ID is not required.");

    const [trip, trips] = await Promise.all([
        getTripById(tripId),
        getAllTrips(3, 0)
    ])
    return {
        trip,
        allTrips: trips.trips.map(({$id, tripDetail, imageUrls}) => (
            {
                id: $id,
                ...parseTripData(tripDetail),
                imageUrls: imageUrls ?? [],
            }
        ))
    }
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
    const imageUrls = loaderData?.trip?.imageUrls || [];
    const tripData = parseTripData(loaderData?.trip?.tripDetail);
    const {
        name,
        duration,
        itinerary,
        travelStyle,
        groupType,
        budget,
        interests,
        estimatedPrice,
        description,
        bestTimeToVisit,
        weatherInfo,
        country,
    } = tripData || {};

    console.log(loaderData);
    
    const allTrips = loaderData.allTrips as Trip[] | [];

    const pillItems = [
        {text: travelStyle, bg: '!bg-pink-50 !text-pink-500'},
        {text: groupType, bg: '!bg-primary-50 !text-primary-500'},
        {text: interests, bg: '!bg-success-50 !text-success-900'},
        {text: budget, bg: '!bg-navy-50 !text-navy-500'},
    ]

    const vistTimeAndWeatherInfo = [
        {title: 'Best Time to Visit:', items: bestTimeToVisit},
        {title: 'Weather', items: weatherInfo}
    ]

    return (
        <main className="travel-detail wrapper">
            <Header
                title="Trip Detail"
                description="View and Edit Ai Generated travel plan."
            />

            <section className="container wrapper-md">
                <header>
                    <h1 className="p-40-semibold text-dark-100">{name}</h1>

                    <div className="flex items-center gap-5">
                        <InfoPill
                            text={`${duration} day plan`}
                            image="/assets/icons/calendar.svg"
                        />

                        <InfoPill
                            text={
                                itinerary
                                    ?.slice(0, 2)
                                    .map((item) => item.location)
                                    .join(", ") || ""
                            }
                            image="/assets/icons/location-mark.svg"
                        />
                    </div>
                </header>

                <section className="gallery">
                    {imageUrls.map((url: string, i: number) => (
                        <img src={url} key={i} alt="" className={cn('w-full rounded-xl object-cover', i === 0 ? 'md:col-span-2 md:row-span-2 h-[330px]' : 'md:row-span-1 h-[150px]' )} />
                    ))}
                </section>

                <section className="flex gap-3 md:gap-5 items-center flex-wrap">
                    <ChipListComponent id="travel-chip">
                        <ChipsDirective>
                            {
                                pillItems.map((item, i) => (
                                    <ChipDirective 
                                        key={i}
                                        text={getFirstWord(item.text)}
                                        cssClass={`${item.bg} !text-base !font-medium !px-4`}
                                    />
                                ))
                            }
                        </ChipsDirective>
                    </ChipListComponent>

                    <ul className="flex items-center gap-1">
                        {
                            Array(5).fill(null).map((_, i) => (
                                <li key={i}>
                                    <img src="/assets/icons/star.svg" alt="star" className="size-[18px]" />
                                </li>
                            ))
                        }
                        <li className="ml-1">
                            <ChipListComponent>
                                <ChipsDirective>
                                    <ChipDirective
                                        text="4.8/5"
                                        cssClass="!bg-yellow-50 !text-yellow-700"
                                    />
                                </ChipsDirective>
                            </ChipListComponent>
                        </li>
                    </ul>
                </section>

                <section className="title">
                    <article>
                        <h3>
                            {duration}-Day {country} {travelStyle} Trip
                        </h3>
                        <p>
                            {budget}, {groupType} and {interests}
                        </p>
                    </article>

                    <h2>{estimatedPrice}</h2>
                </section>

                <p className="text-sm md:text-lg font-normal text-dark-400">{description}</p>

                <ul className="itinerary">
                    {itinerary?.map((dayPlan: DayPlan, i: number) => (
                        <li key={i}>
                            <h3>
                                Day {dayPlan.day}: {dayPlan.location}
                            </h3>
                            <ul>
                                {
                                    dayPlan.activities.map((activity, index: number) => (
                                        <li key={index}>
                                            <span className="flex-shring-0">
                                                {activity.time}
                                            </span>
                                            <p className="flew-grow">
                                                {activity.description}
                                            </p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))}
                </ul>

                {
                    vistTimeAndWeatherInfo.map((section) => (
                        <section  key={section.title} className="visit">
                            <div>
                                <h3>{section.title}</h3>
                                <ul>
                                    {
                                        section.items?.map((item) => (
                                            <li key={item}>
                                                <p className="flex-grow">
                                                    {item}
                                                </p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </section>
                    ))
                }

                <section>
                    <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

                    <div className="trip-grid">
                        {
                            allTrips.map(({id, name, imageUrls, itinerary, interests, travelStyle, estimatedPrice}) => (
                                <TripCard id={id} name={name} key={id} location={itinerary?.[0].location ?? ''} imageUrl={imageUrls[0]} tags={[interests, travelStyle]} price={estimatedPrice} />
                            ))
                        }
                    </div>
                </section>
            </section>
        </main>
    );
};

export default TripDetail;
