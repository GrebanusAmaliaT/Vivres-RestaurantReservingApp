import { useEffect, useMemo, useState } from 'react';
import { ClientNavbar } from '../../../components/tsx/NavbarClient';
import { Footer } from '../../../components/tsx/Footer';
import { apiService } from '../../../services/api';
import type { ReviewDto } from '../../../types/index';
import '../css/MyReviewsPage.css';

interface MyReviewsPageProps {
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
    onAccountDetailsClick: () => void;
    onMyReservationsClick: () => void;
    onMyReviewsClick: () => void;
}

type ReviewTab = 'All' | 'Table' | 'Event';

const API_ORIGIN = 'https://localhost:7065';

export const MyReviewsPage = ({
    userRole,
    onLogout,
    onBack,
    onAccountDetailsClick,
    onMyReservationsClick,
    onMyReviewsClick
}: MyReviewsPageProps) => {
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [activeTab, setActiveTab] = useState<ReviewTab>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await apiService.getMyReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        if (activeTab === 'All') {
            return reviews;
        }

        return reviews.filter(review => review.type.toLowerCase() === activeTab.toLowerCase());
    }, [reviews, activeTab]);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_ORIGIN}${url}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return [1, 2, 3, 4, 5].map(star => (
            <span key={star} className={star <= rating ? 'active' : ''}>
                ★
            </span>
        ));
    };

    const handleDeleteReview = async (reviewId: string) => {
        const confirmed = window.confirm('Sigur vrei sa stergi acest review?');

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(reviewId);
            await apiService.deleteReview(reviewId);
            await loadReviews();
        } catch (error) {
            console.error('Failed to delete review:', error);
            alert('Nu s-a putut sterge review-ul.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="my-reviews-page">
                <ClientNavbar
                    userRole={userRole}
                    onLogout={onLogout}
                    onBack={onBack}
                    onAccountDetailsClick={onAccountDetailsClick}
                    onMyReservationsClick={onMyReservationsClick}
                    onMyReviewsClick={onMyReviewsClick}
                />

                <main className="my-reviews-loading">
                    <span className="my-reviews-kicker">contul meu</span>
                    <p>Se incarca reviewurile...</p>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="my-reviews-page">
            <ClientNavbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
                onAccountDetailsClick={onAccountDetailsClick}
                onMyReservationsClick={onMyReservationsClick}
                onMyReviewsClick={onMyReviewsClick}
            />

            <main className="my-reviews-container">
                <section className="my-reviews-hero">
                    <span className="my-reviews-kicker">experiențele tale</span>

                    <h1>Reviewurile tale</h1>

                    <p>
                        Aici găsești toate reviewurile pe care le-ai lăsat restaurantelor.
                        Poți urmări experiențele trecute sau poți șterge un review.
                    </p>
                </section>

                <section className="my-reviews-tabs">
                    <button
                        type="button"
                        className={activeTab === 'All' ? 'active' : ''}
                        onClick={() => setActiveTab('All')}
                    >
                        Toate
                    </button>

                    <button
                        type="button"
                        className={activeTab === 'Table' ? 'active' : ''}
                        onClick={() => setActiveTab('Table')}
                    >
                        Rezervări normale
                    </button>

                    <button
                        type="button"
                        className={activeTab === 'Event' ? 'active' : ''}
                        onClick={() => setActiveTab('Event')}
                    >
                        Evenimente
                    </button>
                </section>

                {filteredReviews.length === 0 ? (
                    <section className="my-reviews-empty">
                        <div className="my-reviews-empty-mark">★</div>

                        <h2>Nu ai reviewuri în această categorie</h2>

                        <p>
                            După ce o rezervare confirmată trece, vei putea lăsa review
                            din pagina „Rezervările tale”.
                        </p>
                    </section>
                ) : (
                    <section className="my-reviews-list">
                        {filteredReviews.map(review => (
                            <article className="my-review-card" key={review.id}>
                                <div className="my-review-top">
                                    <div>
                                        <span className="my-reviews-kicker">
                                            {review.type.toLowerCase() === 'event'
                                                ? 'review eveniment'
                                                : 'review rezervare'}
                                        </span>

                                        <h2>{review.restaurantName}</h2>
                                    </div>

                                    <div className="my-review-stars">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                <div className="my-review-meta">
                                    <span>Rezervare: {formatDate(review.reservationDate)}</span>
                                    <span>Review: {formatDate(review.createdAt)}</span>
                                </div>

                                {review.comment && (
                                    <p className="my-review-comment">
                                        “{review.comment}”
                                    </p>
                                )}

                                {review.imageUrls && review.imageUrls.length > 0 && (
                                    <div className="my-review-images">
                                        {review.imageUrls.map(imageUrl => (
                                            <img
                                                key={imageUrl}
                                                src={getImageUrl(imageUrl)}
                                                alt="Review"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="my-review-actions">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={deletingId === review.id}
                                    >
                                        {deletingId === review.id ? 'Se sterge...' : 'Sterge review'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};