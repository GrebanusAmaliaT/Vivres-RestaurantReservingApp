import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import { RestaurantDto, CityDto, CatalogItemDto } from '../../../types/index';

import '../css/RestaurantListingPage.css';

import { ClientNavbar } from '../../../components/tsx/NavbarClient';
import { Footer } from '../../../components/tsx/Footer';


interface RestaurantListingPageProps {
    onBack: () => void;
    onSelectRestaurant: (restaurant: RestaurantDto) => void;
    userRole: string | null;
    onLogout: () => void;

    onAccountDetailsClick: () => void;
    onMyReservationsClick: () => void;
    onMyReviewsClick: () => void;
}

export const RestaurantListingPage: React.FC<RestaurantListingPageProps> = ({
    onBack,
    onSelectRestaurant,
    userRole,
    onLogout,
    onAccountDetailsClick,
    onMyReservationsClick,
    onMyReviewsClick
}) => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [cuisines, setCuisines] = useState<CatalogItemDto[]>([]);
    const [facilities, setFacilities] = useState<CatalogItemDto[]>([]);

    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [selectedCuisineId, setSelectedCuisineId] = useState<string>('');
    const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
    const [maxBudget, setMaxBudget] = useState<string>('');

    const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searching, setSearching] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [citiesData, cuisinesData, facilitiesData] = await Promise.all([
                    apiService.getCities(),
                    apiService.getCuisines(),
                    apiService.getFacilities()
                ]);

                setCities(citiesData);
                setCuisines(cuisinesData);
                setFacilities(facilitiesData);

                if (citiesData.length > 0) {
                    const firstCityId = citiesData[0].id;
                    setSelectedCityId(firstCityId);

                    const restaurantsData = await apiService.getFilteredRestaurants(firstCityId);
                    setRestaurants(restaurantsData);
                }
            } catch (error) {
                console.error('Eroare la incarcarea restaurantelor:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = async () => {
        if (!selectedCityId) {
            alert('Selecteaza un oras.');
            return;
        }

        try {
            setSearching(true);

            const budgetValue = maxBudget ? Number(maxBudget) : undefined;

            const data = await apiService.getFilteredRestaurants(
                selectedCityId,
                selectedCuisineId || undefined,
                budgetValue,
                selectedFacilityId || undefined
            );

            setRestaurants(data);
        } catch (error) {
            console.error('Eroare la filtrarea restaurantelor:', error);
        } finally {
            setSearching(false);
        }
    };

    const clearFilters = async () => {
        setSelectedCuisineId('');
        setSelectedFacilityId('');
        setMaxBudget('');

        if (!selectedCityId) {
            return;
        }

        try {
            setSearching(true);
            const data = await apiService.getFilteredRestaurants(selectedCityId);
            setRestaurants(data);
        } catch (error) {
            console.error('Eroare la resetarea filtrelor:', error);
        } finally {
            setSearching(false);
        }
    };

    const getRestaurantImage = (restaurant: RestaurantDto): string => {
        const imageUrl = restaurant.image1Url || restaurant.image2Url || restaurant.image3Url;

        if (!imageUrl) {
            return '';
        }

        return `https://localhost:7065${imageUrl}`;
    };

    const getMoodLabel = (mood: number): string => {
        switch (mood) {
            case 0:
                return 'Intim';
            case 1:
                return 'Romantic';
            case 2:
                return 'Elegant';
            case 3:
                return 'Vibrant';
            case 4:
                return 'Familial';
            case 5:
                return 'Traditional';
            default:
                return 'Vivres';
        }
    };

    if (loading) {
        return (
            <div className="restaurant-listing-loading">
                <div className="spinner-border text-dark" role="status"></div>
                <p>Se incarca restaurantele...</p>
            </div>
        );
    }

    return (
        <div className="restaurant-listing-page">
            <ClientNavbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
                onAccountDetailsClick={onAccountDetailsClick}
                onMyReservationsClick={onMyReservationsClick}
                onMyReviewsClick={onMyReviewsClick}
            />

            <div className="restaurant-listing-page">

                <main className="restaurant-listing-container">
                    <section className="restaurant-listing-hero">
                        <span className="restaurant-listing-kicker">
                            Rezerva o masa
                        </span>

                        <h1>
                            Descopera restaurantele potrivite pentru seara ta
                        </h1>

                        <p>
                            Alege orasul, filtreaza dupa specific, buget sau facilitati
                            si gaseste locul in care vrei sa trimiti o cerere de rezervare.
                        </p>
                    </section>

                    <section className="restaurant-filter-card">
                        <div className="restaurant-filter-group">
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

                        <div className="restaurant-filter-group">
                            <label>Bucatarie</label>
                            <select
                                value={selectedCuisineId}
                                onChange={(e) => setSelectedCuisineId(e.target.value)}
                            >
                                <option value="">Toate</option>
                                {cuisines.map(cuisine => (
                                    <option key={cuisine.id} value={cuisine.id}>
                                        {cuisine.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="restaurant-filter-group">
                            <label>Buget maxim</label>
                            <input
                                type="number"
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(e.target.value)}
                                placeholder="RON"
                            />
                        </div>

                        <div className="restaurant-filter-group">
                            <label>Facilitate</label>
                            <select
                                value={selectedFacilityId}
                                onChange={(e) => setSelectedFacilityId(e.target.value)}
                            >
                                <option value="">Toate</option>
                                {facilities.map(facility => (
                                    <option key={facility.id} value={facility.id}>
                                        {facility.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="restaurant-filter-actions">
                            <button
                                type="button"
                                className="restaurant-search-btn"
                                onClick={handleSearch}
                                disabled={searching}
                            >
                                {searching ? 'Se cauta...' : 'Cauta'}
                            </button>

                            <button
                                type="button"
                                className="restaurant-clear-btn"
                                onClick={clearFilters}
                                disabled={searching}
                            >
                                Reseteaza
                            </button>
                        </div>
                    </section>

                    <section className="restaurant-results-section">
                        <div className="restaurant-results-header">
                            <div>
                                <span className="restaurant-listing-kicker">
                                    Restaurante
                                </span>
                                <h2>Rezultatele cautarii</h2>
                            </div>

                            <p>
                                {restaurants.length} restaurante gasite
                            </p>
                        </div>

                        {restaurants.length === 0 ? (
                            <div className="restaurant-empty-state">
                                <h3>Nu am gasit restaurante</h3>
                                <p>
                                    Incearca alte filtre sau selecteaza alt oras.
                                </p>
                            </div>
                        ) : (
                            <div className="restaurant-grid">
                                {restaurants.map(restaurant => {
                                    const imageUrl = getRestaurantImage(restaurant);

                                    return (
                                        <article
                                            key={restaurant.id}
                                            className="restaurant-card"
                                            onClick={() => onSelectRestaurant(restaurant)}
                                        >
                                            <div className="restaurant-card-image">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={restaurant.name}
                                                    />
                                                ) : (
                                                    <div className="restaurant-card-placeholder">
                                                        VIVRES
                                                    </div>
                                                )}

                                                <div className="restaurant-card-badge">
                                                    {getMoodLabel(restaurant.mood)}
                                                </div>
                                            </div>

                                            <div className="restaurant-card-content">
                                                <div className="restaurant-card-main">
                                                    <h3>{restaurant.name}</h3>

                                                    <span className="restaurant-budget">
                                                        {restaurant.averageBudget} RON / pers.
                                                    </span>
                                                </div>

                                                <p className="restaurant-address">
                                                    {restaurant.address}
                                                </p>

                                                <p className="restaurant-description">
                                                    {restaurant.description}
                                                </p>

                                                <div className="restaurant-card-footer">
                                                    <span>
                                                        Capacitate {restaurant.capacity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectRestaurant(restaurant);
                                                        }}
                                                    >
                                                        Vezi detalii
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
                </div>

            <Footer/>
        </div>
    );
};