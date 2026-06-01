import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { apiService } from '../../../services/api';
import type {
    CityDto,
    EventRestaurantListingDto,
    EventTypeDto,
    RestaurantEventOptionPublicDto
} from '../../../types/index';
import '../css/EventRestaurantListingPage.css';

interface EventRestaurantListingPageProps {
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
}

export const EventRestaurantListingPage: React.FC<EventRestaurantListingPageProps> = ({
    userRole,
    onLogout,
    onBack
}) => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [eventTypes, setEventTypes] = useState<EventTypeDto[]>([]);
    const [restaurants, setRestaurants] = useState<EventRestaurantListingDto[]>([]);

    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>('');
    const [numberOfPeople, setNumberOfPeople] = useState<string>('');
    const [maxPricePerPerson, setMaxPricePerPerson] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);
    const [searching, setSearching] = useState<boolean>(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                const [citiesData, eventTypesData] = await Promise.all([
                    apiService.getCities(),
                    apiService.getEventTypes()
                ]);

                setCities(citiesData);
                setEventTypes(eventTypesData);

                const cityId = citiesData.length > 0 ? citiesData[0].id : '';
                setSelectedCityId(cityId);

                const restaurantData = await apiService.getEventRestaurants(cityId || undefined);
                setRestaurants(restaurantData);
            } catch (error) {
                console.error('Eroare la incarcarea restaurantelor pentru evenimente:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleSearch = async () => {
        try {
            setSearching(true);

            const guests = numberOfPeople ? Number(numberOfPeople) : undefined;
            const budget = maxPricePerPerson ? Number(maxPricePerPerson) : undefined;

            const data = await apiService.getEventRestaurants(
                selectedCityId || undefined,
                selectedEventTypeId || undefined,
                guests,
                budget
            );

            setRestaurants(data);
        } catch (error) {
            console.error('Eroare la filtrarea restaurantelor pentru evenimente:', error);
        } finally {
            setSearching(false);
        }
    };

    const clearFilters = async () => {
        setSelectedEventTypeId('');
        setNumberOfPeople('');
        setMaxPricePerPerson('');

        try {
            setSearching(true);

            const data = await apiService.getEventRestaurants(selectedCityId || undefined);
            setRestaurants(data);
        } catch (error) {
            console.error('Eroare la resetarea filtrelor de evenimente:', error);
        } finally {
            setSearching(false);
        }
    };

    const getRestaurantImage = (restaurant: EventRestaurantListingDto): string => {
        const imageUrl = restaurant.image1Url || restaurant.image2Url || restaurant.image3Url;

        if (!imageUrl) {
            return '';
        }

        return `https://localhost:7065${imageUrl}`;
    };

    const getMainOption = (
        restaurant: EventRestaurantListingDto
    ): RestaurantEventOptionPublicDto | null => {
        if (selectedEventTypeId) {
            return restaurant.eventOptions.find(
                option => option.eventTypeId === selectedEventTypeId
            ) ?? restaurant.eventOptions[0] ?? null;
        }

        return restaurant.eventOptions[0] ?? null;
    };

    if (loading) {
        return (
            <div className="event-listing-page">
                <Navbar
                    userRole={userRole}
                    onLogout={onLogout}
                    onBack={onBack}
                />

                <div className="event-listing-loading">
                    <div className="spinner-border text-dark" role="status"></div>
                    <p>Se incarca restaurantele pentru evenimente...</p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="event-listing-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
            />

            <main className="event-listing-container">
                <section className="event-listing-hero">
                    <span className="event-listing-kicker">
                        Plan your event
                    </span>

                    <h1>
                        Alege locul potrivit pentru un eveniment memorabil
                    </h1>

                    <p>
                        Descopera restaurante care organizeaza evenimente speciale,
                        de la nunti si botezuri pana la evenimente corporate, aniversari
                        sau cine private.
                    </p>
                </section>

                <section className="event-filter-panel">
                    <div className="event-filter-field">
                        <label>Oras</label>
                        <select
                            value={selectedCityId}
                            onChange={(e) => setSelectedCityId(e.target.value)}
                        >
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="event-filter-field">
                        <label>Tip eveniment</label>
                        <select
                            value={selectedEventTypeId}
                            onChange={(e) => setSelectedEventTypeId(e.target.value)}
                        >
                            <option value="">Toate evenimentele</option>

                            {eventTypes.map(eventType => (
                                <option key={eventType.id} value={eventType.id}>
                                    {eventType.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="event-filter-field">
                        <label>Numar persoane</label>
                        <input
                            type="number"
                            min={1}
                            value={numberOfPeople}
                            onChange={(e) => setNumberOfPeople(e.target.value)}
                            placeholder="Ex: 80"
                        />
                    </div>

                    <div className="event-filter-field">
                        <label>Buget max. / persoana</label>
                        <input
                            type="number"
                            min={1}
                            value={maxPricePerPerson}
                            onChange={(e) => setMaxPricePerPerson(e.target.value)}
                            placeholder="RON"
                        />
                    </div>

                    <div className="event-filter-actions">
                        <button
                            type="button"
                            className="event-search-btn"
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching ? 'Se cauta...' : 'Cauta'}
                        </button>

                        <button
                            type="button"
                            className="event-clear-btn"
                            onClick={clearFilters}
                            disabled={searching}
                        >
                            Reseteaza
                        </button>
                    </div>
                </section>

                <section className="event-results-header">
                    <div>
                        <span className="event-listing-kicker">
                            Restaurante pentru evenimente
                        </span>
                        <h2>Locatii recomandate</h2>
                    </div>

                    <p>{restaurants.length} restaurante gasite</p>
                </section>

                {restaurants.length === 0 ? (
                    <div className="event-empty-state">
                        <h3>Nu am gasit restaurante potrivite</h3>
                        <p>
                            Incearca alte filtre sau selecteaza un alt tip de eveniment.
                        </p>
                    </div>
                ) : (
                    <section className="event-restaurant-list">
                        {restaurants.map(restaurant => {
                            const imageUrl = getRestaurantImage(restaurant);
                            const mainOption = getMainOption(restaurant);

                            return (
                                <article
                                    className="event-restaurant-card"
                                    key={restaurant.id}
                                >
                                    <div className="event-restaurant-image-wrap">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={restaurant.name} />
                                        ) : (
                                            <div className="event-image-placeholder">
                                                VIVRES
                                            </div>
                                        )}

                                        <div className="event-image-overlay">
                                            <span>{restaurant.cityName}</span>
                                        </div>
                                    </div>

                                    <div className="event-restaurant-content">
                                        <div className="event-card-heading">
                                            <span className="event-listing-kicker">
                                                {mainOption?.eventTypeName ?? 'Evenimente speciale'}
                                            </span>

                                            <h3>{restaurant.name}</h3>

                                            <p className="event-card-address">
                                                {restaurant.address}
                                            </p>
                                        </div>

                                        <p className="event-card-description">
                                            {restaurant.description}
                                        </p>

                                        <div className="event-card-meta">
                                            <div>
                                                <span>De la</span>
                                                <strong>
                                                    {restaurant.minEventPricePerPerson} RON / pers.
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Capacitate</span>
                                                <strong>
                                                    pana la {restaurant.capacity} persoane
                                                </strong>
                                            </div>

                                            {mainOption && (
                                                <div>
                                                    <span>Minim</span>
                                                    <strong>
                                                        {mainOption.minPeople} persoane
                                                    </strong>
                                                </div>
                                            )}
                                        </div>

                                        {mainOption?.details && (
                                            <p className="event-option-details">
                                                {mainOption.details}
                                            </p>
                                        )}

                                        <div className="event-tags">
                                            {restaurant.eventOptions.slice(0, 4).map(option => (
                                                <span key={option.eventTypeId}>
                                                    {option.eventTypeName}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="event-card-footer">
                                            <button
                                                type="button"
                                                className="event-primary-btn"
                                                onClick={() => {
                                                    alert('Urmatorul pas va fi formularul pentru cererea de eveniment.');
                                                }}
                                            >
                                                Planifica evenimentul
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};