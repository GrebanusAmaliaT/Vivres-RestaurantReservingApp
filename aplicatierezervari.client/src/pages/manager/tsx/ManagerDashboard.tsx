import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import type { ReservationDto } from '../../../types/index';
import '../css/ManagerDashboard.css';

import { Navbar } from '../../../components/tsx/Navbar';
import { Footer } from '../../../components/tsx/Footer';

interface ManagerDashboardProps {
    restaurantName: string;
    onEditProfileClick: () => void;
    onManageEventsClick: () => void;
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
    restaurantName,
    onEditProfileClick,
    onManageEventsClick,
    userRole,
    onLogout,
    onBack
}) => {
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiService.getManagerReservations();
            setReservations(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Nu s-au putut incarca rezervarile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const pendingRequests = reservations.filter(
        reservation => reservation.status.toLowerCase() === 'pending'
    );

    const confirmedRequests = reservations.filter(
        reservation => reservation.status.toLowerCase() === 'confirmed'
    );

    const rejectedRequests = reservations.filter(
        reservation => reservation.status.toLowerCase() === 'rejected'
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleTimeString('ro-RO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getReservationTypeLabel = (type: string) => {
        return type.toLowerCase() === 'event'
            ? 'Eveniment'
            : 'Rezervare masa';
    };

    const handleUpdateStatus = async (
        reservationId: string,
        status: 'Confirmed' | 'Rejected'
    ) => {
        try {
            setUpdatingId(reservationId);
            setError(null);

            await apiService.updateReservationStatus(reservationId, status);
            await loadReservations();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Nu s-a putut actualiza statusul rezervarii.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center dashboard-container">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3 text-muted font-monospace small">
                    Se incarca cererile de rezervare...
                </p>
            </div>
        );
    }

    return (
        <div className="manager-dashboard-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}

            />
                 <div className="container py-5 text-start dashboard-container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-4 mb-5 gap-3">
                <div>
                    <span className="text-uppercase font-monospace text-muted small tracking-wider">
                        Manager Control Panel
                    </span>
                    <h1 className="h2 fw-bold m-0 mt-1">{restaurantName}</h1>
                </div>

                <div className="d-flex gap-2">
                    <button
                        onClick={loadReservations}
                        className="btn btn-outline-dark font-monospace text-uppercase shadow-none btn-sm"
                    >
                        Reincarca
                    </button>

                    <button
                        onClick={onEditProfileClick}
                        className="btn btn-outline-dark font-monospace text-uppercase shadow-none edit-profile-btn"
                    >
                        Editeaza profilul
                        </button>

                     <button
                            onClick={onManageEventsClick}
                            className="btn btn-outline-dark font-monospace text-uppercase shadow-none btn-sm"
                        >
                            Configureaza evenimente
                     </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger small font-monospace">
                    {error}
                </div>
            )}

            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">
                            In asteptare
                        </span>
                        <span className="display-6 fw-bold text-warning">
                            {pendingRequests.length}
                        </span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">
                            Confirmate
                        </span>
                        <span className="display-6 fw-bold text-success">
                            {confirmedRequests.length}
                        </span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">
                            Respins
                        </span>
                        <span className="display-6 fw-bold text-danger">
                            {rejectedRequests.length}
                        </span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">
                            Total
                        </span>
                        <span className="display-6 fw-bold">
                            {reservations.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h2 className="h4 fw-bold mb-1">
                    Cereri de rezervare in asteptare
                </h2>
                <p className="text-muted small fw-light m-0">
                    Accepta sau respinge cererile trimise de clienti. O rezervare devine confirmata doar dupa acceptare.
                </p>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="border rounded-4 p-5 text-center bg-light my-4 text-muted font-monospace">
                    Nu exista cereri de rezervare in asteptare.
                </div>
            ) : (
                <div className="table-responsive border rounded-4 shadow-sm bg-white overflow-hidden mb-5">
                    <table className="table table-hover align-middle m-0 dashboard-table">
                        <thead className="table-dark font-monospace text-uppercase small dashboard-table-header">
                            <tr>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3">Tip</th>
                                <th className="py-3 text-center">Persoane</th>
                                <th className="py-3">Data si ora</th>
                                <th className="py-3">Mentiuni</th>
                                <th className="py-3 text-end px-4">Actiuni</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendingRequests.map(request => (
                                <tr key={request.id} className="dashboard-table-row">
                                    <td className="py-3 px-4">
                                        <span className="fw-bold d-block">
                                            {request.userEmail || 'Client'}
                                        </span>
                                    </td>

                                    <td className="py-3">
                                        <span className="badge bg-light text-dark border text-uppercase font-monospace">
                                            {getReservationTypeLabel(request.type)}
                                        </span>
                                    </td>

                                    <td className="py-3 text-center fw-bold fs-5 text-dark">
                                        {request.numberOfPeople}
                                    </td>

                                    <td className="py-3 font-monospace small">
                                        <span className="d-block fw-bold">
                                            {formatDate(request.reservationDate)}
                                        </span>
                                        <span className="text-muted">
                                            {formatTime(request.reservationDate)}
                                        </span>
                                    </td>

                                    <td className="py-3 text-muted small fw-light table-notes-cell">
                                        {request.specialRequests || (
                                            <span className="fst-italic">
                                                Fara mentiuni
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3 text-end px-4">
                                        <div className="d-inline-flex gap-2">
                                            <button
                                                disabled={updatingId === request.id}
                                                onClick={() => handleUpdateStatus(request.id, 'Confirmed')}
                                                className="btn btn-success btn-sm px-3 font-monospace text-uppercase fw-bold shadow-none action-btn-approve"
                                            >
                                                Accepta
                                            </button>

                                            <button
                                                disabled={updatingId === request.id}
                                                onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                                className="btn btn-outline-danger btn-sm px-3 font-monospace text-uppercase fw-bold shadow-none action-btn-reject"
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

            <div className="mb-4">
                <h2 className="h4 fw-bold mb-1">
                    Istoric rezervari
                </h2>
                <p className="text-muted small fw-light m-0">
                    Toate cererile primite pana acum.
                </p>
            </div>

            {reservations.length === 0 ? (
                <div className="border rounded-4 p-5 text-center bg-light my-4 text-muted font-monospace">
                    Nu exista rezervari pentru acest restaurant.
                </div>
            ) : (
                <div className="table-responsive border rounded-4 shadow-sm bg-white overflow-hidden">
                    <table className="table table-hover align-middle m-0 dashboard-table">
                        <thead className="table-light font-monospace text-uppercase small">
                            <tr>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3">Data si ora</th>
                                <th className="py-3 text-center">Persoane</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 px-4">Cost estimat</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservations.map(request => (
                                <tr key={request.id}>
                                    <td className="py-3 px-4">
                                        {request.userEmail || 'Client'}
                                    </td>

                                    <td className="py-3 font-monospace small">
                                        <span className="d-block fw-bold">
                                            {formatDate(request.reservationDate)}
                                        </span>
                                        <span className="text-muted">
                                            {formatTime(request.reservationDate)}
                                        </span>
                                    </td>

                                    <td className="py-3 text-center fw-bold">
                                        {request.numberOfPeople}
                                    </td>

                                    <td className="py-3">
                                        <span className="badge bg-light text-dark border text-uppercase font-monospace">
                                            {request.status}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4">
                                        {request.estimatedTotalCost > 0
                                            ? `${request.estimatedTotalCost} RON`
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
            <Footer />
        </div>
    );
};