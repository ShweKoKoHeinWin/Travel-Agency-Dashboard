import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import React, { useState } from "react";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";


export const loader = async () => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/all?fields=name,latlng,flag,maps`);
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected response format");
        }

        return data.map((country: any) => ({
            name: country.flag + country.name.common,
            coordinates: country.latlng,
            value: country.name.common,
            openStreetMap: country.maps?.openStreetMap,
        }));
    } catch (error) {
        console.error("Failed to load countries:", error);
        return []; // Return empty array to prevent crash
    }
}

const CreateTrip = ({loaderData}: Route.ComponentProps) => {
    const navigate = useNavigate();
    const countries = loaderData as Country[];
    const countryData = countries.map((country) => ({
        text: `${country.name}`,
        value: country.value
    }))
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        budget: '',
        interests: '',
        duration: 0,
        groupType: ''
    })

    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState(false)

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if(
            !formData.country ||
            !formData.budget ||
            !formData.groupType ||
            !formData.travelStyle ||
            !formData.interests
        ) {
            setError('Please provide values for all fields.')
            setLoading(false);
            return;
        }

        if(formData.duration < 1 || formData.duration > 10) {
            setError('Duration must be 1 and 10 days.')
            setLoading(false);
            return;
        }

        const user = await account.get();
        if(!user.$id) {
            console.error('User is not authenticated.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interests,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id,
                })
            })
            const result: CreateTripResponse = await response.json();

            if(result?.id) navigate(`/trips/${result.id}`);
            else console.error('Failed to generate a trip')
        } catch (e) {
            console.error('Error generating trip', e);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({...formData, [key]: value})
    }
    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI Generated travel plans"
            />
            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{text: 'text', value: 'value'}}
                            placeholder="Select A Country"
                            className="combo-box"
                            change={(e: {value: string | undefined}) => {
                                if(e.value) {
                                    handleChange('country', e.value)
                                }
                            }}
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();
                                e.updateData(countries.filter(country => country.name.toLowerCase().includes(query)).map(country => ({text: country.name, value: country.value})))
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input type="number" id="duration" name="duration" className="form-input placeholder:text-gray-100" placeholder="Enter a number of days (5, 12 ...)" onChange={(e) => handleChange('duration', Number(e.target.value))} />
                    </div>

                    {
                        selectItems.map((key) => (
                            <div key={key}>
                                <label htmlFor={key}>{formatKey(key)}</label>
                                <ComboBoxComponent
                                    id={key}
                                    className="combo-box"
                                    dataSource={comboBoxItems[key].map((item) => ({
                                        text: item,
                                        value: item,
                                    }))}
                                    fields={{text: 'text', value: 'value'}}
                                    placeholder={`Select ${key}`}
                                    change={(e: {value: string | undefined}) => {
                                        if(e.value) {
                                            handleChange(key, e.value)
                                        }
                                    }}
                                    allowFiltering
                                    filtering={(e) => {
                                        const query = e.text.toLowerCase();
                                        e.updateData(comboBoxItems[key ].filter(item => item.toLowerCase().includes(query)).map(item => ({text: item, value: item})))
                                    }}
                                />
                            </div>
                        ))
                    }

                    <div>
                        <label htmlFor="location">Location</label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{colorValuePath: 'color', fill: '#e5e5e5'}}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full"  />

                    {
                        error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )
                    }

                    <footer className="px-6 w-full">
                        <ButtonComponent type="submit" className="button-class !h-12 !w-full" disabled={loading}>
                            <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} alt="" className={cn('size-5', {'animate-spin' : loading})} />
                            <span className="p-16-semibold text-white">
                                {loading ? 'Generating...' : 'Generate Trip'}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
