import * as React from 'react';
import { useState } from 'react';
import { RestaurantDto } from '../../../types';
import { apiService } from '../../../services/api';
import '../css/ReservationPage.css';

import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';

interface ReservationPageProps {
    restaurant: RestaurantDto | null;
    onBack: () => void;
    onReservationSent?: () => void;
    userRole: string | null;
    onLogout: () => void;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({
    restaurant,
    onBack,
    onReservationSent,
    userRole,
    onLogout
}) => {
    const [reservationDate, setReservationDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
    const [specialRequests, setSpecialRequests] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const getRestaurantImage = (): string => {
        if (!restaurant) return '';

        const imageUrl =
            restaurant.image1Url ||
            restaurant.image2Url ||
            restaurant.image3Url;

        if (!imageUrl) return '';

        return `https://localhost:7065${imageUrl}`;
    };

    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    const normalizeTime = (value?: string): string => {
        if (!value) return '00:00';
        return value.substring(0, 5);
    };

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes: number): string => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;
    };

    const generateTimeSlots = () => {
        if (!restaurant) return [];

        const opening = timeToMinutes(normalizeTime(restaurant.openingTime));
        const closing = timeToMinutes(normalizeTime(restaurant.closingTime));
        const durationMinutes = Math.round(
            (restaurant.defaultReservationDurationInHours || 2) * 60
        );

        const slots: { value: string; label: string }[] = [];

        for (
            let start = opening;
            start + durationMinutes <= closing;
            start += durationMinutes
        ) {
            const end = start + durationMinutes;

            slots.push({
                value: minutesToTime(start),
                label: `${minutesToTime(start)} - ${minutesToTime(end)}`
            });
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!restaurant) {
            alert('Nu exista restaurant selectat.');
            return;
        }

        if (!reservationDate || !selectedTimeSlot) {
            alert('Selecteaza data si intervalul orar al rezervarii.');
            return;
        }
        const reservationDateTime = `${reservationDate}T${selectedTimeSlot}:00`;

        if (numberOfPeople < 1) {
            alert('Numarul de persoane trebuie sa fie cel putin 1.');
            return;
        }

        if (numberOfPeople > restaurant.capacity) {
            alert('Numarul de persoane depaseste capacitatea restaurantului.');
            return;
        }

        
        try {
            setIsSubmitting(true);

            await apiService.createReservation({
                restaurantId: restaurant.id,
                reservationDate: reservationDateTime,
                numberOfPeople,
                specialRequests,
                isEvent: false,
                eventMenuType: null
            });

            alert('Cererea de rezervare a fost trimisa. Restaurantul trebuie sa o confirme.');

            if (onReservationSent) {
                onReservationSent();
            } else {
                onBack();
            }
        } catch (error: any) {
            console.error('Reservation error:', error);
            alert(error.message || 'A aparut o eroare la trimiterea cererii.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!restaurant) {
        return (
            <div className="reservation-page">
                <div className="reservation-empty">
                    <h1>Nu ai selectat niciun restaurant</h1>
                    <p>Intoarce-te la lista de restaurante si alege unul pentru rezervare.</p>
                    <button type="button" onClick={onBack}>
                        Inapoi la restaurante
                    </button>
                </div>
            </div>
        );
    }

    const imageUrl = getRestaurantImage();

    return (
        <div className="restaurant-reservation-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
            />
            <div className="reservation-page">
           
            <main className="reservation-container">
                <section className="reservation-hero">
                    <span className="reservation-kicker">Cerere de rezervare</span>

                    <h1>{restaurant.name}</h1>

                    <p>
                        Alege data, ora si numarul de persoane. Rezervarea va fi trimisa
                        catre restaurant si va ramane in asteptare pana la confirmarea managerului.
                    </p>
                </section>

                <section className="reservation-layout">
                    <article className="reservation-restaurant-card">
                        <div className="reservation-restaurant-image">
                            {imageUrl ? (
                                <img src={imageUrl} alt={restaurant.name} />
                            ) : (
                                <div className="reservation-image-placeholder">
                                    VIVRES
                                </div>
                            )}
                        </div>

                        <div className="reservation-restaurant-info">
                            <span className="reservation-kicker">Restaurant selectat</span>

                            <h2>{restaurant.name}</h2>

                            <p className="reservation-address">
                                {restaurant.address}
                            </p>

                            <p className="reservation-description">
                                {restaurant.description}
                            </p>

                            <div className="reservation-info-grid">
                                <div>
                                    <span>Buget mediu</span>
                                    <strong>{restaurant.averageBudget} RON / pers.</strong>
                                </div>

                                <div>
                                    <span>Capacitate</span>
                                    <strong>{restaurant.capacity} persoane</strong>
                                </div>
                            </div>

                            {restaurant.otherFacilities && (
                                <p className="reservation-extra">
                                    {restaurant.otherFacilities}
                                </p>
                            )}
                        </div>
                    </article>

                    <form className="reservation-form-card" onSubmit={handleSubmit}>
                        <div className="reservation-form-header">
                            <span className="reservation-kicker">Detalii rezervare</span>
                            <h2>Trimite cererea</h2>
                            <p>
                                Confirmarea finala va fi facuta de managerul restaurantului.
                            </p>
                        </div>

                        <div className="reservation-form-row">
                            <div className="reservation-field">
                                <label>Data</label>
                                <input
                                    type="date"
                                    min={getTodayDate()}
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="reservation-field">
                                <label>Interval orar</label>
                                <select
                                    value={selectedTimeSlot}
                                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                    required
                                >
                                    <option value="">Alege intervalul</option>

                                    {timeSlots.map(slot => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                                {timeSlots.length === 0 && (
                                    <p className="text-danger small mt-2">
                                        Restaurantul nu are intervale disponibile. Verifica programul setat de manager.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="reservation-field">
                            <label>Numar persoane</label>
                            <input
                                type="number"
                                min={1}
                                max={restaurant.capacity}
                                value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="reservation-field">
                            <label>Observatii speciale</label>
                            <textarea
                                rows={4}
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Ex: masa la geam, aniversare, preferinte speciale"
                            />
                        </div>

                        <div className="reservation-note">
                            <strong>Status initial:</strong> Pending. Restaurantul trebuie sa accepte
                            cererea inainte ca rezervarea sa fie confirmata.
                        </div>

                        <button
                            type="submit"
                            className="reservation-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
         <Footer />
        </div>
    );
};