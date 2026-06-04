import { useEffect, useState } from 'react';
import { Navbar } from '../../components/tsx/Navbar';
import { Footer } from '../../components/tsx/Footer';
import { apiService } from '../../services/api';
import './AdminDashboardPage.css';
import type { AdminRestaurantDto, AdminUserDto, ReviewDto } from '../../types/index';

interface AdminDashboardPageProps {
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
    onAccountClick: () => void;
}

export const AdminDashboardPage = ({
    userRole,
    onLogout,
    onBack,
    onAccountClick
}: AdminDashboardPageProps) => {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [restaurants, setRestaurants] = useState<AdminRestaurantDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingReviews, setPendingReviews] = useState<ReviewDto[]>([]);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersData, restaurantsData, pendingReviewsData] = await Promise.all([
                apiService.getAdminUsers(),
                apiService.getAdminRestaurants(),
                apiService.getAdminPendingReviews()
            ]);

            setUsers(usersData);
            setRestaurants(restaurantsData);
            setPendingReviews(pendingReviewsData);

        } catch (err) {
            console.error(err);
            setError('Nu s-au putut încărca datele de admin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const clientCount = users.filter(user => user.roles.includes('Client')).length;
    const managerCount = users.filter(user => user.roles.includes('RestaurantManager')).length;
    const adminCount = users.filter(user => user.roles.includes('Admin')).length;
    const eventRestaurantsCount = restaurants.filter(restaurant => restaurant.acceptsEvents).length;
    const handleDeleteUser = async (userId: string) => {
        const confirmed = window.confirm('Sigur vrei sa stergi acest cont?');

        if (!confirmed) {
            return;
        }

        try {
            await apiService.deleteAdminUser(userId);
            await loadAdminData();
        } catch (err: any) {
            alert(err.message || 'Nu s-a putut sterge contul.');
        }
    };

    const handleApproveReview = async (reviewId: string) => {
        try {
            await apiService.approveAdminReview(reviewId);
            await loadAdminData();
        } catch {
            alert('Nu s-a putut aproba review-ul.');
        }
    };

    const handleRejectReview = async (reviewId: string) => {
        const confirmed = window.confirm('Sigur vrei sa respingi/stergi acest review?');

        if (!confirmed) {
            return;
        }

        try {
            await apiService.rejectAdminReview(reviewId);
            await loadAdminData();
        } catch {
            alert('Nu s-a putut respinge review-ul.');
        }
    };

    return (
        <div className="admin-dashboard-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onAccountClick={onAccountClick}
                onBack={onBack}
            />

            <main className="admin-dashboard-container">
                <section className="admin-dashboard-hero">
                    <span className="admin-dashboard-kicker">platform admin</span>

                    <h1>Panou de administrare Vivres</h1>

                    <p>
                        Aici poți verifica utilizatorii, restaurantele, reviewurile în așteptare
                        și datele globale ale platformei.
                    </p>
                </section>

                {error && (
                    <div className="admin-dashboard-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <section className="admin-dashboard-loading">
                        Se încarcă datele...
                    </section>
                ) : (
                    <>
                        <section className="admin-dashboard-stats">
                            <div>
                                <span>Total useri</span>
                                <strong>{users.length}</strong>
                            </div>

                            <div>
                                <span>Clienți</span>
                                <strong>{clientCount}</strong>
                            </div>

                            <div>
                                <span>Manageri</span>
                                <strong>{managerCount}</strong>
                            </div>

                            <div>
                                <span>Admini</span>
                                <strong>{adminCount}</strong>
                            </div>

                            <div>
                                <span>Restaurante</span>
                                <strong>{restaurants.length}</strong>
                            </div>

                            <div>
                                <span>Reviewuri pending</span>
                                <strong>{pendingReviews.length}</strong>
                            </div>
                        </section>

                        <section className="admin-dashboard-grid">
                            <div className="admin-dashboard-card">
                                <div className="admin-dashboard-card-header">
                                    <span className="admin-dashboard-kicker">users</span>
                                    <h2>Utilizatori</h2>
                                </div>

                                <div className="admin-dashboard-table-wrapper">
                                    <table className="admin-dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Roluri</th>
                                                <th>Profil complet</th>
                                                <th>Acțiuni</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.email}</td>
                                                    <td>{user.roles.join(', ')}</td>
                                                    <td>{user.hasProfileCompleted ? 'Da' : 'Nu'}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="admin-danger-btn"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            disabled={
                                                                user.roles.includes('Admin') ||
                                                                user.roles.includes('RestaurantManager')
                                                            }
                                                        >
                                                            Șterge
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="admin-dashboard-card">
                                <div className="admin-dashboard-card-header">
                                    <span className="admin-dashboard-kicker">restaurants</span>
                                    <h2>Restaurante</h2>
                                </div>

                                <div className="admin-dashboard-table-wrapper">
                                    <table className="admin-dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Nume</th>
                                                <th>Oraș</th>
                                                <th>Capacitate</th>
                                                <th>Evenimente</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {restaurants.map(restaurant => (
                                                <tr key={restaurant.id}>
                                                    <td>{restaurant.name}</td>
                                                    <td>{restaurant.cityName}</td>
                                                    <td>{restaurant.capacity}</td>
                                                    <td>{restaurant.acceptsEvents ? 'Da' : 'Nu'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="admin-dashboard-card">
                                <div className="admin-dashboard-card-header">
                                    <span className="admin-dashboard-kicker">review approval</span>
                                    <h2>Reviewuri în așteptare</h2>
                                </div>

                                {pendingReviews.length === 0 ? (
                                    <p className="admin-empty-text">
                                        Nu există reviewuri care așteaptă aprobare.
                                    </p>
                                ) : (
                                    <div className="admin-dashboard-table-wrapper">
                                        <table className="admin-dashboard-table">
                                            <thead>
                                                <tr>
                                                    <th>Restaurant</th>
                                                    <th>User</th>
                                                    <th>Tip</th>
                                                    <th>Rating</th>
                                                    <th>Comentariu</th>
                                                    <th>Acțiuni</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {pendingReviews.map(review => (
                                                    <tr key={review.id}>
                                                        <td>{review.restaurantName}</td>
                                                        <td>{review.userEmail}</td>
                                                        <td>{review.type}</td>
                                                        <td>{review.rating}/5</td>
                                                        <td>{review.comment || '-'}</td>
                                                        <td>
                                                            <div className="admin-actions-row">
                                                                <button
                                                                    type="button"
                                                                    className="admin-approve-btn"
                                                                    onClick={() => handleApproveReview(review.id)}
                                                                >
                                                                    Aprobă
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="admin-danger-btn"
                                                                    onClick={() => handleRejectReview(review.id)}
                                                                >
                                                                    Respinge
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};