import { useEffect, useMemo, useState } from 'react';
import { ClientNavbar } from '../../../components/tsx/NavbarClient';
import { Footer } from '../../../components/tsx/Footer';
import { apiService } from '../../../services/api';
import type { ReservationDto } from '../../../types/index';
import '../css/MyReservationsPage.css';

interface MyReservationsPageProps {
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
    onAccountDetailsClick: () => void;
    onMyReservationsClick: () => void;
    onMyReviewsClick: () => void;
}

type ReservationMainTab = 'Table' | 'Event';
type ReservationStatusTab = 'Pending' | 'Confirmed' | 'Cancelled' | 'Upcoming' | 'Past';

export const MyReservationsPage = ({
    userRole,
    onLogout,
    onBack,
    onAccountDetailsClick,
    onMyReservationsClick,
    onMyReviewsClick
}: MyReservationsPageProps) => {
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [mainTab, setMainTab] = useState<ReservationMainTab>('Table');
    const [statusTab, setStatusTab] = useState<ReservationStatusTab>('Upcoming');

    const [loading, setLoading] = useState<boolean>(true);
    const [selectedReservation, setSelectedReservation] = useState<ReservationDto | null>(null);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyReservations();
            setReservations(data);
        } catch (error) {
            console.error('Failed to load reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const isPastReservation = (reservation: ReservationDto) => {
        return new Date(reservation.reservationDate) < new Date();
    };

    const isUpcomingReservation = (reservation: ReservationDto) => {
        return (
            reservation.status.toLowerCase() === 'confirmed' &&
            new Date(reservation.reservationDate) >= new Date()
        );
    };

    const isCancelledReservation = (reservation: ReservationDto) => {
        const status = reservation.status.toLowerCase();

        return (
            status === 'cancelled' ||
            status === 'canceled' ||
            status === 'rejected' ||
            status === 'declined'
        );
    };

   
    const filteredReservations = useMemo(() => {
        return reservations.filter(reservation => {
            const type = reservation.type.toLowerCase();

            const matchesMainTab =
                mainTab === 'Event'
                    ? type === 'event'
                    : type !== 'event';

            if (!matchesMainTab) {
                return false;
            }

            const status = reservation.status.toLowerCase();

            if (statusTab === 'Pending') {
                return status === 'pending';
            }

            if (statusTab === 'Confirmed') {
                return status === 'confirmed';
            }

            if (statusTab === 'Cancelled') {
                return isCancelledReservation(reservation);
            }

            if (statusTab === 'Upcoming') {
                return isUpcomingReservation(reservation);
            }

            if (statusTab === 'Past') {
                return (
                    reservation.status.toLowerCase() === 'confirmed' &&
                    isPastReservation(reservation)
                );
            }

            return true;
        });
    }, [reservations, mainTab, statusTab]);

    const canReviewReservation = (reservation: ReservationDto) => {
        return (
            reservation.status.toLowerCase() === 'confirmed' &&
            isPastReservation(reservation) &&
            !reservation.hasReview
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('ro-RO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getCurrentTypeReservations = () => {
        return reservations.filter(reservation => {
            const type = reservation.type.toLowerCase();

            return mainTab === 'Event'
                ? type === 'event'
                : type !== 'event';
        });
    };

    const getStatusCount = (tab: ReservationStatusTab) => {
        const currentTypeReservations = getCurrentTypeReservations();

        if (tab === 'Pending') {
            return currentTypeReservations.filter(
                reservation => reservation.status.toLowerCase() === 'pending'
            ).length;
        }

        if (tab === 'Confirmed') {
            return currentTypeReservations.filter(
                reservation => reservation.status.toLowerCase() === 'confirmed'
            ).length;
        }

        if (tab === 'Upcoming') {
            return currentTypeReservations.filter(isUpcomingReservation).length;
        }

        if (tab === 'Past') {
            return currentTypeReservations.filter(
                reservation =>
                    reservation.status.toLowerCase() === 'confirmed' &&
                    isPastReservation(reservation)
            ).length;
        }

        if (tab === 'Cancelled') {
            return currentTypeReservations.filter(isCancelledReservation).length;
        }

        return 0;
    };

    const statusFlowItems: {
        key: ReservationStatusTab;
        label: string;
        helper: string;
    }[] = [
            {
                key: 'Pending',
                label: 'Pending',
                helper: 'Așteaptă răspuns'
            },
            {
                key: 'Confirmed',
                label: 'Confirmate',
                helper: 'Acceptate de restaurant'
            },
            {
                key: 'Upcoming',
                label: 'Upcoming',
                helper: 'Urmează'
            },
            {
                key: 'Past',
                label: 'Finalizate',
                helper: 'Poți lăsa review'
            },
            {
                key: 'Cancelled',
                label: 'Anulate',
                helper: 'Respinse sau anulate'
            }
        ];

    const getReservationTypeLabel = (reservation: ReservationDto) => {
        return reservation.type.toLowerCase() === 'event'
            ? 'eveniment'
            : 'rezervare masă';
    };

    if (loading) {
        return (
            <div className="my-reservations-page">
                <ClientNavbar
                    userRole={userRole}
                    onLogout={onLogout}
                    onBack={onBack}
                    onAccountDetailsClick={onAccountDetailsClick}
                    onMyReservationsClick={onMyReservationsClick}
                    onMyReviewsClick={onMyReviewsClick}
                />

                <main className="my-reservations-loading">
                    <span className="my-reservations-kicker">contul meu</span>
                    <p>Se încarcă rezervările...</p>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="my-reservations-page">
            <ClientNavbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
                onAccountDetailsClick={onAccountDetailsClick}
                onMyReservationsClick={onMyReservationsClick}
                onMyReviewsClick={onMyReviewsClick}
            />

            <main className="my-reservations-container">
                <section className="my-reservations-hero">
                    <span className="my-reservations-kicker">contul meu</span>

                    <h1>Rezervările tale</h1>

                    <p>
                        Urmărește statusul rezervărilor, verifică experiențele trecute
                        și lasă review pentru restaurantele pe care le-ai vizitat.
                    </p>
                </section>

                <section className="my-reservations-control-panel">
                    <div className="my-reservations-type-switch">
                        <button
                            type="button"
                            className={mainTab === 'Table' ? 'active' : ''}
                            onClick={() => setMainTab('Table')}
                        >
                            Rezervări normale
                        </button>

                        <button
                            type="button"
                            className={mainTab === 'Event' ? 'active' : ''}
                            onClick={() => setMainTab('Event')}
                        >
                            Rezervări evenimente
                        </button>
                    </div>

                    <div className="my-reservations-journey">
                        {statusFlowItems.map((item, index) => (
                            <button
                                key={item.key}
                                type="button"
                                className={[
                                    'my-reservations-journey-step',
                                    statusTab === item.key ? 'active' : '',
                                    index < statusFlowItems.length - 1 ? 'with-line' : ''
                                ].join(' ')}
                                onClick={() => setStatusTab(item.key)}
                            >
                                <span className="journey-count">
                                    {getStatusCount(item.key)}
                                </span>

                                <span className="journey-text">
                                    <strong>{item.label}</strong>
                                    <small>{item.helper}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="my-reservations-filters-box">
                    <div className="my-reservations-filter-group">
                        <span className="my-reservations-tabs-label">
                            Tip rezervare
                        </span>

                        <div className="my-reservations-tabs">
                            <button
                                type="button"
                                className={mainTab === 'Table' ? 'active' : ''}
                                onClick={() => setMainTab('Table')}
                            >
                                Rezervări normale
                            </button>

                            <button
                                type="button"
                                className={mainTab === 'Event' ? 'active' : ''}
                                onClick={() => setMainTab('Event')}
                            >
                                Rezervări evenimente
                            </button>
                        </div>
                    </div>

                    <div className="my-reservations-filter-group">
                        <span className="my-reservations-tabs-label">
                            Status
                        </span>

                        <div className="my-reservations-status-tabs">
                            {(['Pending', 'Confirmed', 'Cancelled', 'Upcoming', 'Past'] as ReservationStatusTab[]).map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={statusTab === tab ? 'active' : ''}
                                    onClick={() => setStatusTab(tab)}
                                >
                                    {tab === 'Pending' && 'Pending'}
                                    {tab === 'Confirmed' && 'Confirmate'}
                                    {tab === 'Cancelled' && 'Anulate'}
                                    {tab === 'Upcoming' && 'Upcoming'}
                                    {tab === 'Past' && 'Finalizate'}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {filteredReservations.length === 0 ? (
                    <section className="my-reservations-empty">
                        <div className="my-reservations-empty-mark">V</div>

                        <h2>Nu ai rezervări în această categorie</h2>

                        <p>
                            Schimbă filtrul de status sau explorează restaurantele disponibile
                            pentru o experiență nouă.
                        </p>
                    </section>
                ) : (
                    <section className="my-reservations-list">
                        {filteredReservations.map(reservation => (
                            <article
                                className={`my-reservation-card ${reservation.type.toLowerCase() === 'event'
                                        ? 'my-reservation-card-event'
                                        : 'my-reservation-card-table'
                                    }`}
                                key={reservation.id}
                            >
                                <div className="my-reservation-main">
                                    <span className="my-reservations-kicker">
                                        {getReservationTypeLabel(reservation)}
                                    </span>

                                    <h2>{reservation.restaurantName}</h2>

                                    <p className="my-reservation-address">
                                        {reservation.restaurantAddress}
                                    </p>

                                    <div className="my-reservation-meta">
                                        <span>{formatDate(reservation.reservationDate)}</span>
                                        <span>{reservation.numberOfPeople} persoane</span>

                                        <span className={`status status-${reservation.status.toLowerCase()}`}>
                                            {reservation.status}
                                        </span>
                                    </div>

                                    {reservation.eventTypeName && (
                                        <p className="my-reservation-event-type">
                                            Tip eveniment: {reservation.eventTypeName}
                                        </p>
                                    )}

                                    {reservation.estimatedTotalCost > 0 && (
                                        <p className="my-reservation-event-type">
                                            Cost estimativ: {reservation.estimatedTotalCost.toLocaleString('ro-RO')} RON
                                        </p>
                                    )}

                                    {reservation.specialRequests && (
                                        <p className="my-reservation-notes">
                                            {reservation.specialRequests}
                                        </p>
                                    )}
                                </div>

                                <div className="my-reservation-actions">
                                    {statusTab === 'Past' && reservation.hasReview && (
                                        <span className="review-assigned-badge">
                                            Review atribuit
                                        </span>
                                    )}

                                    {statusTab === 'Past' && canReviewReservation(reservation) && (
                                        <button
                                            type="button"
                                            className="leave-review-btn"
                                            onClick={() => setSelectedReservation(reservation)}
                                        >
                                            Lasă review
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            {selectedReservation && (
                <ReviewModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                    onReviewCreated={async () => {
                        setSelectedReservation(null);
                        await loadReservations();
                    }}
                />
            )}

            <Footer />
        </div>
    );
};

interface ReviewModalProps {
    reservation: ReservationDto;
    onClose: () => void;
    onReviewCreated: () => void;
}

const ReviewModal = ({
    reservation,
    onClose,
    onReviewCreated
}: ReviewModalProps) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleFilesChange = (files: FileList | null) => {
        if (!files) return;

        const selectedFiles = Array.from(files).slice(0, 5);
        setImages(selectedFiles);
    };

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            alert('Alege un rating între 1 și 5 stele.');
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('ReservationId', reservation.id);
            formData.append('Rating', rating.toString());

            if (comment.trim()) {
                formData.append('Comment', comment.trim());
            }

            images.forEach(image => {
                formData.append('Images', image);
            });

            await apiService.createReview(formData);

            alert('Review-ul a fost trimis.');
            onReviewCreated();
        } catch (error: any) {
            console.error('Failed to create review:', error);
            alert(error.message || 'Nu s-a putut trimite review-ul.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-backdrop">
            <div className="review-modal">
                <button
                    type="button"
                    className="review-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <span className="my-reservations-kicker">review</span>

                <h2>{reservation.restaurantName}</h2>

                <p>
                    Spune cum a fost experiența ta. Review-ul va fi afișat pe pagina restaurantului.
                </p>

                <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            className={star <= rating ? 'active' : ''}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Scrie un comentariu despre experiență..."
                />

                <label className="review-file-label">
                    Adaugă poze
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFilesChange(e.target.files)}
                    />
                </label>

                {images.length > 0 && (
                    <div className="review-selected-images">
                        {images.map(image => (
                            <span key={image.name}>
                                {image.name}
                            </span>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    className="review-submit-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Se trimite...' : 'Trimite review'}
                </button>
            </div>
        </div>
    );
};