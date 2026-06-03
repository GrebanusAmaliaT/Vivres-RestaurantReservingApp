import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { apiService } from '../../../services/api';
import type {
    EventRestaurantListingDto,
    RestaurantEventMenuOptionPublicDto,
    RestaurantEventOptionPublicDto
} from '../../../types/index';
import '../css/EventReservationPage.css';

interface EventReservationPageProps {
    restaurant: EventRestaurantListingDto | null;
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
    onRequestSent: () => void;
}

export const EventReservationPage: React.FC<EventReservationPageProps> = ({
    restaurant,
    userRole,
    onLogout,
    onBack,
    onRequestSent
}) => {
    const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>(
        restaurant?.eventOptions[0]?.eventTypeId ?? ''
    );

    const [eventDate, setEventDate] = useState<string>('');
    const [menuQuantities, setMenuQuantities] = useState<Record<string, number>>({});
    const [specialRequests, setSpecialRequests] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const selectedOption = useMemo<RestaurantEventOptionPublicDto | null>(() => {
        if (!restaurant) return null;

        return restaurant.eventOptions.find(
            option => option.eventTypeId === selectedEventTypeId
        ) ?? restaurant.eventOptions[0] ?? null;
    }, [restaurant, selectedEventTypeId]);

    const availableMenus: RestaurantEventMenuOptionPublicDto[] =
        selectedOption?.menuOptions ?? [];

    const totalPeople = availableMenus.reduce(
        (sum: number, menu: RestaurantEventMenuOptionPublicDto) => {
            return sum + (menuQuantities[menu.id] || 0);
        },
        0
    );

    const estimatedTotal = availableMenus.reduce(
        (sum: number, menu: RestaurantEventMenuOptionPublicDto) => {
            return sum + ((menuQuantities[menu.id] || 0) * menu.pricePerPerson);
        },
        0
    );

    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    const handleEventTypeChange = (eventTypeId: string) => {
        setSelectedEventTypeId(eventTypeId);
        setMenuQuantities({});
    };

    const updateMenuQuantity = (menuOptionId: string, quantity: number) => {
        setMenuQuantities(prev => ({
            ...prev,
            [menuOptionId]: Math.max(0, quantity)
        }));
    };

    const validateForm = (): boolean => {
        if (!restaurant || !selectedOption) {
            alert('Nu exista restaurant sau tip de eveniment selectat.');
            return false;
        }

        if (!eventDate) {
            alert('Selecteaza data evenimentului.');
            return false;
        }

        if (availableMenus.length === 0) {
            alert('Restaurantul nu are meniuri configurate pentru acest tip de eveniment.');
            return false;
        }

        if (totalPeople <= 0) {
            alert('Selecteaza cel putin un meniu si numarul de persoane.');
            return false;
        }

        if (totalPeople < selectedOption.minPeople) {
            alert(`Numarul minim de persoane pentru acest eveniment este ${selectedOption.minPeople}.`);
            return false;
        }

        if (selectedOption.maxPeople && totalPeople > selectedOption.maxPeople) {
            alert(`Numarul maxim de persoane pentru acest eveniment este ${selectedOption.maxPeople}.`);
            return false;
        }

        if (totalPeople > restaurant.capacity) {
            alert('Numarul de persoane depaseste capacitatea restaurantului.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!restaurant || !selectedOption) return;
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            await apiService.createReservation({
                restaurantId: restaurant.id,
                reservationDate: `${eventDate}T12:00:00`,
                numberOfPeople: totalPeople,
                specialRequests,
                isEvent: true,
                eventTypeId: selectedOption.eventTypeId,
                eventMenuType: selectedOption.eventTypeName,
                menuSelections: availableMenus
                    .filter(menu => (menuQuantities[menu.id] || 0) > 0)
                    .map(menu => ({
                        restaurantEventMenuOptionId: menu.id,
                        quantity: menuQuantities[menu.id]
                    }))
            });

            alert('Cererea pentru eveniment a fost trimisa. Restaurantul trebuie sa o confirme.');
            onRequestSent();
        } catch (error: any) {
            console.error('Event reservation error:', error);
            alert(error.message || 'A aparut o eroare la trimiterea cererii pentru eveniment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!restaurant) {
        return (
            <div className="event-request-page">
                <Navbar userRole={userRole} onLogout={onLogout} onBack={onBack} />

                <main className="event-request-empty">
                    <h1>Nu ai selectat niciun restaurant</h1>
                    <p>Intoarce-te la pagina de evenimente si alege o locatie.</p>
                    <button type="button" onClick={onBack}>
                        Inapoi
                    </button>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="event-request-page">
            <Navbar userRole={userRole} onLogout={onLogout} onBack={onBack} />

            <main className="event-request-container">
                <section className="event-request-hero">
                    <span className="event-request-kicker">cerere eveniment</span>
                    <h1>Planifica evenimentul la {restaurant.name}</h1>
                    <p>
                        Completeaza detaliile evenimentului. Cererea va fi trimisa catre
                        restaurant si va ramane in asteptare pana la confirmarea managerului.
                    </p>
                </section>

                <section className="event-request-timeline">
                    <div>
                        <span>1</span>
                        <strong>Trimite cererea</strong>
                        <p>Alegi data, tipul evenimentului si meniurile dorite.</p>
                    </div>

                    <div>
                        <span>2</span>
                        <strong>Restaurantul verifica</strong>
                        <p>Managerul analizeaza disponibilitatea si detaliile.</p>
                    </div>

                    <div>
                        <span>3</span>
                        <strong>Primeste confirmarea</strong>
                        <p>Statusul se schimba dupa acceptare.</p>
                    </div>

                    <div>
                        <span>4</span>
                        <strong>Stabiliti detaliile finale</strong>
                        <p>Meniurile si serviciile finale se pot confirma ulterior.</p>
                    </div>
                </section>

                <section className="event-request-layout">
                    <form className="event-request-form-card" onSubmit={handleSubmit}>
                        <div className="event-request-form-header">
                            <span className="event-request-kicker">detalii cerere</span>
                            <h2>Spune-ne ce vrei sa organizezi</h2>
                        </div>

                        <div className="event-request-field">
                            <label>Tip eveniment</label>
                            <select
                                value={selectedEventTypeId}
                                onChange={(e) => handleEventTypeChange(e.target.value)}
                                required
                            >
                                {restaurant.eventOptions.map(option => (
                                    <option key={option.eventTypeId} value={option.eventTypeId}>
                                        {option.eventTypeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="event-request-field">
                            <label>Data dorita</label>
                            <input
                                type="date"
                                min={getTodayDate()}
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="event-request-menus">
                            <label className="event-request-menu-section-label">
                                Meniuri si numar persoane
                            </label>

                            {availableMenus.length === 0 ? (
                                <p className="event-request-no-menus">
                                    Nu exista meniuri disponibile pentru acest tip de eveniment.
                                </p>
                            ) : (
                                availableMenus.map(menu => (
                                    <div className="event-request-menu-row" key={menu.id}>
                                        <div>
                                            <strong>{menu.menuTypeName}</strong>
                                            <span>{menu.pricePerPerson} RON / persoana</span>
                                            {menu.details && <p>{menu.details}</p>}
                                        </div>

                                        <input
                                            type="number"
                                            min={0}
                                            value={menuQuantities[menu.id] || 0}
                                            onChange={(e) =>
                                                updateMenuQuantity(menu.id, Number(e.target.value))
                                            }
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="event-request-field">
                            <label>Mesaj pentru restaurant</label>
                            <textarea
                                rows={4}
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Scrie detalii despre eveniment, program, atmosfera dorita sau alte cerinte."
                            />
                        </div>

                        <button
                            type="submit"
                            className="event-request-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
                        </button>
                    </form>

                    <aside className="event-request-summary-card">
                        <span className="event-request-kicker">cost estimativ</span>

                        <h2>{estimatedTotal.toLocaleString('ro-RO')} RON</h2>

                        <p>
                            Calculat automat pe baza meniurilor selectate si a numarului de persoane.
                        </p>

                        <div className="event-request-summary-details">
                            <div>
                                <span>Tip eveniment</span>
                                <strong>{selectedOption?.eventTypeName ?? '-'}</strong>
                            </div>

                            <div>
                                <span>Total invitati</span>
                                <strong>{totalPeople}</strong>
                            </div>

                            <div>
                                <span>Restaurant</span>
                                <strong>{restaurant.name}</strong>
                            </div>

                            <div>
                                <span>Status initial</span>
                                <strong>Pending</strong>
                            </div>
                        </div>

                        <div className="event-request-selected-menus">
                            {availableMenus
                                .filter(menu => (menuQuantities[menu.id] || 0) > 0)
                                .map(menu => (
                                    <div key={menu.id}>
                                        <span>
                                            {menu.menuTypeName} x {menuQuantities[menu.id]}
                                        </span>
                                        <strong>
                                            {(
                                                menu.pricePerPerson *
                                                (menuQuantities[menu.id] || 0)
                                            ).toLocaleString('ro-RO')} RON
                                        </strong>
                                    </div>
                                ))}
                        </div>

                        <div className="event-request-summary-note">
                            Costul este orientativ. Restaurantul poate confirma detaliile finale
                            dupa analizarea cererii.
                        </div>
                    </aside>
                </section>
            </main>

            <Footer />
        </div>
    );
};