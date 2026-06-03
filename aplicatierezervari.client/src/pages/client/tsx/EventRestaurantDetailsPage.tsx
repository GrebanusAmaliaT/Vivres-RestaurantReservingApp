import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import type {
    EventRestaurantListingDto,
    RestaurantEventOptionPublicDto
} from '../../../types/index';
import '../css/EventRestaurantDetailsPage.css';

interface EventRestaurantDetailsPageProps {
    restaurant: EventRestaurantListingDto | null;
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
    onStartEventRequest: (restaurant: EventRestaurantListingDto) => void;
}

export const EventRestaurantDetailsPage: React.FC<EventRestaurantDetailsPageProps> = ({
    restaurant,
    userRole,
    onLogout,
    onBack,
    onStartEventRequest
}) => {
    if (!restaurant) {
        return (
            <div className="event-details-page">
                <Navbar
                    userRole={userRole}
                    onLogout={onLogout}
                    onBack={onBack}
                />

                <main className="event-details-empty">
                    <h1>Nu ai selectat niciun restaurant</h1>
                    <p>Intoarce-te la lista de restaurante si alege o locatie pentru eveniment.</p>
                    <button type="button" onClick={onBack}>
                        Inapoi
                    </button>
                </main>

                <Footer />
            </div>
        );
    }

    const images = [
        restaurant.image1Url,
        restaurant.image2Url,
        restaurant.image3Url
    ].filter(Boolean) as string[];

    const getImageUrl = (imageUrl?: string | null) => {
        if (!imageUrl) return '';
        return `https://localhost:7065${imageUrl}`;
    };

    const mainImage = getImageUrl(images[0]);
    const secondImage = getImageUrl(images[1]);
    const thirdImage = getImageUrl(images[2]);

    const minPrice = restaurant.minEventPricePerPerson;
    const cheapestOption = restaurant.eventOptions.reduce<RestaurantEventOptionPublicDto | null>(
        (current, option) => {
            if (!current) return option;
            return option.pricePerPerson < current.pricePerPerson ? option : current;
        },
        null
    );

    return (
        <div className="event-details-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
            />

            <main className="event-details-container">
                <section className="event-details-hero">
                    <div className="event-details-hero-content">
                        <span className="event-details-kicker">
                            locatie pentru evenimente
                        </span>

                        <h1>{restaurant.name}</h1>

                        <p>
                            {restaurant.description}
                        </p>

                        <div className="event-details-hero-meta">
                            <span>{restaurant.cityName}</span>
                            <span>{restaurant.capacity} persoane</span>
                            <span>de la {minPrice} RON / persoana</span>
                        </div>

                        <button
                            type="button"
                            className="event-details-primary-btn"
                            onClick={() => onStartEventRequest(restaurant)}
                        >
                            Solicita eveniment
                        </button>
                    </div>

                    <div className="event-details-gallery">
                        <div className="event-details-main-image">
                            {mainImage ? (
                                <img src={mainImage} alt={restaurant.name} />
                            ) : (
                                <div className="event-details-placeholder">VIVRES</div>
                            )}
                        </div>

                        <div className="event-details-side-images">
                            {secondImage ? (
                                <img src={secondImage} alt={`${restaurant.name} interior`} />
                            ) : (
                                <div className="event-details-small-placeholder">VIVRES</div>
                            )}

                            {thirdImage ? (
                                <img src={thirdImage} alt={`${restaurant.name} events`} />
                            ) : (
                                <div className="event-details-small-placeholder">VIVRES</div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="event-details-overview">
                    <div className="event-details-info-card">
                        <span className="event-details-kicker">adresa</span>
                        <h2>Locatie</h2>
                        <p>{restaurant.address}</p>
                    </div>

                    <div className="event-details-info-card">
                        <span className="event-details-kicker">capacitate</span>
                        <h2>{restaurant.capacity} persoane</h2>
                        <p>
                            Potrivit pentru evenimente intime, mese private sau evenimente
                            mai ample, in functie de tipul configurat de restaurant.
                        </p>
                    </div>

                    <div className="event-details-info-card">
                        <span className="event-details-kicker">pret orientativ</span>
                        <h2>de la {minPrice} RON</h2>
                        <p>
                            Pretul este calculat per persoana si poate varia in functie de
                            tipul evenimentului si optiunile alese.
                        </p>
                    </div>
                </section>

                <section className="event-details-section">
                    <div className="event-details-section-header">
                        <span className="event-details-kicker">tipuri de evenimente</span>
                        <h2>Ce poti organiza aici</h2>
                        <p>
                            Restaurantul a configurat urmatoarele tipuri de evenimente.
                            Fiecare are pret, numar minim de persoane si detalii proprii.
                        </p>
                    </div>

                    <div className="event-details-options-grid">
                        {restaurant.eventOptions.map(option => (
                            <article
                                className="event-details-option-card"
                                key={option.eventTypeId}
                            >
                                <div>
                                    <span className="event-details-kicker">
                                        {option.eventTypeCode}
                                    </span>
                                    <h3>{option.eventTypeName}</h3>
                                </div>

                                <div className="event-details-option-price">
                                    {option.pricePerPerson} RON
                                    <span>/ persoana</span>
                                </div>

                                <div className="event-details-option-meta">
                                    <span>minim {option.minPeople} persoane</span>

                                    {option.maxPeople && (
                                        <span>maxim {option.maxPeople} persoane</span>
                                    )}
                                </div>

                                {option.details && (
                                    <p>{option.details}</p>
                                )}
                            </article>
                        ))}
                    </div>
                </section>

                <section className="event-details-highlight-section">
                    <div className="event-details-highlight-content">
                        <span className="event-details-kicker">de ce merita</span>
                        <h2>O locatie gandita pentru momente care trebuie sa arate bine</h2>

                        <p>
                            Pagina aceasta va putea fi extinsa ulterior cu servicii extra:
                            decor, muzica live, open bar, candy bar, meniuri personalizate,
                            aranjamente florale sau pachete speciale pentru evenimente.
                        </p>
                    </div>

                    <div className="event-details-highlight-list">
                        <div>
                            <strong>Evenimente configurabile</strong>
                            <span>Alegi tipul evenimentului si numarul de invitati.</span>
                        </div>

                        <div>
                            <strong>Cost estimativ</strong>
                            <span>Aplicatia poate calcula automat pretul total estimat.</span>
                        </div>

                        <div>
                            <strong>Cerere cu aprobare</strong>
                            <span>Restaurantul confirma sau respinge cererea in dashboard.</span>
                        </div>

                        <div>
                            <strong>Review-uri reale</strong>
                            <span>Ulterior afisam experientele clientilor anteriori.</span>
                        </div>
                    </div>
                </section>

                <section className="event-details-reviews-section">
                    <div className="event-details-section-header">
                        <span className="event-details-kicker">review-uri</span>
                        <h2>Experientele clientilor</h2>
                        <p>
                            Aici vor aparea review-urile reale lasate de clientii care au
                            organizat evenimente sau au rezervat mese in acest restaurant.
                        </p>
                    </div>

                    <div className="event-details-reviews-placeholder">
                        <div className="event-details-review-card">
                            <div className="event-details-review-stars">★★★★★</div>
                            <p>
                                Review-urile vor fi disponibile dupa ce implementam sistemul
                                de feedback al clientilor.
                            </p>
                            <span>Vivres Reviews</span>
                        </div>

                        <div className="event-details-review-card muted">
                            <div className="event-details-review-stars">★★★★★</div>
                            <p>
                                Vom putea afisa rating mediu, comentarii, data evenimentului
                                si tipul de rezervare.
                            </p>
                            <span>Coming soon</span>
                        </div>
                    </div>
                </section>

                <section className="event-details-final-cta">
                    <div>
                        <span className="event-details-kicker">
                            urmatorul pas
                        </span>
                        <h2>
                            {cheapestOption
                                ? `Planifica un ${cheapestOption.eventTypeName.toLowerCase()} la ${restaurant.name}`
                                : `Planifica evenimentul la ${restaurant.name}`}
                        </h2>
                        <p>
                            Trimite o cerere catre restaurant. Cererea ramane in asteptare
                            pana cand managerul o confirma.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="event-details-primary-btn"
                        onClick={() => onStartEventRequest(restaurant)}
                    >
                        Continua catre cerere
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    );
};